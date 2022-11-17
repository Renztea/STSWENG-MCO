const mongoose = require('mongoose')

const cookieSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('cookie', cookieSchema)