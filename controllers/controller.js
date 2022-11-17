const path = require('path')
const { validationResult } = require('express-validator');
const Cake = require('../models/cake')
const Cupcake = require('../models/cupcake')
const Cookie = require('../models/cookie')

const controller = {

    getIndexPage: function(req, res) {
        res.render('main')
    },

    /*
    getMainPage: function(req, res) {
        res.render('main')
    },
    */
   
    getAdminPage: function(req, res) {
        res.render('login')
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
        
        res.render('products', {preview: productPreview})
    },

    getAddCakePage: async function(req, res) {
        res.render('addCake')
    },

    addCake: async function(req, res) {

        const errors = validationResult(req)

        if (errors.isEmpty()) {
            var productName = req.body.productName
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
            var imagePath = '/images/' + image.name;
            image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
                Cake.create({
                    name: productName, 
                    vanilla6x5price: productVanilla6x5price,
                    vanilla8x5price: productVanilla8x5price,
                    chocolate6x5price: productChocolate6x5price,
                    chocolate8x5price: productChocolate8x5price,
                    image: imagePath,
                    dedication: productDedication,
                    numbercake: productNumberCake
                })
            })
            res.redirect('addCake')
        } else {
            const messages = errors.array().map((item) => item.msg);
            req.flash('error_msg', messages[0]);
            res.redirect('addCake');
        }
        
    },

}   

module.exports = controller