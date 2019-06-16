const Discord = require('discord.js');
const fetch = require('node-fetch');
const sharp = require('sharp');
const mongoose = require('mongoose');

const Score = require('../models/score');
const UpdatedAt = require('../models/cache/updatedat');
const CardList = require('../models/cache/cardlist');

const { getCardList } = require('../functions/princess');

const imgWidth = 640;
const imgHeight = 800;

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
    score: 3
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

async function sendQuiz(anna, message, card, mode) {
  const filter = answer => {
    return answers[card.idolId].includes(answer.content.split(' ')[0].toLowerCase());
  };
  const width = diffs[mode].width;
  const height = diffs[mode].height;
  const left = Math.floor(Math.random() * (imgWidth - width + 1));
  const top = Math.floor(Math.random() * (imgHeight - height + 1));
  const link = `https://storage.matsurihi.me/mltd/card/${card.resourceId}_${Math.floor(Math.random() * 2)}_b.png`;
  const img = await fetch(link).then(res => res.buffer());
  const croppedImg = await sharp(img)
    .extract({ left, top, width, height })
    .toBuffer();
  const attachment = new Discord.Attachment(croppedImg, 'img.png');
  await message.channel.send('**Whose card is this?**', attachment);
  message.channel
    .awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
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
                }!! Your point total is now ${addedUser.score}.\n${link}`
              );
            });
          } else {
            message.channel.send(
              `${collected.first().author.username}P-san is correct, you received ${diffs[mode].score} point${
                diffs[mode].score > 1 ? 's' : ''
              }!! Your point total is now ${foundUser.score}.\n${link}`
            );
          }
        }
      );
    })
    .catch(collected => {
      return message.channel.send(`Time's up!\n${link}`);
    });
}

module.exports.run = async (anna, message, args) => {
  const mode = args[0];
  if (!['easy', 'normal', 'hard'].includes(args[0])) {
    switch (args[0]) {
      case 'point':
        const id = message.author.id;
        Score.findOne({ user: id }, 'score', (err, foundScore) => {
          if (err) {
            return console.log(err);
          } else {
            if (!foundScore) return message.channel.send(`${message.author}P-san, you haven't play any games...`);
            return message.reply(`your point total is ${foundScore.score}.`);
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
          if (playerList === '') playerList = 'Noone has played yet...';
          const response = new Discord.RichEmbed().setAuthor('Leaderboard').setDescription(playerList);
          return message.channel.send(response);
        });
      default:
        return;
    }
    return;
  }
  const now = Date.now();
  UpdatedAt.findOne({ name: 'cardList' }, 'updatedAt', async (err, res) => {
    if (err) return console.log(err);
    if (!res) {
      const cardList = await getCardList();
      const randomCardKey = Math.floor(Math.random() * cardList.length);
      sendQuiz(anna, message, cardList[randomCardKey], mode);
      UpdatedAt.create({ name: 'cardList', updatedAt: now });
      return CardList.insertMany(cardList);
    } else {
      const card = await CardList.aggregate([{ $sample: { size: 1 } }]);
      if (now - 86400000 > res.updatedAt) {
        sendQuiz(anna, message, card[0], mode);
        const cardList = await getCardList();
        res.updatedAt = now;
        res.save();
        return CardList.insertMany(cardList);
      } else {
        return sendQuiz(anna, message, card[0], mode);
      }
    }
  });
};

module.exports.help = {
  name: 'game'
};
