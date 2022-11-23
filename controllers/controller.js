const path = require('path')
const ejs = require('ejs') // Added
const fs = require('fs')
const { validationResult } = require('express-validator');
const Cake = require('../models/cake')
const Cupcake = require('../models/cupcake')
const Cookie = require('../models/cookie')

const controller = {

    // Get a maximum of 3 random products from each schema to be displayed on the preview page.
    getIndexPage: async function(req, res) {
        var products = await Cake.find({})
        var cakeProducts = await Cake.find({});
        var cupcakeProducts = await Cupcake.find({});
        var cookieProducts = await Cookie.find({});
        var products = [];
        var index = 0, num = 0;
            while (index < 9) {
                if (index < 3 && cakeProducts.length > 0) {
                    num = Math.floor(Math.random() * cakeProducts.length);
                    products.push(cakeProducts[num]);
                    cakeProducts.splice(num, 1);
                } else if (index < 6 && cupcakeProducts.length > 0) {
                    num = Math.floor(Math.random() * cupcakeProducts.length);
                    products.push(cupcakeProducts[num]);
                    cupcakeProducts.splice(num, 1);
                } else if (index < 9 && cookieProducts.length > 0) {
                    num = Math.floor(Math.random() * cookieProducts.length);
                    products.push(cookieProducts[num]);
                    cookieProducts.splice(num, 1);
                }
                index++;
            }
        res.render('main', {display: products})
    },
   
    getAdminPage: function(req, res) {
        res.render('login')
    },

    getErrorPage: function(req, res) {
        res.render('errorPage')
    },

    getProductPage: async function(req, res) {
        var productType = req.params.type
        if (productType == 'Cake') {
            var productPreview = await Cake.find({}, ['name', 'image'])
        } else if (productType == 'Cupcake') {
            var productPreview = await Cupcake.find({})
        } else if (productType == 'Cookie'){
            var productPreview = await Cookie.find({})
        } else {
            res.render('errorPage')
        }
           
        res.render('products', {preview: productPreview, type: productType})
    },

    getProductInfo: async function(req, res) {
        var name = (req.query.name).trim()
        var type = req.query.type
        if (type == 'Cake') {
            var productInfo = await Cake.findOne({name: name})
        } else if (type == 'Cupcake') {
            var productInfo = await Cupcake.findOne({name: name})
        } else {
            var productInfo = await Cookie.findOne({name: name})
        }
        res.send(productInfo)
    },

    adminProductPage: async function (req, res) {
        var productType = req.params.type
        if (productType == 'Cake') {
            var cakes = await Cake.find({})
            res.render('cakesPage', {cakes: cakes})
        } else if (productType == 'Cupcake') {
            var cupcakes = await Cupcake.find({})
            res.render('cupcakesPage', {cupcakes: cupcakes})
        } else if (productType == 'Cookie') {
            var cookies = await Cookie.find({})
            res.render('cookiesPage', {cookies: cookies})
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

            if (req.files.filename != '') {
                const image = req.files.filename
                let date = new Date();
                var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
                var imagePath = '/images/' + filenameChange;
                image.mv(path.resolve(__dirname, '../public/images', filenameChange), async (error) => {
                    var pastInfo = await Cake.findOne({_id: productID})
                    var pastImage = './public' + pastInfo.image
                    fs.unlinkSync(pastImage)
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
                    res.redirect('admin/Cake')
                })
            } else {
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
            image.mv(path.resolve(__dirname, '../public/images', filenameChange),(error) => {
                Cupcake.create({
                    name: productName, 
                    vanillaFondantPrice: productVanilla1,
                    vanillaIcingPrice: productVanilla2,
                    chocolateFondantPrice: productChocolate1,
                    chocolateIcingPrice: productChocolate2,
                    redvelvetFondantPrice: productRedVelvet1,
                    redvelvetIcingPrice: productRedVelvet2,
                    image: imagePath,
                })
            })
            res.redirect('admin/Cupcake')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
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

            image.mv(path.resolve(__dirname, '../public/images', filenameChange),(error) => {
                Cookie.create({
                    name: productName, 
                    price: productPrices,
                    image: imagePath,
                })
            })

            res.redirect('admin/Cookie')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
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
            await Cake.deleteOne({name: name}).then(function() {
                fs.unlinkSync(image)
                res.send(successMessage)
            }).catch((error) => {
                res.send(findErrorMessage); 
            });
        } else if (type == 'Cupcake') {
            await Cupcake.deleteOne({name: name}).then(function() {
                fs.unlinkSync(image)
                res.send(successMessage)
            }).catch((error) => {
                res.send(findErrorMessage); 
            });
        } else {
            await Cookie.deleteOne({name: name}).then(function() {
                fs.unlinkSync(image)
                res.send(successMessage)
            }).catch((error) => {
                res.send(findErrorMessage); 
            });
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
                        "quantity": req.body.quantity};

        req.session.orders.push(productInfo);
        console.log(req.session.orders);
        res.send("Success")
    },

    /*
    getBasketItem: function(req, res) {
        if(req.session.orders) {
            res.render('basket', {productItemList: req.session.orders})
        } else {
            res.redirect('/');
        }
    },
    */
    // test
    getBasketItem: function(req, res) {
        if(req.session.orders) {
            res.json(req.session.orders)
        } else {
            res.redirect('/');
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