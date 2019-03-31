const Discord = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');
const {
  eventDuration
} = require('../functions/helpers');

const Spark = require('../models/spark');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

module.exports.run = async (anna, message, args) => {
  let author = message.author.id;
  if (args.length == 3) {
    const spark = new Spark({
      author,
      goal: args[1],
      time: args[2],
      saving: 0,
      sparkAmount: args[0]
    }).save().catch(err => {
      if (!err) {
        return console.log(err);
      }
    })
    return message.channel.send(`${message.author}P-san, your goal ${args[1]} has been created.`);
  } else if (args.length == 1) {
    Spark.findOneAndUpdate({
      author
    }, {
      saving: args[0]
    }, {
      new: true
    }, (err, doc) => {
      if (!err) {
        let now = moment();
        return message.channel.send(`${message.author}P-san, you have managed to save ${doc.saving} of your goal of ${doc.sparkAmount}. It's ${Math.floor(doc.saving/doc.sparkAmount*100)}% of your goal. ${doc.goal} will come in ${eventDuration(moment(doc.time), now)}. Keep at it!`);
      }
    })
  } else if (args.length == 0) {
    Spark.findOne({
      author
    }, (err, doc) => {
      if (!err) {
        let now = moment();
        return message.channel.send(`${message.author}P-san, you have managed to save ${doc.saving} of your goal of ${doc.sparkAmount}. It's ${Math.floor(doc.saving/doc.sparkAmount*100)}% of your goal. ${doc.goal} will come in ${eventDuration(moment(doc.time), now)}. Keep at it!`);
      }
    })
  }
}

module.exports.help = {
  name: 'spark'
}