const mongoose = require('mongoose')

const cakeSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    vanilla6x5Price: {
        type: Number,
        required: true
    },
    vanilla8x5Price: {
        type: Number,
        required: true
    },
    chocolate6x5Price: {
        type: Number,
        required: true
    },
    chocolate8x5Price: {
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
    numberCake: {
        type: Boolean,
        required: true
    },
    numberCakePrice: {
        type: Number,
        required: true
    }
})

cakeSchema.index({name: 'text'})
module.exports = mongoose.model('cake', cakeSchema)