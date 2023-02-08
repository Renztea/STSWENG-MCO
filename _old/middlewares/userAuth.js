// Redirects non-admin users to the login page.
exports.isPrivate = (req, res, next) => {
    if (req.session.username) {
        return next();
    } else {
        res.redirect('/admin');
    }
};

// Redirects a logged in admin to the admin orders page.
exports.isPublic = (req, res, next) => {
    if (req.session.username) {
        res.redirect('/admin/orders/all')
    } else {
        return next();
    }
};