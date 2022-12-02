const user = require('../models/users');
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator');

/*
// Just used when creating the initial admin account for the client
exports.register = async (req, res) => {
    const {username, password} = req.body;
    const checkUsername = await user.findOne({username:username})
    if (checkUsername) {
        console.log('Username is already in use')
        res.redirect('/register')
    } else {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hashed) => {
            const newUser = {
                username,
                password: hashed,
            };
            await user.create(newUser)
            console.log('registered')
            res.redirect('/admin')
        });
    }
};
*/

exports.login = async (req, res) => {

    const errors = validationResult(req)

    if (errors.isEmpty()) {
        const {username, password} = req.body;
        const checkUser = await user.findOne({username: username})
        if (checkUser == null) {
            req.flash('error_msg', 'Username does not exist!');
            res.redirect('/admin');
        } else {
            checkUser.toObject()
            bcrypt.compare(password, checkUser.password, (err, result) => {
                if (result) {
                    req.session.username = checkUser.username;
                    res.redirect('/admin/orders/all');
                } else {
                    req.flash('error_msg', 'Incorrect password!');
                    res.redirect('/admin');
                }
            });
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join("\r\n"));
        res.redirect('/admin');
    }
}

exports.logoutUser = (req, res) => {
    /*
    if (req.session.username) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/admin');
      });
    }*/
    console.log(req.session.orders)
    delete req.session.orders;
    console.log(req.session.orders)
};

