const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    name: {
        type: String,
        required:true
    },
    sizes: {
        type: Array,
        required: true
    },
    flavors: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required:true
    },
})

module.exports = mongoose.model('product', productSchema)