const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  author: String,
  name: String,
  content: String
});

module.exports = mongoose.model('Quote', quoteSchema);