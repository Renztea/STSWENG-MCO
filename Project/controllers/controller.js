const db = require('../models/db.js');
const Profile = require('../models/UsersModel.js');
const Post = require('../models/article.js');
const Comments = require('../models/comments.js');
const Likes = require('../models/likes.js');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const path = require('path');


const controller = {
    
    getFavicon: function (req, res) {
        res.status(204);
    },

    getIndexpage: function(req, res) {
        db.findMany(Post, {}, null, function(result) {
            if (result == null && req.session.user) {
                res.render('index', {loggedin : true, name: req.session.name});
            } else if (result == null && !req.session.user){
                res.render('index', { loggedin : false });
            } else if (result != null && req.session.user){
                res.render('index', {preview: result, loggedin : true, name: req.session.name});
            } else {
                res.render('index', {preview: result, loggedin: false});
            }
        });
    },

    getRecent: function(req, res) {
        db.findMany(Post, {}, null, function(result) {
            result.sort().reverse();
            if (result == null && req.session.user) {
                res.render('index', {loggedin : true, name: req.session.name});
            } else if (result == null && !req.session.user){
                res.render('index', { loggedin : false });
            } else if (result != null && req.session.user){
                res.render('index', {preview: result, loggedin : true, name: req.session.name});
            } else {
                res.render('index', {preview: result, loggedin: false});
            }
        });
    },

    getPopular: function(req, res) {
        db.findMany(Post, {}, null, function(result) {       
            result.sort((a,b) => {
                return a.likes - b.likes;
            }).reverse();
            if (result == null && req.session.user) {
                res.render('index', {loggedin : true, name: req.session.name});
            } else if (result == null && !req.session.user){
                res.render('index', { loggedin : false });
            } else if (result != null && req.session.user){
                res.render('index', {preview: result, loggedin : true, name: req.session.name});
            } else {
                res.render('index', {preview: result, loggedin: false});
            }
        })
    },

    getPostaBlog: function(req, res) {
        res.render('postablog', {loggedin : true, name: req.session.name});
    },
    
    getProfile: function(req, res) {  
        var id = new ObjectId(req.session.user);
            
        db.findOne(Profile, id, {}, function (result) {
            if(result) {
               db.findMany(Post, { ownerId: id }, {}, function (blog) {
                    if(blog) {
                        res.render('profile', { profile: result,  preview: blog, loggedin : true, name: req.session.name});
                    }
               }) 
            }
        })
    },

    getEditProfile: function(req, res) {  
        var id = new ObjectId(req.session.user);
            
        db.findOne(Profile, id, {}, function (result) {
            result.toObject();
            result.name = req.session.name;
            res.render('editprofile', result);
        })
    },

    postSubmitBlog: function(req, res){
        const {image} = req.files
        var owner = req.session.name;
        var ownerId = req.session.user;
        var title = req.body.title;
        var description = req.body.description;
        var content = req.body.content;
        var genre = req.body.genre;
        var imagelink = '/images/' + image.name;
        image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
            db.insertOne(Post, {owner: owner, ownerId: ownerId, title:title, description: description, content: content , genre: genre, image: imagelink}, function(result){
                res.redirect('/');
            });
        })
    },

    showBlog: function(req, res) {
        var id = new ObjectId(req.params.id);
        postID = id
        db.findMany(Post, id, {}, function (result) {
            var postdetails = result;
            db.findMany(Comments, {postID: postID}, {}, function(result) {
                postdetails[0].comment = result
                if (result && req.session.user && req.session.name == postdetails[0].owner){
                    postdetails[0].isowner = true
                    postdetails[0].loggedin = true
                    res.render('postpage', {result: postdetails, loggedin : true, name: req.session.name});
                } else if (result && req.session.user && req.session.name != postdetails[0].owner) {
                    postdetails[0].isowner = false
                    postdetails[0].loggedin = true
                    res.render('postpage', {result: postdetails, loggedin : true, name: req.session.name});
                } else if (result && !req.session.user) {
                    postdetails[0].isowner = false
                    postdetails[0].loggedin = false
                    res.render('postpage', {result: postdetails, loggedin : false});
                } else {
                    console.log('Blog not found');
                }
            })
        })
    },

    getEditBlog: function(req, res) {
        var id = new ObjectId(req.query.postID);

        db.findOne(Post, id, {}, function (result) {
            result.name = req.session.name
            res.render('editblog', result);
        })
    },

    updateBlog: function(req, res) {
        const errors = validationResult(req);
      
        if(errors.isEmpty()) {
          var id = new ObjectId(req.body._id);
      
          const { title, genre, description, content, image} = req.body;
      
          var Blog = {
            title: title,
            genre: genre,
            description: description,
            content: content,
          };
      
          if(req.files) {
            const { image } = req.files;
      
            var imagelink = '/images/' + image.name;
            Blog.image = imagelink;
            image.mv(path.resolve(__dirname, '../public/images', image.name),(error) => {
              db.updateOne(Post, {_id: id}, Blog, function (result) {
                 if(result) {
                    db.findOne(Post, {_id: id}, {}, function (newResult) {
                        newResult.success_msg = 'Update is a Success';
                        newResult.name = req.session.name;
                        res.render('editblog', newResult);
                    })
                 } else {
                   req.flash('error_msg', 'Failed to Update');
                   res.redirect('/editblog', req.body);
                 }
               })
            })
          } else {
            db.updateOne(Post, {_id: id}, Blog, function (result) {
               if(result) {
                db.findOne(Post, {_id: id}, {}, function (newResult) {
                    newResult.success_msg = 'Update is a Success';
                    newResult.name = req.session.name;
                    res.render('editblog', newResult);
                })
               } else {
                 req.flash('error_msg', 'Failed to Update');
                 res.redirect('/editblog', req.body);
               }
             })
          }
      
        } else {
          const messages = errors.array().map((item) => item.msg);
          //req.flash('error_msg', messages.join(' '));
          req.body.error_msg = messages.join(' ');
          res.render('editblog', req.body);
        }
    },

    deleteBlog: function(req, res) {
        var _id = new ObjectId(req.query.postID);

        db.deleteOne(Post, {_id : _id}, function(result){
            if (result) {
                res.redirect('/');
            } 
        })
    },

    searchBlog: function(req, res) {

        var search = req.body.searchinput;

        db.findMany(Post, {title: { "$regex": search, "$options": "i" }}, null, function(result) {
            if (result == null && req.session.user) {
                res.render('index', {loggedin : true, name: req.session.name});
            } else if (result == null && !req.session.user){
                res.render('index', { loggedin : false });
            } else if (result != null && req.session.user){
                res.render('index', {preview: result, loggedin : true, name: req.session.name});
            } else {
                res.render('index', {preview: result, loggedin: false});
            }
        });
    },

    getAddComment: function(req, res) {
        
        var comment = req.query.comment;
        var user = req.session.name;
        var postID = req.query.postID;

        db.insertOne(Comments, {postID: postID, user: user, comment: comment}, function(result){
            res.render('partials/comments', {user: user, comment: comment}, function (err, html){
                res.send(html);
            });
        });
    },

    addLike: function (req, res) {
        var user = req.session.name;
        var postID = req.query.postID;
        var count = req.query.numberoflikes;
        count = parseInt(count) + 1;
        var _id = new ObjectId(req.query.postID);

        db.findOne(Likes, {user: user, postID: postID}, {}, function (result) {
            if(!result) {
                db.updateOne(Post, {_id: _id}, {likes: count}, function (result) {
                })
                db.insertOne(Likes, {user: user, postID: postID}, function(result){
                    res.send('Goods');
                });
            }
        })
    },

    getCheckUser: function (req, res) {
        var username = req.query.username;

        db.findOne(Profile, {username: username}, 'username', function (result) {
            res.send(result);
        });
    },

    getCheckEmail: function (req, res) {
        var email = req.query.email;

        db.findOne(Profile, {email: email}, 'email', function (result) {
            res.send(result);
        });
    },

    getCheckPassword: function (req, res) {
        var password = req.query.password;
        var username = req.session.name

        db.findOne(Profile, { username: username }, {}, function (user) {
            if (!user) {
              req.flash('error_msg', 'Error!!! Please try again.');
              res.redirect('/login');
            } else {
                user.toObject();
                bcrypt.compare(password, user.password, (err, result) => {
                  if (result) {
                    res.send(password);
                  } else {
                    req.flash('error_msg', 'Incorrect password.');
                    res.redirect('/login');
                  }
                });
            }
          });
    }
}

module.exports = controller;