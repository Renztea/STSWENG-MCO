const { body } = require('express-validator');

const loginValidation = [
  body('username').not().isEmpty().withMessage("Username is required!"),
  body('password').not().isEmpty().withMessage("Password is required!")
];

const addProductValidation = [
  body('productName').not().isEmpty().withMessage("Product name is required!"),
  body('productPricesVanilla1').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesVanilla2').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate1').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .bail().isInt({min: 0}).withMessage("Please provide a valid price!"),
  body('productPricesChocolate2').not().isEmpty().withMessage("Price is required! If a cake does not have a specific size and flavor just put 0!")
    .bail().isInt({min:0}).withMessage("Please provide a valid price"),
  //body('filename').not().isEmpty().withMessage("Product image is required!"),
]


module.exports = { loginValidation , addProductValidation};