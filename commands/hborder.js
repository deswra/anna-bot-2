const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');
const { getRandomImg } = require('../resources/errors');
const { eventDuration } = require('../functions/helpers');

const tier = [100, 2000, 5000, 10000, 20000];

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
    princess.getSummaryCounts(event.id, 'highScore'),
    princess.getBorders(event.id, 'highScore', tier.toString())
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
    .setTitle(`High Score Ranking *(updated ${borders.updatedAt})*`)
    .setDescription(borders.description);
  for (let i = 0; i < borders.borders.length; i++) {
    response.addField(`T${tier[i]}`, `${borders.borders[i].score} (+${borders.borders[i].increase})`, true);
  }
  return message.channel.send(response);
};

module.exports.help = {
  name: 'hborder'
};
