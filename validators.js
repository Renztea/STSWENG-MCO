const { body } = require('express-validator');

const loginValidation = [
  body('username').not().isEmpty().withMessage("Username is required!"),
  body('password').not().isEmpty().withMessage("Password is required!")
];

const addProductValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .isEmpty().isInt({min : 0},{ allow_leading_zeroes: true }).withMessage("Inputted price is not valid"),
  body('productPricesVanilla2').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .isEmpty().isInt({min : 0},{ allow_leading_zeroes: true }).withMessage("Inputted price is not valid"),
  body('productPricesChocolate1').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .isEmpty().isInt({min : 0},{ allow_leading_zeroes: true }).withMessage("Inputted price is not valid"),
  body('productPricesChocolate2').not().isEmpty().withMessage("Price is requirved! If a cake does not have a specific size and flavor just put 0!")
    .isEmpty().isInt({min : 0},{ allow_leading_zeroes: true }).withMessage("Inputted price is not valid"),
  
  //body('filename').not().isEmpty().withMessage("Product image is required!"),
]


module.exports = { loginValidation , addProductValidation};