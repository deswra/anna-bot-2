const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

const tier = [100, 2500, 5000, 10000, 25000, 50000, 100000];

async function getCurrentEvent() {
  const response = await fetch('https://api.matsurihi.me/mltd/v1/events?prettyPrint=false');
  const events = await response.json();
  return events[events.length - 1];
}

async function getBorder() {
  let response = {};
  getCurrentEvent().then(currEvt => {
    response.eventName = currEvt.name;
    response.timeLeft = moment(currEvt.schedule.endDate).fromNow(true);
    let count = 0;
    fetch(`https://api.matsurihi.me/mltd/v1/events/${currEvt.id}/rankings/summaries/eventPoint?prettyPrint=false`)
      .then(res => res.json())
      .then(res => {
        const playersNum = parseInt(res[res.length - 1].count);
        response.updatedAt = moment(res[res.length - 1].summaryTime).fromNow();
        fetch(`https://api.matsurihi.me/mltd/v1/events/${currEvt.id}/rankings/logs/eventPoint/100,2500,5000,10000,25000,50000,100000?prettyPrint=false`)
          .then(res => res.json())
          .then(res => {
            let borders = [];
            while (playersNum >= tier[count]) {
              borders.push(res[count].data[res[count].data.length - 1].score);
              count++;
            }
            response.borders = borders;
            return response;
          })
      })
  })
}

module.exports.run = async (anna, message, args) => {
  let response = {};
  getCurrentEvent().then(currEvt => {
    response.eventName = currEvt.name;
    response.timeLeft = moment(currEvt.schedule.endDate).fromNow(true);
    let count = 0;
    fetch(`https://api.matsurihi.me/mltd/v1/events/${currEvt.id}/rankings/summaries/eventPoint?prettyPrint=false`)
      .then(res => res.json())
      .then(res => {
        const playersNum = parseInt(res[res.length - 1].count);
        response.updatedAt = moment(res[res.length - 1].summaryTime).fromNow();
        fetch(`https://api.matsurihi.me/mltd/v1/events/${currEvt.id}/rankings/logs/eventPoint/100,2500,5000,10000,25000,50000,100000?prettyPrint=false`)
          .then(res => res.json())
          .then(res => {
            const embed = new Discord.RichEmbed()
              .setColor('#7e6ca8')
              .setAuthor(response.eventName, 'https://i.imgur.com/sPOlPsI.png')
              .setFooter(`${response.timeLeft} till the event ends.`);
            while (playersNum >= tier[count]) {
              embed.addField(`T${tier[count]}`, `${res[count].data[res[count].data.length - 1].score} (+${res[count].data[res[count].data.length - 1].score-res[count].data[res[count].data.length - 2].score})`, true);
              count++;
            }
            embed.addField('Last updated', response.updatedAt, false);
            return message.channel.send(embed);
          })
      })
  })
}

module.exports.help = {
  name: 'rank'
}