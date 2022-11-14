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

    getAdminPage: function(req, res) {
        res.render('login')
    },

    getCakeProducts: async function(req, res) {
        var productPreview = await Images.find({type: 'Cake'})
        
        res.render('products', {preview: productPreview})
    },

    getCupcakeProducts: async function(req, res) {
        var productPreview = await Images.find({type: 'Cupcake'})
        res.render('products', {preview: productPreview})
    },

    getCookieProducts: async function(req, res) {
        var productPreview = await Images.find({type: 'Cookie'})
        res.render('products', {preview: productPreview})
    },

    // Testing with Jasper
    runAddFlavor: async function(req, res) {
        var types = await Types.find({})
        res.render('addFlavor', {types: types})
    },

    runAddSize: async function(req, res) {
        var types = await Types.find({})
        res.render('addSize', {types: types})
    },

    runAddType: function(req, res) {
        res.render('addType')
    },

    runAddCakePage: async function(req, res) {
        var sizes = await Sizes.find({type: 'Cake'})
        var flavors = await Flavors.find({type: 'Cake'})
        res.render('testingwithJasper', {sizes: sizes, flavors: flavors})
    },

    addType: async function(req, res) {
        var type = req.body.productType
        await Types.create({type: type})
        res.redirect('addType')
    },


    addFlavor: async function(req, res) {
        var type = req.body.productType
        var flavor = req.body.productFlavor
        await Flavors.create({type: type, flavor:flavor})
        res.redirect('addFlavor')
    },

    addSize: async function(req, res) {
        var type = req.body.productType
        var size = req.body.productSize
        await Sizes.create({type: type, size:size})
        res.redirect('addSize')
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