const user = require('../models/users');
const { validationResult } = require('express-validator');

/*
// Juse in case a Register function becomes needed
exports.register = async (req, res) => {
    const {username, password} = req.body;
    const checkUsername = await user.findOne({username:username})
    if (checkUsername) {
        console.log('Already Available')
        res.redirect('/')
    } else {
        const newUser = await user.create({username, password})
        console.log('registered')
        res.redirect('/')
    }
};
*/

exports.login = async (req, res) => {

    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const {username, password} = req.body;
        const checkUsername = await user.findOne({username})
        if (checkUsername != null && checkUsername.password == password) {
            console.log("login accepted for " + checkUsername.username + " with passsword " + checkUsername.password)
        } else if (checkUsername == null) {
            console.log("user dont exist")
        } else {
            console.log("wrong password")
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/admin');
    }
}

