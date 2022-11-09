const { body } = require('express-validator');

const loginValidation = [
  body('username').not().isEmpty().withMessage("Username is required."),
  body('password').not().isEmpty().withMessage("Password is required.")
];

module.exports = { loginValidation };