const path = require('path')
const Products = require('../models/product')
const Flavors = require('../models/productFlavor')
const Sizes = require('../models/productSize')
const Types = require('../models/productType')
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

    getProductPage: async function(req,res) {
        // var productPreview = await Products.find({type: 'Cake'})
        var value = req.params.type
        console.log(value)
        var productPreview = await Images.find({})
        res.render('products', {preview: productPreview})
    },

    addCake: async function(req, res) {
        var productName = req.body.productName
        var productPrice = req.body.productPrice
        var productType = "Cake"
        var productFlavor = req.body.productFlavor
        var productSize = req.body.productSize
        if (await Products.findOne({name: productName}) == null) {
            const image = req.files.productImage
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