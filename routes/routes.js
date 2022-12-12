const express = require('express');
const controller = require('../controllers/controller.js');
const { addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation, editCookieValidation, orderInformationValidation, searchValidation} = require('../validators.js')
const { isPublic, isPrivate } = require('../middlewares/userAuth');
const app = express();

// Product Info
app.get('/getProductInfo', controller.getProductInfo)

// Customer pages
app.get('/', controller.getIndexPage) // Render HomePage
app.get('/products/:type', controller.getProductPage) // Render Product Page
app.post('/products/:type', searchValidation, controller.searchProduct) // Render Products depending on a customer's search input
app.get('/basket', controller.getBasketItem) // Render Basket Page
app.get('/about', controller.getAboutPage)
app.post('/postBasketItem', controller.postBasketItem) // Add product to basket
app.post('/updateBasketItem', controller.updateBasketItem) // Update product inside the basket
app.post('/removeBasketItem', controller.removeBasketItem) // Remove product from the basket
app.get('/orderInformation', controller.getOrderInformationPage) // Render a page where buyers can input their personal details
app.get('/getInformationChecker', orderInformationValidation, controller.getInformationChecker)
app.get('/summary', controller.getOrderSummary) // Render the summary of information of orders and personal information of customer
app.post('/orderComplete', controller.postOrderComplete) // Returns Success if order goes through
app.get('/deleteSession', controller.deleteCustomerSession) // Deletes the customer's session after every order


// Admin pages
app.get('/admin', controller.getAdminPage) // Renders the login page
app.get('/admin/:type', controller.adminProductPage) // Renders the product pages depending on the type
app.get('/admin/orders/:category', controller.getOrdersPage) // Renders the current pending orders of customers 
app.get('/getOrdersView', controller.getOrdersView) // Get information about a specific product in the database
app.get('/deleteProduct', controller.deleteProduct) // Deletes a product from the database
app.get('/updateOrderStatus', controller.updateOrderStatus)

// Form controllers
app.post('/addCake', addCakeValidation, controller.addCake) // Adds a cake into the database
app.post('/addCupcake', addCupcakeValidation, controller.addCupcake) // Adds a cupcake into the database
app.post('/addCookie', addCookieValidation, controller.addCookie) // Adds a cookie into the database
app.post('/editCake', editCakeValidation, controller.editCake) // Edits an existing cake in the database
app.post('/editCupcake', editCupcakeValidation, controller.editCupcake) // Edits an existing cupcake in the database
app.post('/editCookie', editCookieValidation, controller.editCookie) // Edits an existing cookie in the database




// Page not found
app.get('*', controller.getErrorPage) // Renders an error page when a user goes to an unavailable page

/* with Authentication 
// Product Info
app.get('/getProductInfo', controller.getProductInfo)

// Customer pages
app.get('/', isPublic, controller.getIndexPage)
app.get('/products/:type', isPublic, controller.getProductPage)
app.get('/Basket', isPublic, controller.getBasketItem)
app.post('/postBasketItem', isPublic, controller.postBasketItem)
app.get('/updateBasketItem', isPublic, controller.updateBasketItem)
app.get('/removeBasketItem', isPublic, controller.removeBasketItem)

// Admin pages
app.get('/Admin', isPublic, controller.getAdminPage)
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
*/


module.exports = app;