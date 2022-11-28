const express = require('express');
const path = require('path');
const ejs = require('ejs');
// Form parsers
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// Cookie parser
const cookieParser = require('cookie-parser')
// Database
const mongoose = require('mongoose');
const db = require('./models/connection');
// Routes
const routes = require('./routes/routes');
const authRouter = require('./routes/auth');
// Sessions
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = require('connect-mongo');
// Error Messages
const flash = require('connect-flash');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());

app.use(session({
    secret: 'GCAKESISTHEBESTCAKEANDCOOKIESHOPINTHEWORLD',
    store: MongoStore.create({mongoUrl: 'mongodb+srv://Gcakes:faga4791@gcakes.u6zonhc.mongodb.net/?retryWrites=true&w=majority'}),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.editCakeError_msg = req.flash('editCakeError_msg')
    res.locals.editCupcakeError_msg = req.flash('editCupcakeError_msg')
    res.locals.editCookieError_msg = req.flash('editCookieError_msg')
    next();
});

app.use('/', authRouter);
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => console.log('Running Express on port ' + PORT));
