const express = require('express');
const path = require('path');
const ejs = require('ejs');
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
const session = require('express-session');
const connectMongo = require('connect-mongo');
// Error Messages
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());

app.use(session({
    secret: 'Jasperlikeshotdogs',
    store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/G-Cakes'}),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
    rolling: true
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use('/', routes);
app.use('/', authRouter);

const PORT = 3000;
app.listen(PORT, () => console.log('Running Express on port ' + PORT));
