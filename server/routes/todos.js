const { ObjectID } = require('mongodb')

const { Todo } = require('./../model/Todo')
const router = require('express').Router();

router.post('/', (req, res) => {
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

router.get('/', (req, res) => {
    Todo.find()
        .then(todos => {
            res.send({ todos })
        })
        .catch(err => {
            res.status(500).send('Could not fetch todos')
        })
})

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.patch('/:id', (req, res) => {
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

module.exports = router