const path = require('path')
const ejs = require('ejs') // Added
const fs = require('fs')
const { validationResult } = require('express-validator');
const Cake = require('../models/cake')
const Cupcake = require('../models/cupcake')
const Cookie = require('../models/cookie');
const Order = require('../models/order')
const { equal } = require('assert');
const { isObjectIdOrHexString } = require('mongoose');
const { findOne } = require('../models/cake');
const cake = require('../models/cake');
const { get } = require('http');
var nodemailer = require('nodemailer');

// Returns random products from a certain product type 
function randomizer (currentProducts) {
    var randomProducts = []
    var index = 0, num = 0
    while (index < 3) {
        if (currentProducts.length > 0) {
            num = Math.floor(Math.random() * currentProducts.length)
            randomProducts.push(currentProducts[num])
            currentProducts.splice(num, 1)
        }
        index++
    }
    return randomProducts
}

// Sends the email to the customer after they check out
function sendEmail (orderDetails, customerName, totalPrice, email) {

    // Information about the email service used and the sender's account details.
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'marcbaura@gmail.com',
            pass: 'shoveyljzkwlakdk'
        }
    });

    // Uses ejs to plot important information about the buyer and their orders on the html template and then sends it.
    ejs.renderFile("./views/messageTemplate.ejs", { customerName: customerName, orderDetails: orderDetails, totalPrice, totalPrice}, function (err, data) {
        if (err) {
            console.log(err);
        } else {

            // All of the details needed for the email.
            var mainOptions = {
                from: 'marcbaura@gmail.com',
                to: email,
                subject: 'G-Cakes Order Information',
                html: data,
                attachments: [{
                    filename: 'BPI.png',
                    path: 'public/images/BPI.png',
                    cid: 'BPI' 
                }, {
                    filename: 'GCASH.png',
                    path: 'public/images/GCASH.png',
                    cid: 'GCASH' 
                },]
            };
            
            // Sends the email 
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
}

// Fix the date format, returns it with a format of Month-Day-Year (Example: 12-20-2022)
function generateDate(date) { 
    var parseDate = ""

    if (date.getMonth() + 1 < 10) {
        parseDate = parseDate + '0'
    }
    parseDate = parseDate + (date.getMonth() + 1) + '-'

    if (date.getDate() < 10) {
        parseDate = parseDate + '0'
    }
    parseDate = parseDate + date.getDate() + '-'

    parseDate = parseDate + date.getFullYear()
    
    return parseDate
}

// Finds all the unpaid orders that are already past 7 days, returns the array orderList
async function afterSevenDays () { 
    var orderList = []
    var currentDate = new Date()
    var unCancelledOrders = await Order.find({'status': 'unpaid'})

    if (unCancelledOrders) {
        unCancelledOrders.forEach(async function(order) {
            var monthDayYear = order.payByDate.split('-')
            var deadlineDate = new Date()
            deadlineDate.setMonth(monthDayYear[0] - 1)
            deadlineDate.setDate(monthDayYear[1])
            deadlineDate.setYear(monthDayYear[2])
            if (currentDate > deadlineDate) {
                orderList.push(order.orderID)
            }
        })
    }
    
    return orderList
}

const controller = {

    // Getting all the orders from the database and renders the orders page
    getOrdersPage: async function(req, res) {
        var pagenumber = req.query.pagenumber
        var category = req.params.category
        var previewOrders
        var orderCount
        
        // Calls the afterSevenDays function that returns the list of unpaid values
        var orderList = await afterSevenDays() 

        // Updates the status of the unpaid orders that are already past 7 days to cancelled
        while(orderList.length > 0){ 
            await Order.updateOne({orderID: orderList.pop()}, {status: 'cancelled'})
        }

        // Default page value when no url query was initialized.
        if (typeof pagenumber === 'undefined') {
            pagenumber = 1
        } 

        // Finds the orders depending on the status placed on the url query 
        if (category == 'all') {
            previewOrders = await Order.find({}).limit(6).skip(6 * (pagenumber - 1))
            orderCount = await Order.find({}).count()
        } else {
            previewOrders = await Order.find({"status": category}).limit(6).skip(6 * (pagenumber - 1))
            orderCount = await Order.find({"status": category}).count()
        }

        // Counts the number of pages needed for the page
        var numberofPages = parseInt(orderCount / 6)
        if (orderCount % 6 != 0 || orderCount == 0) {
            numberofPages++
        }

        // Renders the orders page
        previewOrders["category"] = category
        if (pagenumber <= numberofPages && pagenumber != 0 && pagenumber > 0) {
            res.render('order', {orderList: previewOrders, numberofPages: numberofPages , currentPage: pagenumber})
        } else {
            res.render('errorPage')
        } 
    },

    // Get a maximum of 3 random products from each schema to be displayed on the preview page.
    getIndexPage: async function(req, res) {
        var products = []
        var types = []
        try {
            var cakeProducts = randomizer(await Cake.find({}));
                cakeProducts.forEach(function(product) {
                products.push(product)
                types.push('cake')
            })
        } catch (err) {
            console.log("Error on producing random cake products. Error: \n" + err)
        }
        try {
            var cupcakeProducts = randomizer(await Cupcake.find({}));
                cupcakeProducts.forEach(function(product) {
                products.push(product)
                types.push('cupcake')
            })
        } catch (err) {
            console.log("Error on producing random cupcake products. Error: \n" + err)
        }
        try {
            var cookieProducts = randomizer(await Cookie.find({}));
                cookieProducts.forEach(function(product) {
                products.push(product)
                types.push('cookie')
            })
        } catch (err) {
            console.log("Error on producing random cookie products. Error: \n" + err)
        }

        res.render('main', {display: products, types: types})
    },

    // Display the customer view of aboutPage.ejs
    getAboutPage: function(req, res) {
        res.render('aboutPage', {adminView: false})
    },

    // Display the login.ejs
    getAdminPage: function(req, res) {
        res.render('login')
    },

    // Display the errorPage.ejs
    getErrorPage: function(req, res) {
        res.render('errorPage')
    },

    // Display the orderInformation.ejs if orders is empty redirect to basket
    getOrderInformationPage: function(req, res) {
        if (req.session.orders == '' || !(req.session.orders)) {
            res.redirect('basket')
        } else {
            delete req.session.information // deletes the past inputted informations
            res.render('orderInformation')
        }
    },

    // Display the corresponding product type in the product page
    getProductPage: async function(req, res) {
        var productType = req.params.type
        if (productType == 'cake') {
            try {
                var productPreview = await Cake.find({
                    $or: [
                        {vanilla6x5Price : {$gte: 1}},
                        {vanilla8x5Price : {$gte: 1}},
                        {chocolate6x5Price : {$gte: 1}},
                        {chocolate8x5Price : {$gte: 1}},
                        {numberCakePrice : {$gte: 1}},
                    ]
                })
            } catch (err) {
                console.log("Error on producing cake previews. Error: \n" + err)
            }
        } else if (productType == 'cupcake') {
            try {
                var productPreview = await Cupcake.find({
                    $or: [
                        {vanillaFondantPrice : {$gte: 1}},
                        {vanillaIcingPrice : {$gte: 1}},
                        {chocolateFondantPrice : {$gte: 1}},
                        {chocolateIcingPrice : {$gte: 1}},
                        {redvelvetFondantPrice : {$gte: 1}},
                        {redvelvetIcingPrice : {$gte: 1}},
                    ]
                })
            } catch (err) {
                console.log("Error on producing cupcake previews. Error: \n" + err)
            }
        } else if (productType == 'cookie') {
            try {
                var productPreview = await Cookie.find({
                    price: {$gte: 1}
                })
            } catch (err) {
                console.log("Error on producing cookie previews. Error: \n" + err)
            }
        } else {
            res.render('errorPage')
        }
        res.render('products', {preview: productPreview, type: productType})
    },

    // Retrieve the product from the database then sends it
    getProductInfo: async function(req, res) {
        var name = req.query.name
        var type = req.query.type

        if (type == 'cake') {
            try {
                var productInfo = await Cake.findOne({name: name})
            } catch (err) {
                console.log("Error on getting the clicked cake's information. Error: \n" + err)
            }
        } else if (type == 'cupcake') {
            try {
                var productInfo = await Cupcake.findOne({name: name})
            } catch (err) {
                console.log("Error on getting the clicked cupcake's information. Error: \n" + err)
            }
        } else {
            try {
            var productInfo = await Cookie.findOne({name: name})
            } catch (err) {
                console.log("Error on getting the clicked cookie's information. Error: \n" + err)
            }
        }
        
        res.send(productInfo)
    },

    // Renders the admin view of the about page
    getAdminAboutPage: function(req, res) {
        res.render('aboutPage', {adminView: true})
    },

    // Search if there are products that contains the inputted string, if yes then display these products
    searchProduct: async function(req, res) {
        var search = req.body.searchBarInput
        var type = req.body.searchProductType

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            if(type == 'cake') {
                try {
                    var productPreview = await Cake.find({$text: {$search: search}})
                } catch (err) {
                    console.log('Error on finding cake products. Error: \n' + err)
                }
            } else if (type == 'cupcake') {
                try {
                    var productPreview = await Cupcake.find({$text: {$search: search}})
                } catch (err) {
                    console.log('Error on finding cupcake products. Error: \n' + err)
                }
            } else if (type == 'cookie') {
                try {
                    var productPreview = await Cookie.find({$text: {$search: search}})
                } catch (err) {
                    console.log('Error on finding cookie products. Error: \n' + err)
                }
            } else {
                res.render('errorPage')
            }

            if (productPreview.length > 0) {
                res.render('products', {preview: productPreview, type: type})
            } else {
                req.flash('search_error', 'Product not found!');
                res.redirect('/products/' + type);
            }
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('search_error', messages[0]);
            res.redirect('/products/' + type);
        }
    },

    // Display the corresponding product type in the admin product page
    adminProductPage: async function (req, res) {
        var productType = req.params.type
        var pagenumber = req.query.pagenumber

        // default page value when no url query was initialized.
        if (typeof pagenumber === 'undefined') {
            pagenumber = 1
        } 

        if (productType == 'cake') {
            try {
                var allCakes = await Cake.find({})
                // Calculates how many number of pages will all the cake products use.
                var numberofPages = parseInt(allCakes.length / 6)
                if (allCakes.length % 6 != 0 || allCakes.length == 0) {
                    numberofPages++
                }
                // Only need 6 products per page.
                var previewCakes = allCakes.slice((pagenumber - 1) * 6, (pagenumber - 1) * 6 + 6) 
                // if a page does not exists then render an error page, otherwise render up to 6 products.
                if (pagenumber <= numberofPages && pagenumber != 0) {
                    res.render('cakesPage', {cakes: previewCakes, numberofPages: numberofPages , currentPage: pagenumber})
                } else {
                    res.render('errorPage')
                }      
            } catch (err) {
                console.log("Error on producing cake previews for admin page. Error: \n" + err)
            }
        } else if (productType == 'cupcake') {
            // console.log('Hello')
            try {
                var allCupcakes = await Cupcake.find({})
                // Calculates how many number of pages will all the cupcake products use.
                var numberofPages = parseInt(allCupcakes.length / 6)
                if (allCupcakes.length % 6 != 0  || allCupcakes.length == 0) {
                    numberofPages++
                }
                // Only need 6 products per page.
                var previewCupcakes = allCupcakes.slice((pagenumber - 1) * 6, (pagenumber - 1) * 6 + 6) 
                // if a page does not exists then render an error page, otherwise render up to 6 products.
                if (pagenumber <= numberofPages && pagenumber != 0) {
                    res.render('cupcakesPage', {cupcakes: previewCupcakes, numberofPages: numberofPages , currentPage: pagenumber})
                } else {
                    res.render('errorPage')
                }    
            } catch (err) {
                console.log("Error on producing cupcake previews for admin page. Error: \n" + err)
            }
        } else if (productType == 'cookie') {
            try {
                var allCookies = await Cookie.find({})
                // Calculates how many number of pages will all the cookie products use.
                var numberofPages = parseInt(allCookies.length / 6)
                if (allCookies.length % 6 != 0 || allCookies.length == 0) {
                    numberofPages++
                }
                // Only need 6 products per page.
                var previewCookies = allCookies.slice((pagenumber - 1) * 6, (pagenumber - 1) * 6 + 6) 
                // if a page does not exists then render an error page, otherwise render up to 6 products.
                if (pagenumber <= numberofPages && pagenumber != 0) {
                    res.render('cookiesPage', {cookies: previewCookies, numberofPages: numberofPages , currentPage: pagenumber})
                } else {
                    res.render('errorPage')
                }  
            } catch (err) {
                console.log("Error on producing cookie previews for admin page. Error: \n" + err)
            }
        } else {
            res.render('errorPage')
        }
    },

    // Adds a new cake product into the database
    addCake: async function(req, res) {

        const errors = validationResult(req)
        const nameExists = await Cake.findOne({name: (req.body.productName).trim()})
        
        if (errors.isEmpty() && !nameExists) {
            var productInfo = req.body
            var name = (productInfo.productName).trim()
            var vanilla6x5Price = productInfo.productPricesVanilla1
            var vanilla8x5Price = productInfo.productPricesVanilla2
            var chocolate6x5Price = productInfo.productPricesChocolate1
            var chocolate8x5Price = productInfo.productPricesChocolate2
            var dedication = productInfo.productDedication
            var numberCake = productInfo.productNumberCake
            var numberCakePrice = productInfo.productPricesNumberCake
            
            // when the number cake checkbox isn't checked, immediately make it false
            if (typeof numberCake === 'undefined') {
                numberCake = false
            }
            // when dedication checkbox isn't checked, immediately make it false
            if (typeof dedication === 'undefined') {
                dedication = false
            }

            const image = req.files.filename
            let date = new Date();
            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
            var imagePath = '/images/' + filenameChange;
            image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                if (error) {
                    console.log("Error on adding the uploaded picture into the database. \n" + err)
                    res.send('Failed')
                } else {
                    try {
                        await Cake.create({
                            name: name, 
                            vanilla6x5Price: vanilla6x5Price,
                            vanilla8x5Price: vanilla8x5Price,
                            chocolate6x5Price: chocolate6x5Price,
                            chocolate8x5Price: chocolate8x5Price,
                            image: imagePath,
                            dedication: dedication,
                            numberCake: numberCake,
                            numberCakePrice: numberCakePrice
                        })
                        res.send('Success')
                    } catch (err) {
                        console.log("Error on adding the new Cake product into the database. \n" + err)
                        res.send('Failed')
                    }
                }
            })
        } else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            if (nameExists) {
                messages.push('Product name already exists.')
                errorFields.push('productName')
            }
            res.send({errorFields, messages})
        }
    },
        
    // Finding the cakes in the database then updating the values of it
    editCake: async function(req, res) {

        const errors = validationResult(req)

        var validNewImage = true

        // Check if the image is a valid file type
        // Placed here since express validator does not allow empty inputs and our admin has the choice to not input a new image
        if (req.files) {
            var testing = req.files.filename.mimetype
            var validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!validImageTypes.includes(testing)) {
                validNewImage = false
            }
        } 
        
        // Checks if the new name inputted for the cake is already in use.
        var productID = req.body.productID
        var nameExists = await Cake.findOne({name: (req.body.productName).trim()})
        var pastInfo = await Cake.findOne({_id: productID})
        var newNameisValid = true
        if (nameExists && pastInfo.name != (req.body.productName).trim()) {
            newNameisValid = false
        }

        // Edits the cake when the new name and image type is valid, else throw an error
        if (errors.isEmpty() && newNameisValid && validNewImage) {
            var productName = (req.body.productName).trim()
            var productVanilla6x5price = req.body.productPricesVanilla1
            var productVanilla8x5price = req.body.productPricesVanilla2
            var productChocolate6x5price = req.body.productPricesChocolate1
            var productChocolate8x5price = req.body.productPricesChocolate2
            var productNumberCake = req.body.productNumberCake
            var productNumberCakePrice = req.body.productPricesNumberCake
            var productDedication = req.body.productDedication

            // when checkbox isn't checked
            if (typeof productNumberCake === 'undefined') {
                productNumberCake = false 
                productNumberCakePrice = 0
                if(typeof productDedication === 'undefined') {
                    productDedication = false
                }
            } else {
                productVanilla6x5price = 0
                productVanilla8x5price = 0
                productChocolate6x5price = 0
                productChocolate8x5price = 0
                productDedication = false 
            }
            
            if (req.files && validNewImage && newNameisValid) {
                const image = req.files.filename
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastImage = './public' + pastInfo.image
                    try {
                        await Cake.updateOne({
                            _id: productID
                        }, {
                            name: productName, 
                            vanilla6x5Price: productVanilla6x5price,
                            vanilla8x5Price: productVanilla8x5price,
                            chocolate6x5Price: productChocolate6x5price,
                            chocolate8x5Price: productChocolate8x5price,
                            image: imagePath,
                            dedication: productDedication,
                            numberCake: productNumberCake,
                            numberCakePrice: productNumberCakePrice
                        })
                        fs.unlinkSync(pastImage)
                        res.send('Success')
                    } catch (error) {
                        console.log("Error on updating the Cake product with image into the database. \n" + err)
                    }
                })
            } else if (!req.files && newNameisValid){
                try {
                    await Cake.updateOne({
                        _id: productID
                    }, {
                        name: productName, 
                        vanilla6x5Price: productVanilla6x5price,
                        vanilla8x5Price: productVanilla8x5price,
                        chocolate6x5Price: productChocolate6x5price,
                        chocolate8x5Price: productChocolate8x5price,
                        dedication: productDedication,
                        numberCake: productNumberCake,
                        numberCakePrice: productNumberCakePrice
                    })
                    res.send('Success')
                } catch (err) {
                    console.log("Error on updating the Cake product into the database. \n" + err)
                }
            } 
        } else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            if (!validNewImage) {
                messages.push('Invalid file type.')
                errorFields.push('filename')
            }
            if (!newNameisValid) {
                messages.push('Product name already exists.')
                errorFields.push('productName')
            }
            res.send({errorFields, messages})
        }
    },

    // Creates a new cupcakes then adding it to the database
    addCupcake: async function(req, res) {

        const errors = validationResult(req)
        
        // Checks if the inputted new cupcake name is currently in use in the database
        const nameExists = await Cupcake.findOne({name: (req.body.productName).trim()})

        // Adds the cupcake when all inputted values are valid.
        if (errors.isEmpty() && !nameExists) {
            var productName = (req.body.productName).trim()
            var productVanilla1 = req.body.productPricesVanilla1
            var productVanilla2 = req.body.productPricesVanilla2
            var productChocolate1 = req.body.productPricesChocolate1
            var productChocolate2 = req.body.productPricesChocolate2
            var productRedVelvet1 = req.body.productPricesRedVelvet1
            var productRedVelvet2 = req.body.productPricesRedVelvet2

            const image = req.files.filename
            let date = new Date();
            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
            var imagePath = '/images/' + filenameChange;
            image.mv(path.resolve(__dirname, '../public/images', filenameChange),async (error) => {
                if (error) {
                    console.log("Error on adding the uploaded picture into the database. \n" + err)
                    res.send('Failed')
                } else {
                    try {
                        await Cupcake.create({
                            name: productName, 
                            vanillaFondantPrice: productVanilla1,
                            vanillaIcingPrice: productVanilla2,
                            chocolateFondantPrice: productChocolate1,
                            chocolateIcingPrice: productChocolate2,
                            redvelvetFondantPrice: productRedVelvet1,
                            redvelvetIcingPrice: productRedVelvet2,
                            image: imagePath,
                        })
                        res.send('Success')
                    } catch (err) {
                        console.log("Error on adding the new Cupcake product into the database. \n" + err)
                        res.send('Failed')
                    }
                }
            })
        } else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            if (nameExists) {
                messages.push('Product name already exists.')
                errorFields.push('productName')
            }
            res.send({errorFields, messages})
        }
        
    },

    // Finding the cupcakes in the database then updating the values of it
    editCupcake: async function(req, res) {

        const errors = validationResult(req)

        var validNewImage = true

        // Check if the image is a valid file type
        // Placed here since express validator does not allow empty inputs and our admin has the choice to not input a new image
        if (req.files) {
            var testing = req.files.filename.mimetype
            var validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!validImageTypes.includes(testing)) {
                validNewImage = false
            }
        } 

        // Checks if the new name inputted for the cupcake is already in use.
        var productID = req.body.productID
        var nameExists = await Cupcake.findOne({name: (req.body.productName).trim()})
        var pastInfo = await Cupcake.findOne({_id: productID})
        var newNameisValid = true
        if (nameExists && pastInfo.name != (req.body.productName).trim()) {
            newNameisValid = false
        }

        // Edits the cupcake the new name and image type is valid, else throw an error
        if (errors.isEmpty() && newNameisValid && validNewImage) {
            var productName = (req.body.productName).trim()
            var productVanilla1 = req.body.productPricesVanilla1
            var productVanilla2 = req.body.productPricesVanilla2
            var productChocolate1 = req.body.productPricesChocolate1
            var productChocolate2 = req.body.productPricesChocolate2
            var productRedVelvet1 = req.body.productPricesRedVelvet1
            var productRedVelvet2 = req.body.productPricesRedVelvet2
            
            if (req.files && validNewImage && newNameisValid) {
                const image = req.files.filename
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastImage = './public' + pastInfo.image
                    try {
                        await Cupcake.updateOne({
                            _id: productID
                        }, {
                            name: productName, 
                            vanillaFondantPrice: productVanilla1,
                            vanillaIcingPrice: productVanilla2,
                            chocolateFondantPrice: productChocolate1,
                            chocolateIcingPrice: productChocolate2,
                            redvelvetFondantPrice: productRedVelvet1,
                            redvelvetIcingPrice: productRedVelvet2,
                            image: imagePath,
                        })
                        fs.unlinkSync(pastImage)
                        res.send('Success')
                    } catch (error) {
                        console.log("Error on updating the Cupcake product with image into the database. \n" + err)
                    }
                })
            } else if (!req.files && newNameisValid){
                try {
                    await Cupcake.updateOne({
                        _id: productID
                    }, {
                        name: productName, 
                        vanillaFondantPrice: productVanilla1,
                        vanillaIcingPrice: productVanilla2,
                        chocolateFondantPrice: productChocolate1,
                        chocolateIcingPrice: productChocolate2,
                        redvelvetFondantPrice: productRedVelvet1,
                        redvelvetIcingPrice: productRedVelvet2,
                    })
                    res.send('Success')
                } catch (err) {
                    console.log("Error on updating the Cupcake product into the database. \n" + err)
                }
            } 
        } else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            if (!validNewImage) {
                messages.push('Invalid file type.')
                errorFields.push('filename')
            }
            if (!newNameisValid) {
                messages.push('Product name already exists.')
                errorFields.push('productName')
            }
            res.send({errorFields, messages})
        }
    },

    // Creates a new cookies then adding it to the database
    addCookie: async function(req, res) {
        const errors = validationResult(req)

        // Checks if the inputted new cookie name is currently in use in the database
        const nameExists = await Cookie.findOne({name: (req.body.productName).trim()})

        // Adds the cookie when all inputted values are valid.
        if (errors.isEmpty() && !nameExists) {
            var productName = (req.body.productName).trim()
            var productPrices = req.body.productPrices

            const image = req.files.filename
            let date = new Date();
            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
            var imagePath = '/images/' + filenameChange;
            image.mv(path.resolve(__dirname, '../public/images', filenameChange),async (error) => {
                if (error) {
                    console.log("Error on adding the uploaded picture into the database. \n" + err)
                    res.send('Failed')
                } else {
                    try {
                        await Cookie.create({
                            name: productName, 
                            price: productPrices,
                            image: imagePath,
                        })
                        res.send('Success')
                    } catch (err) {
                        console.log("Error on adding the new Cookie product into the database. \n" + err)
                        res.send('Failed')
                    }
                }
            })
        } else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            if (nameExists) {
                messages.push('Product name already exists.')
                errorFields.push('productName')
            }
            res.send({errorFields, messages})
        }
        
    },

    // Finding the cookies in the database then updating the values of it
    editCookie: async function(req, res) {
        const errors = validationResult(req)

        var validNewImage = true
        // Check if the image is a valid file type
        // Placed here since express validator does not allow empty inputs and our admin has the choice to not input a new image
        if (req.files) {
            var testing = req.files.filename.mimetype
            var validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!validImageTypes.includes(testing)) {
                validNewImage = false
            }
        } 

        // Checks if the new name inputted for the cookie is already in use.
        var productID = req.body.productID
        var nameExists = await Cookie.findOne({name: (req.body.productName).trim()})
        var pastInfo = await Cookie.findOne({_id: productID})
        var newNameisValid = true
        if (nameExists && pastInfo.name != (req.body.productName).trim()) {
            newNameisValid = false
        }

        // Edits the cookie when the new name and image type is valid, else throw an error
        if (errors.isEmpty() && newNameisValid && validNewImage) {
            var productName = (req.body.productName).trim()
            var productPrices = req.body.productPrices
            
            if (req.files && validNewImage && newNameisValid) {
                const image = req.files.filename
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastImage = './public' + pastInfo.image
                    try {
                        await Cookie.updateOne({
                            _id: productID
                        }, {
                            name: productName, 
                            price: productPrices,
                            image: imagePath,
                        })
                        fs.unlinkSync(pastImage)
                        res.send('Success')
                    } catch (error) {
                        console.log("Error on updating the Cookie product with image into the database. \n" + err)
                    }
                })
            } else if (!req.files && newNameisValid){
                try {
                    await Cookie.updateOne({
                        _id: productID
                    }, {
                        name: productName, 
                        price: productPrices,
                    })
                    res.send('Success')
                } catch (err) {
                    console.log("Error on updating the Cookie product into the database. \n" + err)
                }
            } 
        } else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            if (!validNewImage) {
                messages.push('Invalid file type.')
                errorFields.push('filename')
            }
            if (!newNameisValid) {
                messages.push('Product name already exists.')
                errorFields.push('productName')
            }
            res.send({errorFields, messages})
        }
    },

    // Finds the product in the database then deletes it from the database
    deleteProduct: async function(req, res) {
        var name = (req.query.name).trim()
        var image = ('./public' + req.query.image)
        var type = req.query.type
        var successMessage = "Product deleted successfully"
        var findErrorMessage = "Error"
        if (type == 'cake') {
            try {
                await Cake.deleteOne({name: name})
                fs.unlinkSync(image)
                res.send(successMessage)
            } catch (error) {
                res.send(findErrorMessage); 
            }
        } else if (type == 'cupcake') {
            try {
                await Cupcake.deleteOne({name: name})
                fs.unlinkSync(image)
                res.send(successMessage)
            } catch (error) {
                res.send(findErrorMessage); 
            }
        } else {
            try {
                await Cookie.deleteOne({name: name})
                fs.unlinkSync(image)
                res.send(successMessage)
            } catch (error) {
                res.send(findErrorMessage); 
            }
        }
    },

    // Adding the basket items to the order array in the sessions
    postBasketItem: async function(req, res) {
        var itemLength = 0;
        var lastItemNumber = "1";
        var isAvailable = false;

        if(!req.session.orders || req.session.orders == '') {
            req.session.orders = [];
        } else {
            req.session.orders.forEach(val => {
                itemLength++;
                //console.log("first: " + itemLength)
            })
            //console.log("second :" + itemLength)
            lastItemNumber = req.session.orders[itemLength - 1].itemNumber
            lastItemNumber = (parseInt(lastItemNumber) + 1).toString()
        }

        var productInfo = {"itemNumber": lastItemNumber,
                        "name": req.body.name,
                        "image": req.body.image,
                        "price": req.body.price,
                        "flavor": req.body.flavor,
                        "size": req.body.size,
                        "frosting": req.body.frosting,
                        "cakeNumber": req.body.cakeNumber,
                        "designNumber": req.body.designNumber,
                        "quantity": req.body.quantity,
                        "dedication": req.body.dedication,
                        "design": req.body.design,
                        "type": req.body.type};

            // Checks if the new item being added to the basket is already available 
            for (const item of req.session.orders) {   
                if (item.name == productInfo.name &&
                    item.image == productInfo.image &&
                    item.price == productInfo.price &&
                    item.flavor == productInfo.flavor &&
                    item.size == productInfo.size &&
                    item.frosting == productInfo.frosting &&
                    item.cakeNumber == productInfo.cakeNumber &&
                    item.designNumber == productInfo.designNumber &&
                    item.dedication == productInfo.dedication &&
                    item.design == productInfo.design &&
                    item.type == productInfo.type) {
                    item.quantity = parseInt(item.quantity) + parseInt(productInfo.quantity)
                    if (item.quantity > 100) { // If the total quantity is above 100, bring it back to 100
                        item.quantity = 100
                    }
                    isAvailable = true // True since the item is already in the basket
                }
            }

            if (isAvailable == false) {
                req.session.orders.push(productInfo);
            }
    
        //console.log(req.session.orders);
        res.send("Success")
    },

    // Display the basket item for the basket.ejs (also checks for backend updates)
    getBasketItem: async function(req, res) {
        var basketItemList = []
        var totalPrice = 0
        var count = 0
        var countArray = []

        delete req.session.information // deletes current buyer information when they go back to the basket page

        if(req.session.orders) {
            for (const item of req.session.orders) {
                //console.log(item)
                if(item.type == 'cake') {
                    if(item.flavor == 'vanilla'){
                        if(item.size == '6x5'){
                            var basketItem = await Cake.findOne({name: item.name, vanilla6x5Price: item.price}, {_id: 0})
                        }
                        else if(item.size == '8x5'){
                            var basketItem = await Cake.findOne({name: item.name, vanilla8x5Price: item.price}, {_id: 0})
                        }
                        else{
                            console.log(item)
                            console.log("getBasketItem Cake Vanilla Size")
                        }
                    }
                    else if(item.flavor == 'chocolate'){
                        if(item.size == '6x5'){
                            var basketItem = await Cake.findOne({name: item.name, chocolate6x5Price: item.price}, {_id: 0})
                        }
                        else if(item.size == '8x5'){
                            var basketItem = await Cake.findOne({name: item.name, chocolate8x5Price: item.price}, {_id: 0})
                        }
                        else{
                            console.log(item)
                            console.log("getBasketItem Cake Chocolate Size")
                        }
                    }
                    else if(item.flavor == ''){
                        if(item.cakeNumber >= 0 && item.cakeNumber <= 9){
                            var basketItem = await Cake.findOne({name: item.name, numberCakePrice: item.price}, {_id: 0})
                        }
                        else{
                            console.log(item)
                            console.log("getBasketItem Cake NumberCake")
                        }
                    }
                    else{
                        console.log(item)
                        console.log("getBasketItem Cake Flavor")
                    }
                } else if (item.type == 'cupcake') {
                    if(item.flavor == 'vanilla'){
                        if(item.frosting == 'fondant'){
                            var basketItem = await Cupcake.findOne({name: item.name, vanillaFondantPrice: item.price}, {_id: 0})
                        }
                        else if(item.frosting == 'icing'){
                            var basketItem = await Cupcake.findOne({name: item.name, vanillaIcingPrice: item.price}, {_id: 0})
                        }
                        else{
                            console.log(item)
                            console.log("getBasketItem Cupcake Vanilla Frosting")
                        }
                    }
                    else if(item.flavor == 'chocolate'){
                        if(item.frosting == 'fondant'){
                            var basketItem = await Cupcake.findOne({name: item.name, chocolateFondantPrice: item.price}, {_id: 0})
                        }
                        else if(item.frosting == 'icing'){
                            var basketItem = await Cupcake.findOne({name: item.name, chocolateIcingPrice: item.price}, {_id: 0})
                        }
                        else{
                            console.log(item)
                            console.log("getBasketItem Cupcake Chocolate Frosting")
                        }
                    }
                    else if(item.flavor == 'redVelvet'){
                        if(item.frosting == 'fondant'){
                            var basketItem = await Cupcake.findOne({name: item.name, redVelvetFondantPrice: item.price}, {_id: 0})
                        }
                        else if(item.frosting == 'icing'){
                            var basketItem = await Cupcake.findOne({name: item.name, redVelvetIcingPrice: item.price}, {_id: 0})
                        }
                        else{
                            console.log(item)
                            console.log("getBasketItem Cupcake Red Velvet Frosting")
                        }
                    }
                    else{
                        console.log(item)
                        console.log("getBasketItem Cupcake Flavor")
                    }
                } else if (item.type == 'cookie') {
                    var basketItem = await Cookie.findOne({name: item.name, price: item.price}, {_id: 0})
                }  else {
                    console.log(item)
                    console.log("getBasketItem Type")
                }

                if (basketItem != '' && basketItem != null) {
                    totalPrice = totalPrice + (parseInt(item.price) * parseInt(item.quantity))
                    basketItemList.push(basketItem)   
                } else {
                    countArray.push(count)
                }
                count++
            }

            while(countArray.length > 0){
                req.session.orders.splice(countArray.pop(), 1)
            }
        }

        res.render('basket', {basketItemList: basketItemList, productItemList: req.session.orders, totalPrice: totalPrice})
    },

    // Update the total price of all the products whenever the basket is updated
    updateBasketItem: function(req, res) {
        if (req.session.orders) {
            var totalPrice = 0
            req.session.orders.forEach(function(order) {
                if(req.body.itemNumber == order.itemNumber) {
                    order.flavor = req.body.flavor
                    order.size = req.body.size
                    order.frosting = req.body.frosting
                    order.cakeNumber = req.body.cakeNumber
                    order.designNumber = req.body.designNumber
                    order.quantity = req.body.quantity
                    order.dedication = req.body.dedication
                    order.design = req.body.design
                    order.price = req.body.price
                }

                totalPrice = totalPrice + (parseInt(order.price) * parseInt(order.quantity))
            })
            res.send(totalPrice.toString())
        }
    },

    // Find the order that was clicked to be removed and then removes it
    removeBasketItem: function(req, res) {
        //console.log("Start: ", req.session.orders)
        if(req.session.orders) {
            req.session.orders.forEach((val, key) => {
                    //console.log("key: " + key)
                    //console.log("bodyNumber: " + req.body.itemNumber)
                    //console.log("valNumber: " + val.itemNumber)
                if(req.body.itemNumber == val.itemNumber) {
                    // console.log("key: " + key)
                    //console.log("bodyNumber: " + req.body.itemNumber)
                    //console.log("valNumber: " + val.itemNumber)
                    req.body.totalPrice = req.body.totalPrice - (parseInt(val.price) * parseInt(val.quantity))
                    req.session.orders.splice(key, 1)
                }
            })
        }
        //console.log("End: ", req.session.orders)
        res.send(req.body.totalPrice.toString())
    },

    // Error checking for the orderInformation.ejs
    getInformationChecker: async function(req, res) {
        const errors = validationResult(req)
        
        if(errors.isEmpty()){
            req.session.information = req.query
            res.send("Success")
        }
        else {
            var messages = errors.array().map((item) => item.msg);
            var errorFields = errors.array().map((item) => item.param);
            res.send({errorFields, messages})
        }
    },

    // Display the summary of the orders in the orderSummary page
    getOrderSummary: async function(req, res) {
        var date = new Date()
        var orderID = ""
        var totalPrice = 0
        // console.log(req.session.information)
        if (req.session.orders == '' || !(req.session.orders) || req.session.information == '' || !(req.session.information)) {
            res.redirect('basket')
        } else {
            if(req.session.orders) {
                for (const item of req.session.orders) {                   
                    totalPrice = totalPrice + (parseInt(item.price) * parseInt(item.quantity))
                }
            }

            if (date.getHours() < 10) {
                orderID = orderID + '0'
            } 
            orderID = orderID + date.getHours()
    
            if (date.getMinutes() < 10) {
                orderID = orderID + '0'
            }
            orderID = orderID + date.getMinutes()
            
            if (date.getSeconds() < 10) {
                orderID = orderID + '0'
            }
            orderID = orderID + date.getSeconds()
            if (date.getMilliseconds() < 100 && date.getMilliseconds() >= 10) {
                orderID = orderID + '0'
            } else if (date.getMilliseconds() < 10) {
                orderID = orderID + '00'
            }
            orderID = orderID + date.getMilliseconds()
            orderID = orderID + req.session.information.name[0].toUpperCase() + req.session.information.celebrant[0].toUpperCase() + req.session.information.celebrantGender[0]
            
            if (parseInt(req.session.information.celebrantAge) < 100 && parseInt(req.session.information.celebrantAge) >= 10) {
                orderID = orderID + '0'
            } else if (parseInt(req.session.information.celebrantAge) < 10) {
                orderID = orderID + '00'
            }

            orderID = orderID + req.session.information.celebrantAge

            req.session.information.orderID = orderID
            console.log(req.session.information)

            res.render('orderSummary', {productItemList: req.session.orders, buyerInformation: req.session.information, totalPrice: totalPrice})
        }
    },

    // Creates a new order then adds it to the database
    postOrderComplete: function(req, res) {
        var date = new Date()
        var name = req.session.information.name
        var celebrantName = req.session.information.celebrant
        var gender = req.session.information.celebrantGender
        var age = req.session.information.celebrantAge
        var pickupDate = req.session.information.pickupDate
        var email = req.session.information.email
        var contact = req.session.information.contactNo
        var orderDate = ""
        var payByTemp = date
        var payByDate = ""
        var price = 0

        // Solves the total price of all the products ordered by the customer
        if(req.session.orders) {
            for (const item of req.session.orders) {                   
                price = price + (parseInt(item.price) * parseInt(item.quantity))
            }
        }
        
        // converts the date's format by calling the generateDate function
        var orderID = req.session.information.orderID
        orderDate = generateDate(date)
        payByTemp.setDate(date.getDate() + 7)
        payByDate = generateDate(payByTemp)

        console.log(req.session.orders)

        try {
            Order.create({
                name: name,
                orderID: orderID,
                celebrant: celebrantName,
                celebrantGender: gender,
                celebrantAge: age,
                expectedPickUpDate: pickupDate,
                email: email,
                contactNumber: contact,
                orders: req.session.orders,
                totalPrice: price,
                status: "unpaid",
                orderDate: orderDate,
                payByDate: payByDate,
                payDate: "",
                pickUpDate: "",
                cancelDate: ""
            })
            
            console.log(payByDate)

            // Sends the an email to the customer by calling the sendEmail function
            sendEmail(req.session.orders, name, price, email)
            res.send('Success')
        } catch (err) {
            console.log(err)
            res.send('Error')
        }
    },

    // Clearing the session of the customer after they checked out
    deleteCustomerSession: function(req, res) {
        req.session.destroy(() => { // deletes the customer's session to allow for new orders
            res.clearCookie('connect.sid');
            res.redirect('/')
        });
    },
    
    // Sends the Order requested from the database
    getOrdersView: async function(req, res) {
        var orderID = req.query.orderID
        var orders = await Order.findOne({orderID: orderID});

        res.send(orders)
    },

    // Find the order in the database then updates its status
    updateOrderStatus: async function(req, res) {

        var orderID = req.query.orderID
        var newStatus = req.query.status
        var currentDate = generateDate(new Date())
        try {
            if (newStatus == 'paid') {
                await Order.updateOne({orderID: orderID}, {status: newStatus, payDate: currentDate})
            } else if (newStatus == 'pickedup') {
                await Order.updateOne({orderID: orderID}, {status: newStatus, pickUpDate: currentDate})
            } 
            res.send('Success')
        } catch (err) {
            res.send('Update Status Failed!!!')
        }
    },
    
    // Find the order in the database then undoes its status
    undoOrderStatus: async function(req, res) {
        var orderID = req.query.orderID

        try {
            var currentStatus = await Order.findOne({orderID: orderID})
            if (currentStatus.status == 'paid') {
                await Order.updateOne({orderID: orderID}, {status: "unpaid", payDate: ""})
            } else if (currentStatus.status == 'pickedup') {
                await Order.updateOne({orderID: orderID}, {status: "paid", pickUpDate: ""})
            } else if (currentStatus.status == 'cancelled') {
                await Order.updateOne({orderID: orderID}, {status: "unpaid", cancelDate: ""})
            }
            res.send('Success')
        } catch (err) {
            res.send('Update Status Failed!!!')
        }
    }
}   

module.exports = controller