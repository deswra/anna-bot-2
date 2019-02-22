const Discord = require('discord.js');
const moment = require('moment');
const princess = require('../functions/princess');

module.exports.run = async (anna, message, args) => {
  if (args.length) {
    const loungeName = args.join(' ');
    const searchResults = await princess.searchLounge(loungeName);
    const searchResult = await searchResults[0];
    if (searchResult !== undefined) {
      const loungeData = await princess.getLoungeData(searchResult.id);
      let loungeHistory = await princess.getLoungeHistory(searchResult.id);
      loungeHistory = loungeHistory.sort((a, b) => a.rank - b.rank).slice(0, 5);
      let loungeHistoryRes = '';
      loungeHistory.forEach(event => {
        loungeHistoryRes += `${event.rank} - ${event.eventName.includes('～')?event.eventName.split('～')[1]:event.eventName}\n`
      });
      loungeHistoryRes = loungeHistoryRes.slice(0, -1);
      const response = new Discord.RichEmbed()
        .setColor('#7e6ca8')
        .setAuthor(loungeData.name)
        .setTitle(`Lounge was founded on ${moment(loungeData.createTime).format('MMMM Do YYYY')} by ${loungeData.masterName}.`)
        .setDescription(loungeData.comment)
        .addField('Highest ranked events', loungeHistoryRes, false);
      return message.channel.send(response);
    }
  } else {
    return message.channel.send(`Anna needs a lounge name, ${message.author}P-san...`);
  }
}

module.exports.help = {
  name: 'lounge'
}