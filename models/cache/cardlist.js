const mongoose = require('mongoose');

const cardListSchema = mongoose.Schema({
  id: Number,
  name: String,
  idolId: Number,
  idolType: Number,
  resourceId: String,
  rarity: Number,
  flavorText: String,
  flavorTextAwakened: String,
  awakeningText: String,
  skillName: String
});

module.exports = mongoose.model('CardList', cardListSchema);
