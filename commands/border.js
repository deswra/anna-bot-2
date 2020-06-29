const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');
const { getRandomImg } = require('../resources/errors');
const { eventDuration, getIdFromName } = require('../functions/helpers');
const chars = require('../resources/chars');

const tier = [100, 2500, 5000, 10000, 25000, 50000, 100000];
const idolTier = [1, 2, 3, 10, 100, 1000];

module.exports.run = async (anna, message, args) => {
  if (!args[0]) {
    const currentEvent = await princess.getCurrentEvent();
    const borders = await princess.getEventBorders(currentEvent, 'eventPoint', tier.toString());
    if (borders.message != 'success') {
      const attachment = new Discord.Attachment(getRandomImg());
      if (borders.message === 'off-event') {
        return message.channel.send(`${message.author}P-san... too early...`, attachment);
      }
      if (borders.message === 'wrong event type') {
        return message.channel.send(
          `${message.author}P-san, you can't use that command during this type of event.`,
          attachment
        );
      }
    }
    let responseDescription = '';
    const now = moment();
    let boost = moment(currentEvent.schedule.boostBeginDate);
    let end = moment(currentEvent.schedule.endDate);
    if (now < boost) {
      responseDescription = `*Multipliers start:* ${moment(currentEvent.schedule.boostBeginDate)
        .add(9, 'hours')
        .format('YYYY-M-D H:mm')} (${eventDuration(boost, now)} left)\n`;
    }
    responseDescription += `*Event ends:* ${moment(currentEvent.schedule.endDate)
      .add(9, 'hours')
      .format('YYYY-M-D H:mm')} (${eventDuration(end, now)} left)\n`;
    const response = new Discord.RichEmbed()
      .setColor('#7e6ca8')
      .setAuthor(currentEvent.name, 'https://i.imgur.com/sPOlPsI.png')
      .setTitle(`Event Points Ranking *(updated ${moment(borders.updatedAt).fromNow()})*`)
      .setDescription(responseDescription);
    for (let i = 0; i < borders.borders.length; i++) {
      response.addField(
        `T${borders.borders[i].rank}`,
        `${borders.borders[i].score} (+${borders.borders[i].increase})`,
        true
      );
    }
    return message.channel.send(response);
  } else {
    const idolId = getIdFromName(args[0].toLowerCase());
    if (idolId) {
      const borders = await princess.getEventIdolBorders(142, idolId, idolTier.toString());
      const response = new Discord.RichEmbed()
        .setColor('#7e6ca8')
        .setAuthor(chars[idolId].name, 'https://i.imgur.com/sPOlPsI.png')
        .setTitle(`Event Points Ranking *(updated ${moment(borders.updatedAt).fromNow()})*`);
      borders.borders.forEach((rankBorder) => {
        response.addField(`Top ${rankBorder.rank}`, `${rankBorder.score} (+${rankBorder.increase})`, true);
      });
      return message.channel.send(response);
    }
  }
};

module.exports.help = {
  name: 'border',
};

module.exports.aliases = ['b'];
