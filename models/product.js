const mongoose = require('mongoose')

const productInfoSchema = new mongoose.Schema ({
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

const testingProductSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    info: {
        type: [productInfoSchema],
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

module.exports = mongoose.model('productInfo', testingProductSchema)