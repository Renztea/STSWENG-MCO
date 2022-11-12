const mongoose = require('mongoose')

const productTypeSchema = new mongoose.Schema ({
    type: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('productType', productTypeSchema)