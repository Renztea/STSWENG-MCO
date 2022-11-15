const path = require('path')
const Products = require('../models/product')
const Images = require('../models/productImage')

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
        var productName = req.body.productName
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
        res.redirect('addCake')
    },

}   

module.exports = controller