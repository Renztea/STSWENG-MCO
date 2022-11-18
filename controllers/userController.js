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
        const checkUsername = await user.findOne({"name": username})
        if (checkUsername != null && checkUsername.password == password) {
            console.log("login accepted for " + checkUsername.name + " with passsword " + checkUsername.password)
            res.redirect('/admin/viewOrders/ALL/0'); // Made Changes Here(John)
        } else if (checkUsername == null) {
            console.log("user don't exist")
            req.flash('error_msg', 'Username does not exist!');
            res.redirect('/admin');
        } else {
            console.log("wrong password")
            req.flash('error_msg', 'Incorrect Password!');
            res.redirect('/admin');
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join("\r\n"));
        res.redirect('/admin');
    }
}

