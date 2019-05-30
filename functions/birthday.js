const Discord = require('discord.js');
const moment = require('moment');

const fanart = require('../resources/fanart.json');

const birthdayStart = moment(1559228400000);
const birthdayEnd = moment(birthdayStart + moment.duration(24, 'hours'));

const keywords = [
  {
    words: ['hpbd'],
    value: 1
  },
  {
    words: ['birthday', 'birthdate', 'born', 'birthdays', 'bd', 'bday', 'bdate', 'bdays'],
    value: 0.9
  },
  {
    words: [
      'happy',
      'wish',
      'party',
      'celebrate',
      'celebration',
      'anniversary',
      'fun',
      'birth',
      'love',
      'lovely',
      'sweetest',
      'loveliest',
      'wishing',
      'wonderful',
      'wonders',
      'wonder',
      'best',
      'dear',
      'cute',
      'great',
      'enjoy',
      'unforgettable',
      'macaron',
      'macarons',
      'hp'
    ],
    value: 0.5
  },
  {
    words: [
      'age',
      'cake',
      'candle',
      'candy',
      'day',
      'friends',
      'friend',
      'gift',
      'gifts',
      'present',
      'presents',
      'invite',
      'invitation',
      'play',
      'receive',
      'received',
      'thank',
      'thanks',
      'sweet',
      'sweets',
      'year',
      'special',
      'happiness',
      'have',
      'amazing',
      'care',
      'most',
      'top',
      'idol',
      'joy',
      'joys',
      'joyful',
      'precious',
      'memories',
      'memory',
      'endless',
      'smiles',
      'smile',
      'light',
      'positive',
      'positivity',
      'exciting',
      'fortunate',
      'fantastic',
      'years',
      'grow',
      'grew',
      'growing',
      'treasure',
      'treasures',
      'memorable',
      'colorful',
      'extraordinary',
      'spoiled',
      'deserve',
      'time',
      'beautiful',
      'magical',
      'you',
      'older',
      'full'
    ],
    value: 0.25
  }
];

const responses = [
  'Thanks for making my birthday a memorable one, {1}.',
  'Thank you for all of the support, not only on my birthday, but throughout the year as well, {1}.',
  'Thanks {1}, my day wouldn’t be this vivid without you.',
  'You made my day extra vivid, {1}. Thank you for your kind words.',
  'Your birthday messages made my birthday all the more vivid. Thank you so much, {1}.',
  '{1}... I would mix it up and say something else but thank you is all that comes to mind.',
  'Thank you, thank you, and thank you. I’ll never get tired of saying this on my birthday, {1}.'
];

function getWordValue(word) {
  for (let i = 0; i < keywords.length; i++) {
    if (keywords[i].words.findIndex(w => w === word) !== -1) {
      return keywords[i].value;
    }
  }
  return 0;
}

module.exports = async (anna, message) => {
  if (message.mentions.users.get(anna.user.id)) {
    const now = moment();
    console.log(birthdayStart.fromNow());
    if (now.isBetween(birthdayStart, birthdayEnd, null, '[]')) {
      let parsedMessage = message.content.toLowerCase().replace(/[.,]/g, '');
      let birthdayValue = 0;
      parsedMessage.split(' ').forEach(word => {
        birthdayValue += getWordValue(word);
      });
      if (birthdayValue >= 1) {
        const response = responses[Math.floor(Math.random() * responses.length)].replace(
          '{1}',
          `${message.author}P-san`
        );
        const img = fanart[Math.floor(Math.random() * fanart.length)];
        return message.channel.send(response, {
          embed: {
            image: { url: img.url },
            author: {
              name: 'Source',
              url: img.source
            }
          }
        });
      }
    }
  }
};
