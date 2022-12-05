const mongoose = require('mongoose')

const cupcakeSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    vanillaFondantPrice: {
        type: Number,
        required: true
    },
    vanillaIcingPrice: {
        type: Number,
        required: true
    },
    chocolateFondantPrice: {
        type: Number,
        required: true
    },
    chocolateIcingPrice: {
        type: Number,
        required: true
    },
    redvelvetFondantPrice: {
        type: Number,
        required: true
    },
    redvelvetIcingPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
})

cupcakeSchema.index({name: 'text'})
module.exports = mongoose.model('cupcake', cupcakeSchema)