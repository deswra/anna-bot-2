const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');
const { getRandomImg } = require('../resources/errors');

const tier = [10, 50, 100, 250, 500];

async function getBorder() {
  let response = {};
  const event = await princess.getCurrentEvent();
  if (!event) return {
    message: 'off-event'
  };
  if ((event.type == 1) || (event.type == 2) || (event.type == 6)) {
    return {
      message: 'wrong event type'
    };
  }
  response.eventName = event.name;
  // Time till multipliers/event's end
  const now = moment();
  let footer = '';
  if (now < moment(event.schedule.boostBeginDate)) {
    let timeLeft = moment(event.schedule.boostBeginDate).fromNow(true);
    footer = `${timeLeft} till multipliers are available.`;
  } else {
    let timeLeft = moment(event.schedule.endDate).fromNow(true);
    footer = `${timeLeft} till the event ends.`;
  }
  response.footer = footer;
  let count = 0;
  const [eventPtsSummary, bordersSummary] = await Promise.all([princess.getSummaryCounts(event.id, 'loungePoint'), princess.getBorders(event.id, 'loungePoint', tier.toString())]);
  if (!eventPtsSummary) return {
    message: 'off-event'
  };
  const playersNum = eventPtsSummary.count;
  response.updatedAt = moment(eventPtsSummary.summaryTime).fromNow();
  let borders = [];
  while (playersNum >= tier[count]) {
    let border = bordersSummary[count].data[bordersSummary[count].data.length - 1].score;
    let increase = border - bordersSummary[count].data[bordersSummary[count].data.length - 2].score;
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
  const borders = await getBorder();
  if (borders.message != 'success') {
    const attachment = new Discord.Attachment(getRandomImg());
    if (borders.message === 'off-event') {
      return message.channel.send(`${message.author}P-san... too early...`, attachment);
    }
    if (borders.message === 'wrong event type') {
      return message.channel.send(`${message.author}P-san, you can't use that command during this type of event.`, attachment);
    }
  }
  if (!borders) {
    const attachment = new Discord.Attachment(getRandomImg());
    return message.channel.send(`${message.author}P-san, you can't use that command during this type of event.`, attachment);
  }
  const response = new Discord.RichEmbed()
    .setColor('#7e6ca8')
    .setAuthor(borders.eventName, 'https://i.imgur.com/sPOlPsI.png')
    .setTitle(`Lounge Points Ranking *(updated ${borders.updatedAt})*`)
    .setFooter(borders.footer);
  for (let i = 0; i < borders.borders.length; i++) {
    response.addField(`T${tier[i]}`, `${borders.borders[i].score} (+${borders.borders[i].increase})`, true);
  }
  return message.channel.send(response);
}

module.exports.help = {
  name: 'lborder'
}