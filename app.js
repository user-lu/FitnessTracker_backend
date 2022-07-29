require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require("morgan")
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', require('./api'))

// Setup your Middleware and API Router here 
//error handling goes here

module.exports = app;
