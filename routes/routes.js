const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation, editCookieValidation} = require('../validators.js')
const app = express();

// Customer pages
app.get('/', controller.getIndexPage)
app.get('/products/:type', controller.getProductPage)
app.get('/Basket', controller.getBasketItem)
app.get('/getProductInfo', controller.getProductInfo)
app.post('/postBasketItem', controller.postBasketItem)
app.get('/updateBasketItem', controller.updateBasketItem)
app.get('/removeBasketItem', controller.removeBasketItem)

// Admin pages
app.get('/Admin', controller.getAdminPage)
app.get('/Admin/:type', controller.adminProductPage)
app.get('/Admin/orders/:category', controller.getOrdersPage)
app.get('/deleteProduct', controller.deleteProduct)

// Form controllers
app.post('/addCake', addCakeValidation, controller.addCake)
app.post('/addCupcake', addCupcakeValidation, controller.addCupcake)
app.post('/addCookie', addCookieValidation, controller.addCookie)
app.post('/editCake', editCakeValidation, controller.editCake)
app.post('/editCupcake', editCupcakeValidation, controller.editCupcake)
app.post('/editCookie', editCookieValidation, controller.editCookie)

// No BackEnd UI
app.get('/OrderInformation', controller.getOrderInformationPage)

// Page not found
app.get('*', controller.getErrorPage)

module.exports = app;