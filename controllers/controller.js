const path = require('path')
const ejs = require('ejs') // Added
const fs = require('fs')
const { validationResult } = require('express-validator');
const Cake = require('../models/cake')
const Cupcake = require('../models/cupcake')
const Cookie = require('../models/cookie');
const { equal } = require('assert');
const { isObjectIdOrHexString } = require('mongoose');

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

const controller = {

    // Get a maximum of 3 random products from each schema to be displayed on the preview page.
    getIndexPage: async function(req, res) {
        var products = []
        try {
            var cakeProducts = randomizer(await Cake.find({}));
                cakeProducts.forEach(function(product) {
                products.push(product)
            })
        } catch (err) {
            console.log("Error on producing random cake products. Error: \n" + err)
        }
        try {
            var cupcakeProducts = randomizer(await Cupcake.find({}));
                cupcakeProducts.forEach(function(product) {
                products.push(product)
            })
        } catch (err) {
            console.log("Error on producing random cupcake products. Error: \n" + err)
        }
        try {
            var cookieProducts = randomizer(await Cookie.find({}));
                cookieProducts.forEach(function(product) {
                products.push(product)
            })
        } catch (err) {
            console.log("Error on producing random cookie products. Error: \n" + err)
        }
        res.render('main', {display: products})
    },
   
    getAdminPage: function(req, res) {
        res.render('login')
    },

    getErrorPage: function(req, res) {
        res.render('errorPage')
    },

    getOrderInformationPage: function(req, res) {
        res.render('orderInformation')
    },

    getProductPage: async function(req, res) {
        var productType = req.params.type
        if (productType == 'Cake') {
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
        } else if (productType == 'Cupcake') {
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
        } else if (productType == 'Cookie') {
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

    getProductInfo: async function(req, res) {
        var name = (req.query.name).trim()
        var type = req.query.type
        if (type == 'Cake') {
            try {
                var productInfo = await Cake.findOne({name: name})
            } catch (err) {
                console.log("Error on getting the clicked cake's information. Error: \n" + err)
            }
        } else if (type == 'Cupcake') {
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

    adminProductPage: async function (req, res) {
        var productType = req.params.type
        var pageNumber = req.query.pageNumber

        // default page value when no url query was initialized.
        if (typeof pageNumber === 'undefined') {
            pageNumber = 1
        } 

        if (productType == 'Cake') {
            try {
                var allCakes = await Cake.find({})
                // Calculates how many number of pages will all the cake products use.
                var numberofPages = parseInt(allCakes.length / 6)
                if (allCakes.length % 6 != 0) {
                    numberofPages++
                }
                // Only need 6 products per page.
                var previewCakes = allCakes.slice((pageNumber - 1) * 6, (pageNumber - 1) * 6 + 6) 
                // if a page does not exists then render an error page, otherwise render up to 6 products.
                if (pageNumber <= numberofPages && pageNumber != 0) {
                    res.render('cakesPage', {cakes: previewCakes, numberofPages: numberofPages , currentPage: pageNumber})
                } else {
                    res.render('errorPage')
                }      
            } catch (err) {
                console.log("Error on producing cake previews for admin page. Error: \n" + err)
            }
        } else if (productType == 'Cupcake') {
            try {
                var allCupcakes = await Cupcake.find({})
                // Calculates how many number of pages will all the cupcake products use.
                var numberofPages = parseInt(allCupcakes.length / 6)
                if (allCupcakes.length % 6 != 0) {
                    numberofPages++
                }
                // Only need 6 products per page.
                var previewCupcakes = allCupcakes.slice((pageNumber - 1) * 6, (pageNumber - 1) * 6 + 6) 
                // if a page does not exists then render an error page, otherwise render up to 6 products.
                if (pageNumber <= numberofPages && pageNumber != 0) {
                    res.render('cupcakesPage', {cupcakes: previewCupcakes, numberofPages: numberofPages , currentPage: pageNumber})
                } else {
                    res.render('errorPage')
                }    
            } catch (err) {
                console.log("Error on producing cupcake previews for admin page. Error: \n" + error)
            }
        } else if (productType == 'Cookie') {
            try {
                var allCookies = await Cookie.find({})
                // Calculates how many number of pages will all the cookie products use.
                var numberofPages = parseInt(allCookies.length / 6)
                if (allCookies.length % 6 != 0) {
                    numberofPages++
                }
                // Only need 6 products per page.
                var previewCookies = allCookies.slice((pageNumber - 1) * 6, (pageNumber - 1) * 6 + 6) 
                // if a page does not exists then render an error page, otherwise render up to 6 products.
                if (pageNumber <= numberofPages && pageNumber != 0) {
                    res.render('cookiesPage', {cookies: previewCookies, numberofPages: numberofPages , currentPage: pageNumber})
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

    addCake: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
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
            }
            // when checkbox isn't checked
            if (typeof productDedication === 'undefined') {
                productDedication = false
            }
            const image = req.files.filename
            let date = new Date();
            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
            var imagePath = '/images/' + filenameChange;
            image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                if (error) {
                    console.log("Error on adding the uploaded picture into the database. \n" + err)
                } else {
                    try {
                        await Cake.create({
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
                    } catch (error) {
                        console.log("Error on adding the new Cake product into the database. \n" + err)
                    }
                }
                res.redirect('admin/Cake')
            })
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('admin/Cake');
        }
    },
        
    editCake: async function(req, res) {
        const errors = validationResult(req)
        var validNewImage = true
        if (req.files) {
            var testing = req.files.filenameEdit.mimetype
            var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
            if (!validImageTypes.includes(testing)) {
                validNewImage = false
            }
        } 

        if (errors.isEmpty()) {
            var productID = req.body.productID
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
            }
            // when checkbox isn't checked
            if (typeof productDedication === 'undefined') {
                productDedication = false
            }

            if (req.files && validNewImage == true) {

                const image = req.files.filenameEdit
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastInfo = await Cake.findOne({_id: productID})
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
                    } catch (error) {
                        console.log("Error on updating the Cake product with image into the database. \n" + err)
                    }
                    res.redirect('admin/Cake')
                })
            } else if (req.files && validNewImage == false) {

                req.flash('editCakeError_msg', 'Invalid Image Type!!!');
                res.redirect('admin/Cake');

            } else if (!req.files){
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
                } catch (err) {
                    console.log("Error on updating the Cake product into the database. \n" + err)
                }
                res.redirect('admin/Cake');
            } 
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('editCakeError_msg', messages[0]);
            res.redirect('admin/Cake');
        }
    },

    addCupcake: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
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
                } catch (error) {
                    console.log("Error on adding the new Cupcake product into the database. \n" + err)
                }
            })
            res.redirect('admin/Cupcake')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('admin/Cupcake');
        }
        
    },

    editCupcake: async function(req, res) {
        const errors = validationResult(req)
        var validNewImage = true
        if (req.files) {
            var testing = req.files.filenameEdit.mimetype
            var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
            if (!validImageTypes.includes(testing)) {
                validNewImage = false
            }
        } 

        if (errors.isEmpty()) {
            var productID = req.body.productID
            var productName = (req.body.productName).trim()
            var productVanilla1 = req.body.productPricesVanilla1
            var productVanilla2 = req.body.productPricesVanilla2
            var productChocolate1 = req.body.productPricesChocolate1
            var productChocolate2 = req.body.productPricesChocolate2
            var productRedVelvet1 = req.body.productPricesRedVelvet1
            var productRedVelvet2 = req.body.productPricesRedVelvet2
            
            if (req.files && validNewImage == true) {
                
                const image = req.files.filenameEdit
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastInfo = await Cupcake.findOne({_id: productID})
                    var pastImage = './public' + pastInfo.image
                    fs.unlinkSync(pastImage)
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
                    } catch (error) {
                        console.log("Error on updating the Cupcake product with image into the database. \n" + err)
                    }
                    res.redirect('admin/Cupcake')
                })
            } else if (req.files && validNewImage == false) {

                req.flash('editCupcakeError_msg', 'Invalid Image Type!!!');
                res.redirect('admin/Cupcake');

            } else if (!req.files){
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
                } catch (error) {
                    console.log("Error on updating the Cupcake product into the database. \n" + err)
                }
                res.redirect('admin/Cupcake')
            }
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('editCupcakeError_msg', messages[0]);
            res.redirect('admin/Cupcake');
        }
    },

    addCookie: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            var productName = (req.body.productName).trim()
            var productPrices = req.body.productPrices
            const image = req.files.filename
            let date = new Date();

            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;

            var imagePath = '/images/' + filenameChange;

            image.mv(path.resolve(__dirname, '../public/images', filenameChange),async (error) => {
                try {
                    await Cookie.create({
                        name: productName, 
                        price: productPrices,
                        image: imagePath,
                    })
                } catch (error) {
                    console.log("Error on adding the new Cookie product into the database. \n" + err)
                }
            })

            res.redirect('admin/Cookie')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('admin/Cookie');
        }
        
    },

    editCookie: async function(req, res) {
        const errors = validationResult(req)
        var validNewImage = true
        if (req.files) {
            var testing = req.files.filenameEdit.mimetype
            var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
            if (!validImageTypes.includes(testing)) {
                validNewImage = false
            }
        } 

        if (errors.isEmpty()) {
            var productID = req.body.productID
            var productName = (req.body.productName).trim()
            var productPrices = req.body.productPrices
            
            if (req.files && validNewImage == true) {

                const image = req.files.filenameEdit
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastInfo = await Cookie.findOne({_id: productID})
                    var pastImage = './public' + pastInfo.image
                    fs.unlinkSync(pastImage)
                    try {
                        await Cookie.updateOne({
                            _id: productID
                        }, {
                            name: productName, 
                            price: productPrices,
                            image: imagePath,
                        })
                    } catch (error) {
                        console.log("Error on updating the Cookie product with image into the database. \n" + err)
                    }
                    res.redirect('admin/Cookie')
                })
            } else if (req.files && validNewImage == false) {

                req.flash('editCookieError_msg', 'Invalid Image Type!!!');
                res.redirect('admin/Cookie');

            } else if (!req.files){
                try {   
                    await Cookie.updateOne({
                        _id: productID
                    }, {
                        name: productName, 
                        price: productPrices,
                    }) 
                } catch (error) {
                    console.log("Error on updating the Cookie product into the database. \n" + err)
                }
                res.redirect('admin/Cookie')
            }
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('editCookieError_msg', messages[0]);
            res.redirect('admin/Cookie');
        }
    },

    deleteProduct: async function(req, res) {
        var name = req.query.name
        var image = ('./public' + req.query.image)
        var type = req.query.type
        var successMessage = "Product deleted successfully"
        var findErrorMessage = "Error"
        if (type == 'Cake') {
            try {
                await Cake.deleteOne({name: name})
                fs.unlinkSync(image)
                res.send(successMessage)
            } catch (error) {
                res.send(findErrorMessage); 
            }
        } else if (type == 'Cupcake') {
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

    getOrdersPage: async function(req, res) { //Added Here(John)
        var category = req.params.category
        var pageNumber = req.query.pageNumber || 0
        var orders;
        var orderCount = 7;
        var offSet = 0;

        if(pageNumber > 0) {
          offSet = pageNumber - 1;
        }

        if (offSet == 0) { 
            orders = [{orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022001",
                        name: "Jeff", cellphoneNo: "0123456789", price: "1000", status: "UNPAID"}, 
                    {orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022002",
                    name: "Josh", cellphoneNo: "0123456789", price: "2000", status: "PAID"},
                    {orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022002",
                    name: "Josh", cellphoneNo: "0123456789", price: "2000", status: "PAID"},
                    {orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022002",
                    name: "Josh", cellphoneNo: "0123456789", price: "2000", status: "PAID"},
                    {orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022002",
                    name: "Josh", cellphoneNo: "0123456789", price: "2000", status: "PAID"}]
            } else {
                orders = [{orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022001",
                        name: "Jeff", cellphoneNo: "0123456789", price: "1000", status: "UNPAID"}, 
                    {orderDate: "11/12/2022", payDate: "", pickedUpDate: "", cancelledDate: "", orderId: "11122022002",
                    name: "Josh", cellphoneNo: "0123456789", price: "2000", status: "PAID"}]
            }
        
        /*
        if (category == 'All') {
            orders = Orders.find({}).limit(5).skip(5 * offSet)
            orderCount = Orders.find({}).count()
        } else {
            orders = Orders.find({"Status": category}).limit(5).skip(5 * offSet)
            orderCount = Orders.find({"Status": category}).count()
        }
        */

       orders["category"] = category;
        if(pageNumber > 0) {
            var options = "cache: false";
            var dir = path.join(__dirname, '../views/partials/');
            ejs.renderFile(dir + 'orderList.ejs', {orderList: orders}, options, function(err, str) { 
                res.send(str);
            });
        } else {
            res.render('order', {orderList: orders, count: orderCount})
        }
    },

    postBasketItem: async function(req, res) {
        var itemLength = 0;
        var lastItemNumber = "1";

        if(!req.session.orders) {
            req.session.orders = [];
        } else {
            req.session.orders.forEach(val => {
                itemLength++;
            })

            lastItemNumber = req.session.orders[itemLength - 1].itemNumber
            lastItemNumber = (parseInt(lastItemNumber) + 1).toString()
        }

        var productInfo = {"itemNumber": lastItemNumber,
                        "name": req.body.name,
                        "price": req.body.price,
                        "flavor": req.body.flavor,
                        "size": req.body.size,
                        "frosting": req.body.frosting,
                        "quantity": req.body.quantity,
                        "type": req.body.type};

        req.session.orders.push(productInfo);
        console.log(req.session.orders);
        res.send("Success")
    },

    /*
    getBasketItem: function(req, res) {
        if(req.session.orders) {
            res.render('basket', {basketItemList: req.session.orders})
        } else {
            res.redirect('/');
        }
    },
    */
    // test
    getBasketItem: async function(req, res) {
        if(req.session.orders) {
            var basketItemList = []
            /*
            req.session.orders.forEach(async function(item) {
                if(item.type == 'Cake') {
                    var basketItem = await Cake.findOne({name: item.name})
                                     .then(function(result) {
                                        console.log(result)
                                     })
                } else if (item.type == 'Cupcake') {
                    var basketItem = await Cupcake.findOne({name: item.name})
                } else {
                    var basketItem = await Cookie.findOne({name: item.name})
                }
                basketItemList.push(basketItem)
            });
            */


            for (const item of req.session.orders) {
                if(item.type == 'Cake') {
                    var basketItem = await Cake.findOne({name: item.name}, {_id: 0})
                } else if (item.type == 'Cupcake') {
                    var basketItem = await Cupcake.findOne({name: item.name}, {_id: 0})
                } else {
                    var basketItem = await Cookie.findOne({name: item.name}, {_id: 0})
                }                
                
                basketItemList.push(basketItem)    
            }
                        
            console.log(basketItemList)
            res.render('basket', {basketItemList: basketItemList, productItemList: req.session.orders})
        } else {
            res.redirect('/products/Cake');
        }
    },

    updateBasketItem: function(req, res) {

    },

    removeBasketItem: function(req, res) {
        console.log("Start: ", req.session.orders)
        if(req.session.orders) {
            req.session.orders.forEach((val, key) => {
                console.log("key: " + key)
                    console.log("bodyNumber: " + req.body.itemNumber)
                    console.log("valNumber: " + val.itemNumber)
                if(req.body.itemNumber == val.itemNumber) {
                    console.log("key: " + key)
                    console.log("bodyNumber: " + req.body.itemNumber)
                    console.log("valNumber: " + val.itemNumber)
                    req.session.orders.splice(key, 1)
                }
            })
        }
        console.log("End: ", req.session.orders)
        res.send("Removed Item Success")
    }

}   

module.exports = controller