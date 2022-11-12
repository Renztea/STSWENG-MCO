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

// Testing with jasper
app.post('/addFlavor', controller.addFlavor)
app.post('/addSize', controller.addSize)
app.post('/addType', controller.addType)
app.post('/addCakeJasper', controller.addCakeJasper)
app.get('/addFlavor', controller.runAddFlavor)
app.get('/addSize', controller.runAddSize)
app.get('/addType', controller.runAddType)
app.get('/addCake', controller.runAddCakePage)

module.exports = app;