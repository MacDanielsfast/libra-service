require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const Libra = require('./libra_service.js')
const Faucent = require('./faucet.js')

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const AMOUNT_TO_MINT = process.env.AMOUNT_TO_MINT || 100

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', function (req, res) {
  res.send("Please read the docs here https://documenter.getpostman.com/view/1671913/S1a32SZ5?version=latest#14a7b4be-ecd3-4b64-905f-5f386a13727a")
})

app.post('/createWallet', async function (req, res) {
  console.log('req body', req.body)
  const libra = new Libra()

  let wallet = await libra.createAccount(AMOUNT_TO_MINT)
  console.log('wallet', wallet)
  res.send(wallet)
})

app.post('/getBalance', async function (req, res) {
  console.log('req body', req.body)
  const libra = new Libra()

  let address = req.body.address
  let wallet = await libra.getBalance(address)
  console.log('wallet', wallet)
  res.send(wallet)
})

app.post('/transfer', async function (req, res) {
  console.log('req body', req.body)
  const libra = new Libra()

  let fromAddress = req.body.fromAddress
  let mnemonic = req.body.mnemonic
  let toAddress = req.body.toAddress
  let amount = req.body.amount
  let wallet = await libra.transfer(fromAddress, mnemonic, toAddress, amount)
  console.log('wallet', wallet)
  res.send(wallet)
})

app.post('/transactionHistory', async function (req, res) {
  console.log('req body', req.body)
  const libra = new Libra()
  
  const address = req.body.address
  const event = req.body.event
  const transactions = await libra.queryTransaction(address, event)
  console.log(`query transaction event ${event}`)
  res.send(transactions)
})

app.post('/mint', async function (req, res) {
  try {
    console.log('req body', req.body)
    const faucent = new Faucent()
    
    const address = req.body.address
    const amount = req.body.amount
    console.log(`Minting amount ${amount}`)
    await faucent.getFaucetFromKulap(amount, address)

    res.send({
      address: address,
      amount: amount
    })

  } catch (error) {
    console.error(error)
  }
})


app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST} PORT: ${PORT}`)
})
