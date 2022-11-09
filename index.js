const express = require('express');
const path = require('path');
// Form parsers
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// Database
const mongoose = require('mongoose');
const db = require('./models/connection');
// Routes
const routes = require('./routes/routes');
const authRouter = require('./routes/auth');
// Sessions
const session = require('express-session')
const connectMongo = require('connect-mongo')
const ejs = require('ejs')

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());

app.use('/', routes);
app.use('/', authRouter);

const PORT = 3000;
app.listen(PORT, () => console.log('Running Express on port ' + PORT));
