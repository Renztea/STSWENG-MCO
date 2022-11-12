const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    flavor: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('product', productSchema)