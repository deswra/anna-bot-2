const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const loungeId = 'UUQGEDQQ';

async function getCurrentEvent() {
  const response = await fetch('https://api.matsurihi.me/mltd/v1/events?prettyPrint=false');
  const events = await response.json();
  return events[events.length - 1];
}

async function getLoungeId() {
  const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}?prettyPrint=false`);
  const loungeInfo = await response.json();
  return loungeInfo.id;
}

async function getRank() {
  const event = await getCurrentEvent();
  const longId = await getLoungeId();
  const response = await fetch(`https://api.matsurihi.me/mltd/v1/events/${event.id}/rankings/logs/loungePoint/${longId}?prettyPrint=false`);
  const loungeLog = await response.json();
  const loungeRank = await loungeLog[loungeLog.length - 1];
  const lastLoungeRank = await loungeLog[loungeLog.length - 2];
  const rankIncrease = await parseInt(loungeRank.rank - lastLoungeRank.rank);
  return {
    eventName: event.name,
    rank: loungeRank.rank,
    score: parseInt(loungeRank.score),
    rankIncrease: (rankIncrease > 0) ? `${rankIncrease}▼` : `${Math.abs(rankIncrease)}▲`,
    increase: parseInt(loungeRank.score - lastLoungeRank.score),
    updatedAt: moment(loungeRank.summaryTime).fromNow(),
    timeLeft: moment(event.schedule.endDate).fromNow(true)
  };
}

module.exports.run = async (anna, message, args) => {
  const rank = await getRank();
  await rank;
  const response = new Discord.RichEmbed()
    .setColor('#7e6ca8')
    .setAuthor(rank.eventName, 'https://i.imgur.com/sPOlPsI.png')
    .addField('Rank', `${rank.rank} (${rank.rankIncrease})` , true)
    .addField('Score', `${rank.score} (+${rank.increase})`, true)
    .addField('Last updated', rank.updatedAt, false)
    .setFooter(`${rank.timeLeft} till the event ends.`);
  return message.channel.send(response);
}

module.exports.help = {
  name: 'rank'
}