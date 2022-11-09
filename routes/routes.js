const express = require('express');
const controller = require('../controllers/controller.js');
const app = express();

app.get('/', controller.getIndexPage)
// Temp
app.get('/test', controller.getTestPage)

app.get('/admin', controller.getAdminPage)
//Temp
app.get('/addProductPage', controller.getAddProductPage)
// Temp
app.post('/addProduct', controller.addProduct)

// Temp
app.get('/viewProduct', controller.viewProduct)

// Temp
app.get('/product', controller.getProductPage)

module.exports = app;