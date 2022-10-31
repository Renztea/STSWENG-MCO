var mongoose = require('mongoose');

var commentsSchema = new mongoose.Schema({
  postID: {
    type: String
  },
  user: {
    type: String
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model('Comment', commentsSchema);