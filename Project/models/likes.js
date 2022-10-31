var mongoose = require('mongoose');

var likesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  postID: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Likes', likesSchema);