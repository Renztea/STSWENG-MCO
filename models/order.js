const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    orderID: {
        type: String,
        required: true
    }, 
    celebrant: {
        type: String,
        required: true
    },
    celebrantGender: {
        type: String,
        required: true
    },
    celebrantAge: {
        type: Number,
        required: true
    },
    expectedPickUpDate: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    orders: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderPlacedDate: {
        type: String,
        required: true
    },
    orderPayedDate: {
        type: String,
        required: true
    },
    orderPickedUpDate: {
        type: String,
        required: true
    },
    orderCancelledDate: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('orders', orderSchema)