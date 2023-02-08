const express = require('express')
const app = express()
// Form Parsers
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// Cookie Parser
const cookieParser = require('cookie-parser')
// // Database
// const mongoose = require('mongoose')
// const db = require('./models/connection')
// // Routes
// const routes = require('./routes/routes')
// const authRouter = require('./routes/auth')
// // Sessions
// const session = require('express-session')
// const connectMongo = require('connect-mongo')
// const MongoStore = require('connect-mongo')
// Error Messages
const flash = require('connect-flash')
// dotenv
require('dotenv').config()

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(5000, () => {
    console.log("Server running on port 5000")
})