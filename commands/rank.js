const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');

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
  const [event, lounge] = await Promise.all([princess.getCurrentEvent(), princess.getLoungeData(loungeId)]);
  const loungeEvent = await princess.getLoungePoints(lounge.id,event.id);
  const loungeRank = loungeEvent[loungeEvent.length - 1].rank;
  const rankIncrease = loungeRank - loungeEvent[loungeEvent.length - 2].rank;
  const loungeScore = parseInt(loungeEvent[loungeEvent.length - 1].score);
  const scoreIncrease = loungeScore - parseInt(loungeEvent[loungeEvent.length - 2].score);
  const updatedAt = moment(loungeEvent[loungeEvent.length - 1].summaryTime).fromNow();
  return {
    event,
    lounge,
    loungeRank,
    loungeScore,
    rankIncrease: (rankIncrease > 0) ? `${rankIncrease}▼` : `${Math.abs(rankIncrease)}▲`,
    scoreIncrease,
    updatedAt
  };
}

module.exports.run = async (anna, message, args) => {
  const rank = await getRank();
  const now = moment();
  let footer = '';
  if (now < moment(rank.event.schedule.boostBeginDate)){
    let timeLeft = moment(rank.event.schedule.boostBeginDate).fromNow(true);
    footer = `${timeLeft} till multipliers are available.`;
  } else {
    let timeLeft = moment(rank.event.schedule.endDate).fromNow(true);
    footer = `${timeLeft} till the event ends.`;
  }
  const response = new Discord.RichEmbed()
    .setColor('#7e6ca8')
    .setAuthor(rank.event.name, 'https://i.imgur.com/sPOlPsI.png')
    .setTitle(`*(updated ${rank.updatedAt})*`)
    .addField('Rank', `${rank.loungeRank} (${rank.rankIncrease})` , true)
    .addField('Score', `${rank.loungeScore} (+${rank.scoreIncrease})`, true)
    .setFooter(footer);
  return message.channel.send(response);
}

module.exports.help = {
  name: 'rank'
}