const Discord = require('discord.js');
const fetch = require('node-fetch');
const sharp = require('sharp');
const mongoose = require('mongoose');

const Score = require('../models/score');

const { getSsrList } = require('../functions/princess');

const imgWidth = 1280;
const imgHeight = 720;

const diffs = {
  easy: {
    width: 220,
    height: 220,
    score: 1
  },
  normal: {
    width: 150,
    height: 150,
    score: 2
  },
  hard: {
    width: 100,
    height: 100,
    score: 4
  }
};

const answers = {
  1: ['haruka', 'amami'],
  2: ['chihaya', 'kisaragi'],
  3: ['miki', 'hoshii'],
  4: ['yukiho', 'hagiwara'],
  5: ['yayoi', 'takatsuki'],
  6: ['makoto', 'kikuchi'],
  7: ['iori', 'minase'],
  8: ['takane', 'shijou'],
  9: ['ritsuko', 'akizuki'],
  10: ['azusa', 'miura'],
  11: ['ami'],
  12: ['mami'],
  13: ['hibiki', 'gahana'],
  14: ['mirai', 'kasuga'],
  15: ['shizuka', 'mogami'],
  16: ['tsubasa', 'ibuki'],
  17: ['kotoha', 'tanaka'],
  18: ['elena', 'shimabara'],
  19: ['minako', 'satake'],
  20: ['megumi', 'tokoro'],
  21: ['matsuri', 'tokugawa'],
  22: ['serika', 'hakozaki'],
  23: ['akane', 'nonohara'],
  24: ['anna', 'mochizuki'],
  25: ['roco'],
  26: ['yuriko', 'nanao'],
  27: ['sayoko', 'tokugawa'],
  28: ['arisa', 'matsuda'],
  29: ['umi', 'kousaka'],
  30: ['iku', 'nikutani'],
  31: ['tomoka', 'tenkubashi'],
  32: ['emily', 'stewart'],
  33: ['shiho', 'kitazawa'],
  34: ['ayumu', 'maihama'],
  35: ['hinata', 'kinoshita'],
  36: ['kana', 'yabuki'],
  37: ['nao', 'yokoyama'],
  38: ['chizuru', 'nikaido'],
  39: ['konomi', 'baba'],
  40: ['tamaki', 'ogami'],
  41: ['fuka', 'fuuka', 'toyokawa'],
  42: ['miya', 'miyao'],
  43: ['noriko', 'fukuda'],
  44: ['mizuki', 'makabe'],
  45: ['karen', 'shinomiya'],
  46: ['rio', 'momose'],
  47: ['subaru', 'nagayoshi'],
  48: ['reika', 'kitakami'],
  49: ['momoko', 'suou'],
  50: ['julia'],
  51: ['tsumugi', 'shiraishi'],
  52: ['kaori', 'sakuramori'],
  201: ['shika']
};

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

async function getRandomCardArt() {
  const ssrList = await getSsrList();
  const randomCardKey = Math.floor(Math.random() * ssrList.length);
  const randomArt = Math.floor(Math.random() * 2);
  return {
    idolId: ssrList[randomCardKey].idolId,
    link: `https://storage.matsurihi.me/mltd/card_bg/${ssrList[randomCardKey].resourceId}_${randomArt}.png`
  };
}

module.exports.run = async (anna, message, args) => {
  const mode = args[0];
  if (!['easy', 'normal', 'hard'].includes(args[0])) {
    switch (args[0]) {
      case 'point':
        const id = message.author.id;
        Score.findOne({ user: id }, 'score', (err, foundScore) => {
          if (err) {
            return message.reply("you haven't play any games...");
          } else {
            return message.reply(`your total points is ${foundScore.score}.`);
          }
        });
        break;
      case 'rank':
        Score.find({}, async (err, scores) => {
          let playerList = '';
          if (err) return console.log(err);
          scores.sort((a, b) => b.score - a.score);
          for (let i = 0; i < scores.length; i++) {
            const user = await message.guild.fetchMember(scores[i].user);
            playerList += `${scores[i].score} - ${user.displayName}P-san\n`;
          }
          if ((playerList = '')) playerList = 'Noone has played yet...';
          const response = new Discord.RichEmbed().setAuthor('Leaderboard').setDescription(playerList);
          return message.channel.send(response);
        });
      default:
        return;
    }
    return;
  }
  const width = diffs[mode].width;
  const height = diffs[mode].height;
  let left = Math.floor(Math.random() * imgWidth) - width;
  let top = Math.floor(Math.random() * imgHeight) - height;
  if (left < 0) left = 0;
  if (top < 0) top = 0;
  const cardArt = await getRandomCardArt();
  console.log(cardArt.idolId);
  const filter = answer => {
    return answers[cardArt.idolId].includes(answer.content.split(' ')[0].toLowerCase());
  };
  const img = await fetch(cardArt.link).then(res => res.buffer());
  const croppedImg = await sharp(img)
    .extract({
      left,
      top,
      width,
      height
    })
    .toBuffer();
  const attachment = new Discord.Attachment(croppedImg, 'img.png');
  await message.channel.send('**Whose SSR is this?**', attachment);
  message.channel
    .awaitMessages(filter, { maxMatches: 1, time: 10000, errors: ['time'] })
    .then(collected => {
      const userId = collected.first().author.id;
      Score.findOneAndUpdate(
        { user: userId },
        { $inc: { score: diffs[mode].score } },
        { new: true },
        (err, foundUser) => {
          if (!foundUser) {
            const newUser = new Score({ user: userId, score: diffs[mode].score });
            newUser.save((err, addedUser) => {
              message.channel.send(
                `${collected.first().author.username}P-san is correct, you received ${diffs[mode].score} point${
                  diffs[mode].score > 1 ? 's' : ''
                }!! Your total points is now ${addedUser.score}.`
              );
            });
          } else {
            message.channel.send(
              `${collected.first().author.username}P-san is correct, you received ${diffs[mode].score} point${
                diffs[mode].score > 1 ? 's' : ''
              }!! Your total points is now ${foundUser.score}.`
            );
          }
        }
      );
    })
    .catch(collected => {
      message.channel.send("Time's up!");
      const answerAttachment = new Discord.Attachment(cardArt.link, `${answers[cardArt.idolId][0]}.png`);
      message.channel.send(answerAttachment);
    });
};

module.exports.help = {
  name: 'game'
};
