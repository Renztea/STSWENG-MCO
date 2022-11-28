const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation, editCookieValidation} = require('../validators.js')
const { isPublic, isPrivate } = require('../middlewares/userAuth');
const app = express();

// Customer pages
app.get('/', isPublic, controller.getIndexPage)
app.get('/products/:type', isPublic, controller.getProductPage)
app.get('/Basket', isPublic, controller.getBasketItem)
app.post('/postBasketItem', isPublic, controller.postBasketItem)
app.get('/updateBasketItem', isPublic, controller.updateBasketItem)
app.get('/removeBasketItem', isPublic, controller.removeBasketItem)

// Admin pages
app.get('/Admin', isPublic, controller.getAdminPage)
app.get('/getProductInfo', isPrivate, controller.getProductInfo)
app.get('/Admin/:type', isPrivate, controller.adminProductPage)
app.get('/Admin/orders/:category', isPrivate, controller.getOrdersPage)
app.get('/deleteProduct', isPrivate, controller.deleteProduct)

// Form controllers
app.post('/addCake', isPrivate, addCakeValidation, controller.addCake)
app.post('/addCupcake', isPrivate, addCupcakeValidation, controller.addCupcake)
app.post('/addCookie', isPrivate, addCookieValidation, controller.addCookie)
app.post('/editCake', isPrivate, editCakeValidation, controller.editCake)
app.post('/editCupcake', isPrivate, editCupcakeValidation, controller.editCupcake)
app.post('/editCookie', isPrivate, editCookieValidation, controller.editCookie)


// No BackEnd UI
app.get('/OrderInformation', isPublic, controller.getOrderInformationPage)

// Page not found
app.get('*', controller.getErrorPage)

module.exports = app;