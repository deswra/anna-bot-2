const Discord = require('discord.js');
const mongoose = require('mongoose');

const Quote = require('../models/quote');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

module.exports.run = async (anna, message, args) => {
  if (!args.length) return message.channel.send(`You have to mention which quotes it is, ${message.author}P-san...`);
  let author = message.author.id;
  let name = args.join(' ');
  if (/^"/.test(name)) {
    if (/"$/.test(name)) {
      name = name.slice(1, -1);
    }
  }
  Quote.findOneAndDelete({
    author,
    name
  }, (err, foundQuote) => {
    if (!foundQuote) return message.channel.send(`The quote ${name} doesn't exists or you're not the author, ${message.author}P-san...`);
    return message.channel.send(`Your quote ${foundQuote.name} has been deleted...`);
  });
}

module.exports.help = {
  name: 'qdel'
}