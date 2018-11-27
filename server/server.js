const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./model/Todo')
const { User } = require('./model/User')

const app = express()
app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    const { body } = req
    if (body) {
        const { text, completed } = body
        if (text) {
            const newTodo = new Todo({
                text,
                completed: completed || false
            });
            newTodo.save()
                .then(doc => {
                    res.status(200).send({
                        text: doc.text,
                        message: 'Successfully added todo.'
                    })
                }, (er) => {
                    res.status(500).send('Unable to add todo!')
                })

        } else {
            res.status(400).send('Can not add todo without "text"')
        }
    } else {
        res.status(400).send('Can not add todo!!')
    }
})

app.get('/todos', (req, res) => {
    Todo.find()
        .then(todos => {
            res.send({ todos })
        })
        .catch(err => {
            res.status(500).send('Could not fetch todos')
        })
})

app.listen(3400, () => {
    console.log('Started on port 3400')
})

module.exports = { app }