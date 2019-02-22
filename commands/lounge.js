const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');

module.exports.run = async (anna, message, args) => {
  if (!args.length) {
    const loungeName = args.join(' ');
    const searchResults = await princess.searchLounge(loungeName);
    const searchResult = await searchResults[0];
    if (searchResult !== undefined) {
      const loungeData = await princess.getLoungeData(searchResult.id);
      const loungeHistory = await princess.getLoungeHistory(searchResult.id);
      const response = new Discord.RichEmbed()
        .setColor('#7e6ca8')
        .setAuthor(loungeData.name)
        .setTitle(`Lounge was founded on ${moment(loungeData.createTime).format('MMMM Do YYYY')}.`)
        .setDescription(loungeData.comment);
    }
    return message.channel.send(response);
  } else {
    return message.channel.send(`Anna needs a lounge name, ${message.author}P-san...`);
  }
}

module.exports.help = {
  name: 'lounge'
}