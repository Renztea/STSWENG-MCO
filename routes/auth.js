const router = require('express').Router();
const userController = require('../controllers/userController');
const {loginValidation} = require('../validators.js')

router.post('/login', loginValidation, userController.login)

module.exports = router;