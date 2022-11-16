const mongoose = require('mongoose')

const productInfoSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    dedication: {
        type: Boolean,
        required: true
    },
    numbercake: {
        type: Boolean,
        required: true
    }


})

module.exports = mongoose.model('productInfo', productInfoSchema)