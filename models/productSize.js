const mongoose = require('mongoose')

const productSizeSchema = new mongoose.Schema ({
    type: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('productSize', productSizeSchema)