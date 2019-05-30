const Discord = require('discord.js');
const mongoose = require('mongoose');

const Quote = require('../models/quote');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports.run = async (anna, message, args) => {
  let user = message.mentions.users.first();
  if (!user) user = message.author;
  Quote.find({ author: user.id }, (err, foundQuotes) => {
    if (!foundQuotes.length) return message.channel.send(`${user.username} hasn't made any quotes yet...`);
    let response = `Quotes added by ${user.username}P-san: `;
    foundQuotes.forEach(quote => {
      response += quote.name;
      response += ', ';
    });
    response = response.slice(0, -2) + '.';
    return message.channel.send(response);
  });
};

module.exports.help = {
  name: 'qlist'
};
