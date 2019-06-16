const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
  user: String,
  score: Number
});

module.exports = mongoose.model('Score', scoreSchema);
