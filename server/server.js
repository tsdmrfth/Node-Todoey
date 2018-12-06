require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./model/Todo')
const { User } = require('./model/User')

const app = express()
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
const PORT = process.env.PORT

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

app.get('/todos/:id', (req, res) => {
    const { id } = req.params
    if (id) {
        const isValidId = ObjectID.isValid(id)
        if (!isValidId) {
            return res.status(404).send('Id is not valid')
        }
        Todo.findById(id).then(todo => {
            if (!todo) {
                return res.status(404).send({ message: 'Todo not found' })
            }

            res.send({ todo })
        }).catch(err => {
            res.status(400).send(err)
        })
    } else {
        res.status(404).send('Id is required')
    }
})

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).send('Id is required')
    }

    const isValid = ObjectID.isValid(id)
    if (!isValid) {
        return res.status(404).send('Id is not valid')
    }

    Todo.findByIdAndDelete(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send('Todo not found')
            }

            res.send({ message: 'Succesfully deleted', todo })
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    let { completed, text } = req.body
    let completedAt = null

    if (!id) {
        return res.status(404).send('Id is required')
    }

    const isValid = ObjectID.isValid(id)
    if (!isValid) {
        return res.status(404).send('Id is not valid')
    }

    if (completed) {
        completedAt = new Date().getTime()
    } else {
        completed = false;
        completedAt = null
    }

    Todo.findOneAndUpdate(id, { $set: { completed, text, completedAt } }, { new: true }, (err, doc) => {
        if (err) {
            return res.status(404).send('Todo not found')
        }
        res.send({ todo: doc })
    })
})

app.post('/users', (req, res) => {
    const { email, password, age } = req.body
    if (!email) {
        return res.status(400).send('Email is required')
    }

    if (!password) {
        return res.status(400).send('Password is required')
    }

    const newUser = new User({
        email,
        password,
        age
    })

    newUser.save()
        .then(user => {
            res.send(user)
        }, er => {
            if (er.code === 11000) {
                return res.status(400).send('This email is already registered')
            }
            res.status(400).send(er)
        })
})

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`)
})

module.exports = { app }