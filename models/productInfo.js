const mongoose = require('mongoose')

const productInfoSchema = new mongoose.Schema ({
    /*
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
    */
    size: {
        type: String,
        required: true
    },
    flavor: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('productInfo', productInfoSchema)