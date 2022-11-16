const path = require('path')
const Products = require('../models/product')
const Info = require('../models/productInfo')

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
        var productPreview = await Images.find({name: 'Jasper', image:'/images/basket.png'})
        res.render('products', {preview: productPreview})
    },

    getAddCakePage: async function(req, res) {
        res.render('addCake')
    },

    addCake: async function(req, res) {
        /*var productName = req.body.productName
        var productPrice = req.body.productPrices
        var productType = 'Cake'
        var productFlavor = req.body.productFlavors
        var productSize = req.body.productSizes
        if (await Products.findOne({name: productName}) == null) {
            const image = req.files.filename
            var imagePath = '/images/' + image.name;
            image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
            Products.create({name:productName, type: productType, price:productPrice, size:productSize, flavor:productFlavor})
            Images.create({name: productName, image:imagePath})
        })} else {
            Products.create({name:productName, type: productType, price:productPrice, size:productSize, flavor:productFlavor})
        }
        res.redirect('addCake')*/

        var productName = req.body.productName
        var productType = 'Cake'
        var productFlavor1 = 'Vanilla'
        var productFlavor2 = 'Chocolate'
        var productSize1 = '6" x 5"'
        var productSize2 = '8" x 5"'
        var productPricesVanilla1 = req.body.productPricesVanilla1
        var productPricesVanilla2 = req.body.productPricesVanilla2
        var productPricesChocolate1 = req.body.productPricesChocolate1
        var productPricesChocolate2 = req.body.productPricesChocolate2
        var productDedication = req.body.productDedication
        var productNumberCake = req.body.productNumberCake
        const image = req.files.filename
        var imagePath = '/images/' + image.name;
        image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
            Products.create({name:productName, type: productType, size: productSize1, flavor:productFlavor1, price:productPricesVanilla1})
            Products.create({name:productName, type: productType, size: productSize2, flavor:productFlavor1, price:productPricesVanilla2})
            Products.create({name:productName, type: productType, size: productSize1, flavor:productFlavor2, price:productPricesChocolate1})
            Products.create({name:productName, type: productType, size: productSize2, flavor:productFlavor2, price:productPricesChocolate2})
            Info.create({name: productName, image:imagePath, dedication:productDedication, numbercake:productNumberCake})
        })
        res.redirect('addCake')
    },

}   

module.exports = controller