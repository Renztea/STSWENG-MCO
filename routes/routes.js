const express = require('express');
const controller = require('../controllers/controller.js');
const { addProductValidation } = require('../validators.js')
const app = express();

// Customer pages
app.get('/', controller.getIndexPage)
app.get('/products/:type', controller.getProductPage)

// Admin pages
app.get('/admin', controller.getAdminPage)
app.get('/addCake', controller.getAddCakePage)
app.post('/addCake', addProductValidation, controller.addCake)

module.exports = app;