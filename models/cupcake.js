const mongoose = require('mongoose')

const cupcakeSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    vanillaPrice: {
        type: Number,
        required: true
    },
    chocolatePrice: {
        type: Number,
        required: true
    },
    redvelvetPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    frosting: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('cupcake', cupcakeSchema)