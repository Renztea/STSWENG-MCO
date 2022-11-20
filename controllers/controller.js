const path = require('path')
const ejs = require('ejs') // Added
const { validationResult } = require('express-validator');
const Cake = require('../models/cake')
const Cupcake = require('../models/cupcake')
const Cookie = require('../models/cookie')

const controller = {

    getIndexPage: async function(req, res) {
        var products = await Cake.find({})
        /*
        var cakeProducts = await Cake.find({});
        var cupcakeProducts = await Cupcake.find({});
        var cookieProducts = await Cookie.find({});
        var products = [];
        var index = 0, num = 0;
            while (index < 9) {
                if (index < 3) {
                    num = Math.floor(Math.random() * cakeProducts.length);
                    products.push(cakeProducts[num]);
                    cakeProducts.splice(num, 1);
                } else if (index < 6) {
                    num = Math.floor(Math.random() * cupcakeProducts.length);
                    products.push(cupcakeProducts[num]);
                    cupcakeProducts.splice(num, 1);
                } else {
                    num = Math.floor(Math.random() * cookieProducts.length);
                    products.push(cookieProducts[num]);
                    cookieProducts.splice(num, 1);
                }
                index++;
            }
            */
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
            var productPreview = await Cake.find({})
        } else if (productType == 'Cupcake') {
            var productPreview = await Cupcake.find({})
        } else {
            var productPreview = await Cookie.find({})
        }
        
        res.render('products', {preview: productPreview, type:productType})
    },

    getProductInfo: async function(req, res) {
        var name = req.query.name
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

    adminCakePage: async function(req, res) {
        var cakes = await Cake.find({})
        res.render('cakesPage', {cakes: cakes})
        // res.render('addCake')
    },

    adminCupcakePage: async function(req, res) {
        res.render('addCupcake')
    },

    adminCookiePage: async function(req, res) {
        res.render('addCookie')
    },

    addCake: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            var productName = (req.body.productName).trim()
            var productVanilla6x5price = req.body.productPricesVanilla1
            var productVanilla8x5price = req.body.productPricesVanilla2
            var productChocolate6x5price = req.body.productPricesChocolate1
            var productChocolate8x5price = req.body.productPricesChocolate2
            var productDedication = req.body.productDedication
                if (productDedication == null) {
                    productDedication = '0'
                }
            var productNumberCake = req.body.productNumberCake
                if (productNumberCake == null) {
                    productNumberCake = '0'
                }
            const image = req.files.filename
            let date = new Date();
            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
            var imagePath = '/images/' + filenameChange;
            image.mv(path.resolve(__dirname, '../public/images', filenameChange),(error) => {
                Cake.create({
                    name: productName, 
                    vanilla6x5Price: productVanilla6x5price,
                    vanilla8x5Price: productVanilla8x5price,
                    chocolate6x5Price: productChocolate6x5price,
                    chocolate8x5Price: productChocolate8x5price,
                    image: imagePath,
                    dedication: productDedication,
                    numberCake: productNumberCake
                })
            })
            res.redirect('admin/addCake')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('admin/addCake');
        }
        
    },

    addCupcake: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            var productName = (req.body.productName).trim()
            var productVanilla = req.body.productPricesVanilla
            var productChocolate = req.body.productPricesChocolate
            var productRedVelvet = req.body.productPricesRedVelvet
            var productFrosting = req.body.productFrosting
            const image = req.files.filename
            let date = new Date();
            var filenameChange = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + 
                date.getSeconds() + '_'+ image.name;
            var imagePath = '/images/' + filenameChange;
            image.mv(path.resolve(__dirname, '../public/images', filenameChange),(error) => {
                Cupcake.create({
                    name: productName, 
                    vanillaPrice: productVanilla,
                    chocolatePrice: productChocolate,
                    redvelvetPrice: productRedVelvet,
                    frosting: productFrosting,
                    image: imagePath,
                })
            })
            res.redirect('admin/addCupcake')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('admin/addCupcake');
        }
        
    },

    addCookie: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            var productName = (req.body.productName).trim()
            var productPrices = req.body.productPrices
            var productDesign = req.body.productDesign
                if (productDesign == null) {
                    productDesign = '0'
                }
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
                    design: productDesign, 
                })
            })
            res.redirect('admin/addCookie')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('admin/addCookie');
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
    }

}   

module.exports = controller