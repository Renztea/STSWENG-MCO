const express = require('express');
const controller = require('../controllers/controller.js');
const app = express();

// Final
app.get('/', controller.getIndexPage)
app.get('/main', controller.getMainPage)
app.get('/admin', controller.getAdminPage)
app.get('/cakes', controller.getCakesPage)
app.get('/cookies', controller.getCookiesPage)
app.get('/cupcakes', controller.getCupcakesPage)

module.exports = app;