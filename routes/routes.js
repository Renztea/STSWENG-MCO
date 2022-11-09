const express = require('express');
const controller = require('../controllers/controller.js');
const app = express();

app.get('/', controller.getIndexPage)
app.get('/test', controller.getTestPage)
app.post('/addProduct', controller.addProduct)
app.get('/viewProduct', controller.viewProduct)

module.exports = app;