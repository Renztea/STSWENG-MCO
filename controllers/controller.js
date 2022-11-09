const path = require('path')
const Products = require('../models/product')

const controller = {

    getIndexPage: function(req, res) {
        res.render('index')
    },

    getTestPage: function(req, res) {
        res.render('addProduct')
    },

    // Adds the new product into the database
    addProduct: async function(req, res) {
        var productName = req.body.productName
        // should be arrays
        var productSize = req.body.productSize
        var productFlavor = req.body.productFlavor
        var productPrice = req.body.productPrice
        const image = req.files.productImage
        var imagePath = '/images/' + image.name;
        image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
            Products.create({name:productName, sizes:productSize, flavors:productFlavor, price:productPrice, image:imagePath})
        })
        const testing = await Products.findOne({name:productName})
        res.render('viewProduct', testing)
    },

    viewProduct: async function(req, res) {
        // const {allProduct} = await user.findOne({username})
    }
   
}   

module.exports = controller