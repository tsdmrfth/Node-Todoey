const mongoose = require('mongoose')
const { Todo } = require('../model/Todo')
const { User } = require('../model/User')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

const newTodo = new Todo({
    text: 'Add todos',
    completed: false
})

/* newTodo.save()
    .then(res => {
        console.log('Todo saved: ', res)
    })
    .catch(err => {
        console.log('Unable to add todo', err)
    }) */

const newUser = new User({
    email: 'tsdmrfth@gmail.com',
    password: 'superbum',
    age: 22,
})

newUser.save()
    .then(res => {
        console.log('User saved: ', res)
    })
    .catch(err => {
        console.log('Unable to add user', err)
    })