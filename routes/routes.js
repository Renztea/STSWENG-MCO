const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation, editCookieValidation, orderInformationValidation, searchValidation} = require('../validators.js')
const { isPublic, isPrivate } = require('../middlewares/userAuth');
const app = express();

// Product Info
app.get('/getProductInfo', controller.getProductInfo)

// Customer pages
app.get('/', isPublic, controller.getIndexPage) // Render HomePage
app.get('/products/:type', isPublic, controller.getProductPage) // Render Product Page
app.post('/products/:type', isPublic, searchValidation, controller.searchProduct) // Render Products depending on a customer's search input
app.get('/basket', isPublic, controller.getBasketItem) // Render Basket Page
app.get('/about', isPublic, controller.getAboutPage)
app.post('/postBasketItem', isPublic, controller.postBasketItem) // Add product to basket
app.post('/updateBasketItem', isPublic, controller.updateBasketItem) // Update product inside the basket
app.post('/removeBasketItem', isPublic, controller.removeBasketItem) // Remove product from the basket
app.get('/orderInformation', isPublic, controller.getOrderInformationPage) // Render a page where buyers can input their personal details
app.get('/getInformationChecker', isPublic, orderInformationValidation, controller.getInformationChecker)
app.get('/summary', isPublic, controller.getOrderSummary) // Render the summary of information of orders and personal information of customer
app.post('/orderComplete', isPublic, controller.postOrderComplete) // Returns Success if order goes through
app.get('/deleteSession', isPublic, controller.deleteCustomerSession) // Deletes the customer's session after every order


// Admin pages
app.get('/admin', isPublic, controller.getAdminPage) // Renders the login page
app.get('/admin/:type', isPrivate, controller.adminProductPage) // Renders the product pages depending on the type
app.get('/admin/orders/:category', isPrivate, controller.getOrdersPage) // Renders the current pending orders of customers 
app.get('/getOrdersView', isPrivate, controller.getOrdersView) // Get information about a specific product in the database
app.get('/deleteProduct', isPrivate, controller.deleteProduct) // Deletes a product from the database
app.get('/updateOrderStatus', isPrivate, controller.updateOrderStatus) // Updates order status 
app.get('/undoOrderStatus', isPrivate, controller.undoOrderStatus) // Undo order status

// Form controllers
app.post('/addCake', isPrivate, addCakeValidation, controller.addCake) // Adds a cake into the database
app.post('/addCupcake', isPrivate, addCupcakeValidation, controller.addCupcake) // Adds a cupcake into the database
app.post('/addCookie', isPrivate, addCookieValidation, controller.addCookie) // Adds a cookie into the database
app.post('/editCake', isPrivate, editCakeValidation, controller.editCake) // Edits an existing cake in the database
app.post('/editCupcake', isPrivate, editCupcakeValidation, controller.editCupcake) // Edits an existing cupcake in the database
app.post('/editCookie', isPrivate, editCookieValidation, controller.editCookie) // Edits an existing cookie in the database

// Page not found
app.get('*', controller.getErrorPage) // Renders an error page when a user goes to an unavailable page

module.exports = app;