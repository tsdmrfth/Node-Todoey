const mongoose = require('mongoose');
const validator = require('validator')
const JWT = require('jsonwebtoken')
const pick = require('lodash/pick')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            validator: validator.isEmail
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    return pick(user, ['_id', 'email'])
}

userSchema.methods.generateToken = function () {
    const user = this
    const access = 'auth'
    const token = JWT.sign({ _id: user._id.toHexString(), access }, 'baba.js').toString()
    user.tokens.push({ access, token })
    return user.save().then(() => {
        return token
    })
}

module.exports.User = mongoose.model('User', userSchema)