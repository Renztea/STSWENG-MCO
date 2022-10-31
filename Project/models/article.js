var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required:true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  likes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Article', articleSchema);