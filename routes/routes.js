const express = require('express');
const controller = require('../controllers/controller.js');
const app = express();

// Final
app.get('/', controller.getIndexPage)
app.get('/admin', controller.getAdminPage)
app.get('/products', controller.getProducts)


// Testing with jasper
app.post('/addFlavor', controller.addFlavor)
app.post('/addSize', controller.addSize)
app.post('/addType', controller.addType)
app.get('/addFlavor', controller.runAddFlavor)
app.get('/addSize', controller.runAddSize)
app.get('/addType', controller.runAddType)
app.get('/addCake', controller.runAddCakePage)

module.exports = app;