const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const princess = require('../functions/princess');
const {
  getRandomImg
} = require('../resources/errors');

const loungeId = 'UUQGEDQQ';

async function getRank() {
  const [event, lounge] = await Promise.all([princess.getCurrentEvent(), princess.getLoungeData(loungeId)]);
  if (!event) return {
    message: 'off-event'
  };
  if ((event.type == 1) || (event.type == 2) || (event.type == 6)) {
    return {
      message: 'wrong event type'
    };
  }
  const loungeEvent = await princess.getLoungePoints(lounge.id, event.id);
  if (loungeEvent.length == 0) return {
    message: 'off-event'
  };
  const loungeRank = loungeEvent[loungeEvent.length - 1].rank;
  const rankIncrease = loungeRank - loungeEvent[loungeEvent.length - 2].rank;
  const loungeScore = parseInt(loungeEvent[loungeEvent.length - 1].score);
  const scoreIncrease = loungeScore - parseInt(loungeEvent[loungeEvent.length - 2].score);
  const updatedAt = moment(loungeEvent[loungeEvent.length - 1].summaryTime).fromNow();
  return {
    message: 'success',
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
  if (rank.message != 'success') {
    const attachment = new Discord.Attachment(getRandomImg());
    if (rank.message === 'off-event') {
      return message.channel.send(`${message.author}P-san... too early...`, attachment);
    }
    if (rank.message === 'wrong event type') {
      return message.channel.send(`${message.author}P-san, you can't use that command during this type of event.`, attachment);
    }
  }
  const now = moment();
  let footer = '';
  if (now < moment(rank.event.schedule.boostBeginDate)) {
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
    .addField('Rank', `${rank.loungeRank} (${rank.rankIncrease})`, true)
    .addField('Score', `${rank.loungeScore} (+${rank.scoreIncrease})`, true)
    .setFooter(footer);
  return message.channel.send(response);
}

module.exports.help = {
  name: 'rank'
}