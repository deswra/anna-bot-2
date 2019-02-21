const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const tier = [100, 2000, 5000, 10000, 20000];

async function getCurrentEvent() {
  const response = await fetch('https://api.matsurihi.me/mltd/v1/events?prettyPrint=false');
  const events = await response.json();
  return events[events.length - 1];
}

async function getBorder() {
  let response = {};
  const currentEvent = await getCurrentEvent();
  response.eventName = currentEvent.name;
  response.timeLeft = moment(currentEvent.schedule.endDate).fromNow(true);
  let count = 0;
  const eventPtsSummaryRes = await fetch(`https://api.matsurihi.me/mltd/v1/events/${currentEvent.id}/rankings/summaries/highScore?prettyPrint=false`);
  const eventPtsSummary = await eventPtsSummaryRes.json();
  const playersNum = eventPtsSummary[eventPtsSummary.length - 1].count;
  response.updatedAt = moment(eventPtsSummary[eventPtsSummary.length - 1].summaryTime).fromNow();
  const bordersSummaryRes = await fetch(`https://api.matsurihi.me/mltd/v1/events/${currentEvent.id}/rankings/logs/highScore/100,2000,5000,10000,20000?prettyPrint=false`);
  const bordersSummary = await bordersSummaryRes.json();
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
  const response = new Discord.RichEmbed()
    .setColor('#7e6ca8')
    .setAuthor(borders.eventName, 'https://i.imgur.com/sPOlPsI.png')
    .setTitle(`High Score Ranking *(updated ${borders.updatedAt})*`)
    .setFooter(`${borders.timeLeft} till the event ends.`);
  for (let i = 0; i < borders.borders.length; i++) {
    response.addField(`T${tier[i]}`, `${borders.borders[i].score} (+${borders.borders[i].increase})`, true);
  }
  return message.channel.send(response);
}

module.exports.help = {
  name: 'hborder'
}