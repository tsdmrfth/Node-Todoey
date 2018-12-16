require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const routes = require('../server/routes')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./model/Todo')
const { User } = require('./model/User')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/api', routes)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`)
})

module.exports = { app }