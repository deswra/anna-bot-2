const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');
const { getRandomImg } = require('../resources/errors');

const tier = [100, 2000, 5000, 10000, 20000];

async function getBorder() {
  let response = {};
  const event = await princess.getCurrentEvent();
  if ((event.type == 1) || (event.type == 2) || (event.type == 6)) {
    return false;
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
  const [eventPtsSummary, bordersSummary] = await Promise.all([princess.getSummaryCounts(event.id, 'highScore'), princess.getBorders(event.id, 'highScore', tier.toString())]);
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
  return response;
}

module.exports.run = async (anna, message, args) => {
  const borders = await getBorder();
  if (!borders) {
    const attachment = new Discord.Attachment(getRandomImg());
    return message.channel.send(`${message.author}P-san, you can't use that command during this type of event.`, attachment);
  }
  const response = new Discord.RichEmbed()
    .setColor('#7e6ca8')
    .setAuthor(borders.eventName, 'https://i.imgur.com/sPOlPsI.png')
    .setTitle(`High Score Ranking *(updated ${borders.updatedAt})*`)
    .setFooter(borders.footer);
  for (let i = 0; i < borders.borders.length; i++) {
    response.addField(`T${tier[i]}`, `${borders.borders[i].score} (+${borders.borders[i].increase})`, true);
  }
  return message.channel.send(response);
}

module.exports.help = {
  name: 'hborder'
}