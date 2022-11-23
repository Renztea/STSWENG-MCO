const { body } = require('express-validator');
var path = require('path')

const loginValidation = [
  body('username').not().isEmpty().withMessage("Username is required!"),
  body('password').not().isEmpty().withMessage("Password is required!")
];

const addCakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price is required! If a cake does not have a Vanilla 6"x 5" just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage('Price is required! If a cake does not have a Vanilla 8"x 5" just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price is required! If a cake does not have a Chocolate 6"x 5" just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage('Price is required! If a cake does not have a Chocolate 8"x 5" just put 0!')
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
  }).withMessage("Please provide a valid image").bail(),
  body('productPricesNumberCake').not().isEmpty().withMessage('Price is required for a number cake!!!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
]

const editCakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price is required! If a cake does not have a Vanilla 6"x 5" just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage('Price is required! If a cake does not have a Vanilla 8"x 5" just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price is required! If a cake does not have a Chocolate 6"x 5" just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage('Price is required! If a cake does not have a Chocolate 8"x 5" just put 0!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
  body('filename').custom((value, {req}) => {
    switch(path.extname(req.files.filename.name)){
      case ".png":
      case ".jpg":
      case ".jpeg":
      case "":
        return true
        break;
      default:
        return false
        break;
    }
  }).withMessage("Please provide a valid image").bail(),
  body('productPricesNumberCake').not().isEmpty().withMessage('Price is required for a number cake!!!')
    .bail().isInt({min:0}).withMessage("Please provide a valid price!"),
]

const addCupcakeValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Vanilla flavor with Fondant just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
    body('productPricesVanilla2').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Vanilla flavor with Icing just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Chocolate flavor with Fondant just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
    body('productPricesChocolate2').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Chocolate flavor with Icing just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesRedVelvet1').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Red Velvet flavor with Fondant just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
    body('productPricesRedVelvet2').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Red Velvet flavor with Icing just put 0!')
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
  body('productPricesVanilla1').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Vanilla flavor with Fondant just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
    body('productPricesVanilla2').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Vanilla flavor with Icing just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Chocolate flavor with Fondant just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
    body('productPricesChocolate2').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Chocolate flavor with Icing just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesRedVelvet1').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Red Velvet flavor with Fondant just put 0!')
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
    body('productPricesRedVelvet2').not().isEmpty().withMessage('Price is required! If a cupcake does not have a Red Velvet flavor with Icing just put 0!')
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

module.exports = { loginValidation , addCakeValidation, addCupcakeValidation, addCookieValidation, editCakeValidation, editCupcakeValidation};