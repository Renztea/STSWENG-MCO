const router = require('express').Router();
const userController = require('../controllers/userController');
const { loginValidation } = require('../validators.js')

router.post('/login', loginValidation, userController.login)
router.get('/logout', userController.logoutUser)

module.exports = router;