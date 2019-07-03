const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');
const { getRandomImg } = require('../resources/errors');
const { eventDuration, getIdFromName } = require('../functions/helpers');
const chars = require('../resources/chars');

const tier = [100, 2500, 5000, 10000, 25000, 50000, 100000];
const idolTier = [1, 10, 100, 1000];

async function getBorder() {
  let response = {};
  const event = await princess.getCurrentEvent();
  if (!event)
    return {
      message: 'off-event'
    };
  if (event.type == 1 || event.type == 2 || event.type == 6) {
    return {
      message: 'wrong event type'
    };
  }
  response.eventName = event.name.includes('～') ? event.name.split('～')[1] : event.name;
  // Time till multipliers/event's end
  const now = moment();
  let description = '';
  let boost = moment(event.schedule.boostBeginDate);
  let end = moment(event.schedule.endDate);
  if (now < boost) {
    description = `*Multipliers start:* ${moment(event.schedule.boostBeginDate)
      .add(9, 'hours')
      .format('YYYY-M-D H:mm')} (${eventDuration(boost, now)} left)\n`;
  }
  description += `*Event ends:* ${moment(event.schedule.endDate)
    .add(9, 'hours')
    .format('YYYY-M-D H:mm')} (${eventDuration(end, now)} left)\n`;
  response.description = description;
  let count = 0;
  const [eventPtsSummary, bordersSummary] = await Promise.all([
    princess.getSummaryCounts(event.id, 'eventPoint'),
    princess.getBorders(event.id, 'eventPoint', tier.toString())
  ]);
  if (!eventPtsSummary)
    return {
      message: 'off-event'
    };
  if (!bordersSummary[0].data)
    return {
      message: 'off-event'
    };
  const playersNum = eventPtsSummary.count;
  response.updatedAt = moment(eventPtsSummary.summaryTime).fromNow();
  let borders = [];
  while (playersNum >= tier[count]) {
    let border = bordersSummary[count].data[bordersSummary[count].data.length - 1].score;
    let increase = 0;
    if (bordersSummary[count].data.length != 1) {
      increase = border - bordersSummary[count].data[bordersSummary[count].data.length - 2].score;
    }
    borders.push({
      score: border,
      increase: increase
    });
    count++;
  }
  response.borders = borders;
  response.message = 'success';
  return response;
}

module.exports.run = async (anna, message, args) => {
  if (!args[0]) {
    const borders = await getBorder();
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
    const response = new Discord.RichEmbed()
      .setColor('#7e6ca8')
      .setAuthor(borders.eventName, 'https://i.imgur.com/sPOlPsI.png')
      .setTitle(`Event Points Ranking *(updated ${borders.updatedAt})*`)
      .setDescription(borders.description);
    for (let i = 0; i < borders.borders.length; i++) {
      response.addField(`T${tier[i]}`, `${borders.borders[i].score} (+${borders.borders[i].increase})`, true);
    }
    return message.channel.send(response);
  } else {
    const idolId = getIdFromName(args[0]);
    if (idolId) {
      const borders = await princess.getIdolPoint(92, idolId);
      const response = new Discord.RichEmbed()
        .setColor('#7e6ca8')
        .setAuthor(chars[idolId].name, 'https://i.imgur.com/sPOlPsI.png')
        .setTitle(
          `Event Points Ranking *(updated ${moment(
            borders[0].data[borders[0].data.length - 1].summaryTime
          ).fromNow()})*`
        );
      for (let i = 0; i < borders.length; i++) {
        response.addField(
          `Top ${borders[i].rank}`,
          `${parseInt(borders[i].data[borders[i].data.length - 1].score)} (+${parseInt(
            borders[i].data[borders[i].data.length - 1].score - borders[i].data[borders[i].data.length - 2].score
          )})`,
          true
        );
      }
      return message.channel.send(response);
    }
  }
};

module.exports.help = {
  name: 'border'
};
