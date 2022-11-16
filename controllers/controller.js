const path = require('path')
const Products = require('../models/product')
const { validationResult } = require('express-validator');
// const Info = require('../models/testingProduct')

const controller = {

    getIndexPage: function(req, res) {
        res.render('index')
    },

    getMainPage: function(req, res) {
        res.render('main')
    },

    getAdminPage: function(req, res) {
        res.render('login')
    },

    getProductPage: async function(req, res) {
        var productType = req.params.type
        var productPreview = await Products.find({type: productType})
        res.render('products', {preview: productPreview})
    },

    getAddCakePage: async function(req, res) {
        res.render('addCake')
    },

    addCake: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            var productName = req.body.productName
            var productType = 'Cake'
            var productInfo = [
                {size: '6" x 5"', flavor: 'Vanilla', price: req.body.productPricesVanilla1},
                {size: '8" x 5"', flavor: 'Vanilla', price: req.body.productPricesVanilla2},
                {size: '6" x 5"', flavor: 'Chocolate', price: req.body.productPricesChocolate1},
                {size: '8" x 5"', flavor: 'Chocolate', price: req.body.productPricesChocolate2},
            ]
            var productDedication = req.body.productDedication
                if (productDedication == null) {
                    productDedication = '0'
                }
            var productNumberCake = req.body.productNumberCake
                if (productNumberCake == null) {
                    productNumberCake = '0'
                }
            const image = req.files.filename
            console.log(image)
            var imagePath = '/images/' + image.name;
            image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
                Products.create({name: productName, info: productInfo, type: productType, image: imagePath, dedication: productDedication, numbercake: productNumberCake})
            })
            res.redirect('addCake')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages.join("\r\n"));
            res.redirect('addCake');
        }
        
    },

}   

module.exports = controller