const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation} = require('../validators.js')
const app = express();

// Customer pages
app.get('/', controller.getIndexPage)
app.get('/products/:type', controller.getProductPage)
app.get('/Basket', controller.getBasketItem)
app.get('/getProductInfo', controller.getProductInfo)
app.post('/postBasketItem', controller.postBasketItem)
app.get('/updateBasketItem', controller.updateBasketItem)
app.post('/removeBasketItem', controller.removeBasketItem)

// Admin pages
app.get('/admin', controller.getAdminPage)
app.get('/admin/:type', controller.adminProductPage)
app.get('/admin/orders/:category', controller.getOrdersPage)
app.get('/deleteProduct', controller.deleteProduct)

// Form controllers
app.post('/addCake', addCakeValidation, controller.addCake)
app.post('/addCupcake', addCupcakeValidation, controller.addCupcake)
app.post('/addCookie', addCookieValidation, controller.addCookie)
app.post('/editCake', editCakeValidation, controller.editCake)
app.post('/editCupcake', editCupcakeValidation, controller.editCupcake)
//app.post('/editCake', addCakeValidation, controller.editCake)

// Page not found
app.get('*', controller.getErrorPage)

module.exports = app;