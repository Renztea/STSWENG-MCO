const dotenv = require('dotenv');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const authRouter = require('./routes/auth.js');
const db = require('./models/db.js');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./models/connection');
const fileUpload = require('express-fileupload');

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static('public'));
app.use(fileUpload());

db.connect();

app.use(session({
    secret: 'Jasperlikeshotdogs',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
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


app.listen(3000, 'Localhost', function(){
    console.log('Connected to Localhost:3000');
})

