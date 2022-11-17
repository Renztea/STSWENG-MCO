const mongoose = require('mongoose')

const cakeSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    vanilla6x5price: {
        type: Number,
        required: true
    },
    vanilla8x5price: {
        type: Number,
        required: true
    },
    chocolate6x5price: {
        type: Number,
        required: true
    },
    chocolate8x5price: {
        type: Number,
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

module.exports = mongoose.model('cake', cakeSchema)