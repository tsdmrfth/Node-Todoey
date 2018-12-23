const mongoose = require('mongoose');
const validator = require('validator')
const JWT = require('jsonwebtoken')
const pick = require('lodash/pick')
const bcrypt = require('bcryptjs')

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

userSchema.statics.findByToken = function (token) {
    const User = this
    let decoded;
    try {
        decoded = JWT.verify(token, 'baba.js')
    } catch (error) {
        return Promise.reject({ code: 10000, message: 'User not found' })
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

userSchema.statics.findByCredentials = function (email, password) {
    const User = this
    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject({ status: 19000, message: 'User not found' })
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, success) => {
                if (success) {
                    resolve(user)
                } else {
                    reject({ status: 19100, message: 'Invalid credentials' })
                }
            })
        })
    })
}

userSchema.pre('save', function (next) {
    const user = this
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

module.exports.User = mongoose.model('User', userSchema)