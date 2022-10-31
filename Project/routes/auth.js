const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, profileValidation, blogValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');

router.get('/login', isPublic, (req, res) => {
  res.render('login');
});

router.get('/register', isPublic, (req, res) => {
  res.render('register');
});

router.post('/register', isPublic, registerValidation, userController.registerUser);
router.post('/login', isPublic, loginValidation, userController.loginUser);
router.post('/updateProfile', isPrivate, profileValidation, userController.updateUser); 
router.get('/deleteProfile', isPrivate, userController.deleteUser); 

router.get('/editprofile', isPrivate, (req, res) => {
  res.render('editprofile', req.body);
});

router.get('/logout', isPrivate, userController.logoutUser);

module.exports = router;