const mongoose = require('mongoose')

const productFlavorSchema = new mongoose.Schema ({
    type: {
        type: String,
        required: true
    },
    flavor: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('productFlavor', productFlavorSchema)