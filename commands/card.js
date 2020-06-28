const Discord = require('discord.js');

const { getIdFromName } = require('../functions/helpers');
const princess = require('../functions/princess');
const chars = require('../resources/chars');
const types = require('../resources/types');

const createResponseFromCardName = async (cardName) => {
  const [idolName, cardNum] = cardName.split(/([0-9]*$)/);
  const idolId = getIdFromName(idolName);
  if (idolId) {
    let cards = await princess.getCardsById(idolId);
    cards = princess.sortCardsByRarity(cards);
    if (!cardNum) {
      return [createCardResponse(cards[0]), createCardListResponse(idolName, cards, 2)];
    } else {
      return createCardResponse(cards[cardNum - 1]);
    }
  } else {
    return createWrongNameResponse();
  }
};

const createCardListResponse = (idolName, cards, startIndex = 1) => {
  const color = types[cards[0].idolType].color;
  let description = '';
  for (let i = startIndex - 1; i < cards.length; i++) {
    let cardType = princess.getCategoryName(cards[i].category);
    if (cards[i].category === 'event1' || cards[i].category === 'event2') {
      cardType += ` ${princess.getExtraTypeName(cards[i].extraType)}`;
    }
    description += `\`${i + 1}\` [${princess.getRarityName(cards[i].rarity)}] ${princess.getCardTitleFromName(
      cards[i].name
    )} **${cardType}**\n`;
  }
  const response = new Discord.RichEmbed()
    .setColor(color)
    .setAuthor('More result(s)')
    .setDescription(description)
    .setFooter(`Get single card by ~card ${idolName}#`);
  return response;
};

const createCardResponse = (card) => {
  const color = types[card.idolType].color;
  const icon = types[card.idolType].icon;
  const title = princess.getCardTitleFromName(card.name);
  let cardType = princess.getCategoryName(card.category);
  if (card.category === 'event1' || card.category === 'event2') {
    cardType += ` ${princess.getExtraTypeName(card.extraType)}`;
  }
  const masterRankMax = card.masterRankMax;
  const response = new Discord.RichEmbed()
    .setColor(color)
    .setAuthor(`[${princess.getRarityName(card.rarity)}] ${title} ${chars[card.idolId].name}`, icon)
    .setThumbnail(`https://storage.matsurihi.me/mltd/icon_l/${card.resourceId}_0.png`)
    .addField(
      'Vo/Da/Vi (Total)',
      `${card.vocalMaxAwakened}/${card.danceMaxAwakened}/${card.visualMaxAwakened} (${
        card.vocalMaxAwakened + card.danceMaxAwakened + card.visualMaxAwakened
      })`,
      true
    )
    .addField(
      `MR${masterRankMax} Vo/Da/Vi (Total)`,
      `${card.vocalMaxAwakened + masterRankMax * card.vocalMasterBonus}/${
        card.danceMaxAwakened + masterRankMax * card.danceMasterBonus
      }/${card.visualMaxAwakened + masterRankMax * card.visualMasterBonus} (${
        card.vocalMaxAwakened +
        masterRankMax * card.vocalMasterBonus +
        card.danceMaxAwakened +
        masterRankMax * card.danceMasterBonus +
        card.visualMaxAwakened +
        masterRankMax * card.visualMasterBonus
      })`,
      true
    )
    .setFooter(`${cardType} (ID: ${card.id})`);
  if (card.skill) {
    response.addField(`Skill : ${card.skillName}`, princess.getSkillDescription(card.skill[0]));
  }
  if (card.centerEffect) {
    response.addField(`Leader skill`, princess.getLeaderSkillDescription(card.centerEffect));
  }
  return response;
};

const createWrongNameResponse = () => {
  return "I can't find your idol, did you type her name correctly?";
};

module.exports.run = async (anna, message, args) => {
  const cardName = args[0].toLowerCase();
  const responses = await createResponseFromCardName(cardName);
  if (Array.isArray(responses) && responses.length) {
    responses.forEach((res) => {
      message.channel.send(res);
    });
    return;
  } else {
    return message.channel.send(responses);
  }
};

module.exports.help = {
  name: 'card',
};
