const { body } = require('express-validator');
var path = require('path')

const loginValidation = [
  body('username').not().isEmpty().withMessage("Username is required!"),
  body('password').not().isEmpty().withMessage("Password is required!")
];

const addCakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price for Vanilla 6"x 5" is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage('Price for Vanilla 8"x 5" is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price for Chocolate 6"x 5" is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage('Price for Chocolate 8"x 5" is required!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
  body('filename').custom((value, {req}) => {
    switch(path.extname(req.files.filename.name)){
      case ".png":
      case ".jpg":
      case ".jpeg":
        return true
        break;
      default:
        return false
        break;
    }
  }).withMessage("Please provide a valid image!").bail(),
  body('productPricesNumberCake').not().isEmpty().withMessage('Price is required for a number cake!!!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
]

const editCakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price for Vanilla 6"x 5" is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage('Price for Vanilla 8"x 5" is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price for Chocolate 6"x 5" is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage('Price for Chocolate 8"x 5" is required!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
  body('productPricesNumberCake').not().isEmpty().withMessage('Price is required for a number cake!!!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
]

const addCupcakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price for Vanilla flavor with Fondant is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage('Price for Vanilla flavor with Icing is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price for Chocolate flavor with Fondant is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage('Price for Chocolate flavor with Icing is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesRedVelvet1').not().isEmpty().withMessage('Price for Red Velvet flavor with Fondant is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesRedVelvet2').not().isEmpty().withMessage('Price for Red Velvet flavor with Icing is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('filename').custom((value, {req}) => {
    switch(path.extname(req.files.filename.name)){
      case ".png":
      case ".jpg":
      case ".jpeg":
        return true
        break;
      default:
        return false
        break;
    }
  }).withMessage("Please provide a valid image").bail(),
]

const editCupcakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price for Vanilla flavor with Fondant is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage('Price for Vanilla flavor with Icing is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price for Chocolate flavor with Fondant is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage('Price for Chocolate flavor with Icing is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesRedVelvet1').not().isEmpty().withMessage('Price for Red Velvet flavor with Fondant is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesRedVelvet2').not().isEmpty().withMessage('Price for Red Velvet flavor with Icing is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
]

const addCookieValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPrices').not().isEmpty().withMessage('Price is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('filename').custom((value, {req}) => {
    switch(path.extname(req.files.filename.name)){
      case ".png":
      case ".jpg":
      case ".jpeg":
        return true
        break;
      default:
        return false
        break;
    }
  }).withMessage("Please provide a valid image"),
]

const editCookieValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPrices').not().isEmpty().withMessage('Price is required!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
]

module.exports = { loginValidation , addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation, editCookieValidation};