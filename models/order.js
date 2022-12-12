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
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    orders: {
        type: Object,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    orderDate: {
        type: String,
        required: true
    },
    payByDate: {
        type: String,
        required: false
    },
    payDate: {
        type: String,
        required: false
    },
    pickUpDate: {
        type: String,
        required: false
    },
    cancelDate: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('orders', orderSchema)