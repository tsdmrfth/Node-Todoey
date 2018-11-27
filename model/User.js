const mongoose = require('mongoose');

module.exports.User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number
    }
})