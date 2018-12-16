const { User } = require('../model/User');

const authenticateMW = (req, res, next) => {
    const token = req.header('x-auth')

    User.findByToken(token).then(user => {
        if (!user) {
            return Promise.reject()
        }
        req.user = user
        req.token = token
        next()
    }).catch(e => {
        const { code, message } = e
        res.status(401).send({ code, message })
    })
}

module.exports = { authenticateMW }