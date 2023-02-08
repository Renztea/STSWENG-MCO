const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema ({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    }
})

module.exports = mongoose.model('users', usersSchema)