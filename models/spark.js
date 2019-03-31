const mongoose = require('mongoose');

const sparkSchema = mongoose.Schema({
  author: String,
  goal: String,
  time: Date,
  saving: Number,
  sparkAmount: Number
});

module.exports = mongoose.model('Spark', sparkSchema);