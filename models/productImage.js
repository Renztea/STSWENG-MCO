const mongoose = require('mongoose')

const productImageSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('productImage', productImageSchema)