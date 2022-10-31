const mongoose = require('./connection');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, min: 8, 
        required: true 
    },
    birthday: { 
        type: String, 
    },
    gender: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    avatar: {
        type: String
    }
  },
);

const User = mongoose.model('users', userSchema);
/*
exports.create = function(obj, next) {
  const user = new User(obj);

  user.save(function(err, user) {
    next(err, user);
  });
};

exports.getById = function(id, next) {
  User.findById(id, function(err, user) {
    next(err, user);
  });
};

exports.getOne = function(query, next) {
  User.findOne(query, function(err, user) {
    next(err, user);
  });
};
*/
module.exports = User;