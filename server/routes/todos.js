const { ObjectID } = require('mongodb')
const router = require('express').Router();

const { Todo } = require('./../model/Todo')
const { authenticateMW } = require('./../middleware/authenticate')

router.post('/', authenticateMW, (req, res) => {
    const { body } = req
    if (body) {
        const { text, completed } = body
        if (text) {
            const newTodo = new Todo({
                text,
                completed: completed || false,
                owner: req.user._id
            });
            newTodo.save()
                .then(doc => {
                    res.status(200).send({
                        text: doc.text,
                        message: 'Successfully added todo.',
                        id: doc._id
                    })
                }, (er) => {
                    res.status(500).send(er)
                })

        } else {
            res.status(400).send('Can not add todo without "text"')
        }
    } else {
        res.status(400).send('Can not add todo!!')
    }
})

router.get('/', authenticateMW, (req, res) => {
    Todo.find()
        .then(todos => {
            res.send({ todos })
        })
        .catch(err => {
            res.status(500).send('Could not fetch todos')
        })
})

router.get('/:id', authenticateMW, (req, res) => {
    const { id } = req.params
    if (id) {
        const isValidId = ObjectID.isValid(id)
        if (!isValidId) {
            return res.status(404).send('Id is not valid')
        }
        Todo.findOne({
            _id: id,
            owner: req.user._id
        }).then(todo => {
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

router.delete('/:id', authenticateMW, (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).send('Id is required')
    }

    const isValid = ObjectID.isValid(id)
    if (!isValid) {
        return res.status(404).send('Id is not valid')
    }

    Todo.findOneAndDelete({
        _id: id,
        owner: req.user._id
    }).then(todo => {
        if (!todo) {
            return res.status(404).send('Todo not found')
        }

        res.send({ message: 'Succesfully deleted', todo })
    }).catch(err => {
        res.status(400).send(err)
    })
})

router.patch('/:id', authenticateMW, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        owner: req.user._id
    }, { $set: { completed, text, completedAt } }, { new: true }, (err, doc) => {
        if (err) {
            return res.status(404).send('Todo not found')
        }
        res.send({ todo: doc })
    })
})

module.exports = router