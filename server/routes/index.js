const router = require('express').Router();

const users = require('./users')
const todos = require('./todos')

router.use('/users', users)
router.use('/todos', todos)

module.exports = router;