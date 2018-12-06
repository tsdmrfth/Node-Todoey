const mongoose = require('mongoose');
const validator = require('validator')

module.exports.User = mongoose.model('User', {
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