const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation } = require('../validators.js')
const app = express();

// Customer pages
app.get('/', controller.getIndexPage)
app.get('/products/:type', controller.getProductPage)

// Admin pages
app.get('/admin', controller.getAdminPage)
app.get('/admin/addCake', controller.adminCakePage)
app.get('/admin/addCupcake', controller.adminCupcakePage)
app.get('/admin/addCookie', controller.adminCookiePage)

// Form controllers
app.post('/addCake', addCakeValidation, controller.addCake)
app.post('/addCupcake', addCupcakeValidation, controller.addCupcake)
app.post('/addCookie', addCookieValidation, controller.addCookie)

module.exports = app;