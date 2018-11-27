const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/model/Todo')

const id = '5bfdd16e71b7abca9475b155'

Todo.find({ _id: id })
    .then(todo => {
        if (!todo) {
            return console.log('Could not found todo with id: ', id)
        }

        console.log('Todo: ', todo)
    })

Todo.findById(id)
    .then(todo => {
        if (!todo) {
            return console.log('Could not found todo with id: ', id)
        }
        console.log('Todo by id: ', todo)
    })