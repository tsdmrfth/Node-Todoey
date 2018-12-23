const router = require('express').Router();
const { User } = require('../model/User')
const { authenticateMW } = require('./../middleware/authenticate')

router.post('/', (req, res) => {
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
        .then(() => {
            return newUser.generateToken()
        })
        .then(token => {
            res.header('x-auth', token).send({ newUser, token })
        })
        .catch(er => {
            if (er.code === 11000) {
                return res.status(400).send({ status: 11000, message: 'This email is already registered' })
            }
            res.status(400).send(er)
        })
})

router.get('/me', authenticateMW, (req, res) => {
    res.send(req.user)
})

module.exports = router