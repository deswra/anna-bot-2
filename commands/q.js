const Discord = require('discord.js');
const mongoose = require('mongoose');

const Quote = require('../models/quote');

const img = /(png|jpg|gif|jpeg|svg)$/i;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports.run = async (anna, message, args) => {
  let author = message.author.id;
  let name = args.shift();
  if (/^"/.test(name)) {
    if (!/"$/.test(name))
    {
      let i = 0;
      while (args.length)
      {
        name += ' ';
        name += args.shift();
        if (/"$/.test(name)) break;
        i++;
      }
    }
    name = name.slice(1, -1);
  }
  if (args.length > 0) {
    Quote.findOne({ name }, (err, foundQuote) => {
      let content = args.join(' ');
      if (!foundQuote){
        const quote = new Quote({
          author,
          name,
          content
        });
        quote.save().then(res => console.log(res)).catch(err => console.log(err));
        return message.channel.send(`${message.author}P-san, your quote has been added.`);
      }
      if (foundQuote.author == author){
        foundQuote.content = content;
        foundQuote.save().then(res => console.log(res)).catch(err => console.log(err));
        return message.channel.send(`${message.author}P-san, your quote has been updated.`)
      } else {
        return message.channel.send(`The quote ${name} already exists, ${message.author}P-san.`);
      }
    });
  } else {
    Quote.findOne({ name }, (err, foundQuote) => {
      if (!foundQuote) return message.channel.send(`The quote ${name} doesn't exists, ${message.author}P-san.`);
      if (img.test(foundQuote.content)){
        const attachment = new Discord.Attachment(foundQuote.content);
        return message.channel.send(attachment);
      }
      return message.channel.send(foundQuote.content);
    })
  }
}

module.exports.help = {
  name: 'q'
}