const mongoose = require('mongoose')

const cookieSchema = new mongoose.Schema ({
    name: {
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

cookieSchema.index({name: 'text'})
module.exports = mongoose.model('cookie', cookieSchema)