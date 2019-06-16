const mongoose = require('mongoose');

const updatedAtSchema = mongoose.Schema({
  name: String,
  updatedAt: Date
});

module.exports = mongoose.model('UpdatedAt', updatedAtSchema);
