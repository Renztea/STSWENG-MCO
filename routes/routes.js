const express = require('express');
const controller = require('../controllers/controller.js');
const { addProductValidation } = require('../validators.js')
const app = express();

// Final
app.get('/', controller.getIndexPage)
app.get('/main', controller.getMainPage)
app.get('/admin', controller.getAdminPage)
app.get('/products/:type', controller.getProductPage)

//Under Testing
app.get('/addCake', controller.getAddCakePage)
app.post('/addCake', addProductValidation, controller.addCake)

module.exports = app;