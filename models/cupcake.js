const mongoose = require('mongoose')

const cupcakeSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    vanilla3ouncesprice: {
        type: Number,
        required: true
    },
    chocolate3ouncesprice: {
        type: Number,
        required: true
    },
    redvelvet3ouncesprice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('cupcake', cupcakeSchema)