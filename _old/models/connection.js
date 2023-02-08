const mongoose = require('mongoose');

const uri = "mongodb+srv://Gcakes:faga4791@gcakes.u6zonhc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err))

module.exports = mongoose;