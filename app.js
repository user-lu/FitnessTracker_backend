require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require("morgan")
const client = require('./db/client');
client.connect();

// Setup your Middleware and API Router here 
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', require('./api'))


//error handling goes here
app.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message,
      error: error.message
    });
  });

module.exports = app;
