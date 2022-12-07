const router = require('express').Router();
const userController = require('../controllers/userController');
const { loginValidation } = require('../validators.js')
const { isPublic, isPrivate } = require('../middlewares/userAuth');

router.post('/login', loginValidation, userController.login)
router.get('/logout', userController.logoutUser)

/*
// With Authentication
router.post('/login', isPublic, loginValidation, userController.login)
router.get('/logout', isPrivate, userController.logoutUser)
*/

module.exports = router;