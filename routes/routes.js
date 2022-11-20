const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation } = require('../validators.js')
const app = express();

// Customer pages
app.get('/', controller.getIndexPage)
app.get('/products/:type', controller.getProductPage)
app.get('/getProductInfo', controller.getProductInfo)

// Admin pages
app.get('/admin', controller.getAdminPage)
app.get('/admin/:type', controller.adminProductPage)
app.get('/admin/orders/:category', controller.getOrdersPage)
app.get('/deleteProduct', controller.deleteProduct)

// Form controllers
app.post('/addCake', addCakeValidation, controller.addCake)
app.post('/addCupcake', addCupcakeValidation, controller.addCupcake)
app.post('/addCookie', addCookieValidation, controller.addCookie)

// Page not found
app.get('*', controller.getErrorPage)

module.exports = app;