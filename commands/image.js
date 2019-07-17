const Discord = require('discord.js');

const { getIdFromName } = require('../functions/helpers');
const princess = require('../functions/princess');
const chars = require('../resources/chars');
const types = require('../resources/types');

const createResponseFromCardName = async (cardName, awakend, outfit, alt) => {
  const [idolName, cardNum] = cardName.split(/([0-9]*$)/);
  const idolId = getIdFromName(idolName);
  if (idolId) {
    let cards = await princess.getCardsById(idolId);
    cards = princess.sortCardsByRarity(cards);
    if (!cardNum) {
      return [createCardResponse(cards[0]), createCardListResponse(idolName, cards, 2)];
    } else {
      return createCardResponse(cards[cardNum - 1], awakend, outfit, alt);
    }
  } else {
    return createErrorResponse('WRONG_NAME');
  }
};

const createCardListResponse = (idolName, cards, startIndex = 1) => {
  const color = types[cards[0].idolType].color;
  let description = '';
  for (let i = startIndex - 1; i < cards.length; i++) {
    description += `\`${i + 1}\` [${princess.getRarityName(cards[i].rarity)}] ${princess.getCardTitleFromName(
      cards[i].name
    )} **${princess.getExtraTypeName(cards[i].extraType)}**\n`;
  }
  const response = new Discord.RichEmbed()
    .setColor(color)
    .setAuthor('More result(s)')
    .setDescription(description)
    .setFooter(`Get single card by ~image ${idolName}#`);
  return response;
};

const createCardResponse = (card, awakend, outfit, alt) => {
  const color = types[card.idolType].color;
  const icon = types[card.idolType].icon;
  const title = princess.getCardTitleFromName(card.name);
  const awakendImg = awakend && card.rarity !== 1 ? 1 : 0;
  let imageUrl;
  if (outfit) {
    if (!card.costume) {
      return createErrorResponse('NO_OUTFIT');
    }
    if (alt) {
      if (!card.bonusCostume) {
        return createErrorResponse('NO_ALT_OUTFIT');
      }
      imageUrl = `https://storage.matsurihi.me/mltd/costume_icon_ll/${card.bonusCostume.resourceId}.png`;
    } else {
      imageUrl = `https://storage.matsurihi.me/mltd/costume_icon_ll/${card.costume.resourceId}.png`;
    }
  } else
    imageUrl =
      card.rarity === 4
        ? `https://storage.matsurihi.me/mltd/card_bg/${card.resourceId}_${awakendImg}.png`
        : `https://storage.matsurihi.me/mltd/card/${card.resourceId}_${awakendImg}_b.png`;
  const response = new Discord.RichEmbed()
    .setColor(color)
    .setAuthor(`[${princess.getRarityName(card.rarity)}] ${title} ${chars[card.idolId].name}`, icon)
    .setImage(imageUrl)
    .setFooter(`ID: ${card.id}`);
  return response;
};

const createErrorResponse = error => {
  switch (error) {
    case 'WRONG_NAME':
      return "I can't find your idol, did you type her name correctly?";
    case 'NO_OUTFIT':
      return "This card doesn't have an outfit.";
    case 'NO_ALT_OUTFIT':
      return "This card doesn't have an alt outfit.";
  }
};

module.exports.run = async (anna, message, args) => {
  const cardName = args[0].toLowerCase();
  let outfit, awakend, alt;
  if (args[1] === 'awakened') {
    awakend = true;
  } else {
    awakend = false;
  }
  if (args[1] === 'outfit') {
    outfit = true;
  } else {
    outfit = false;
  }
  if (args[2] === 'alt') {
    alt = true;
  } else {
    alt = false;
  }
  const responses = await createResponseFromCardName(cardName, awakend, outfit, alt);
  if (Array.isArray(responses) && responses.length) {
    responses.forEach(res => {
      message.channel.send(res);
    });
    return;
  } else {
    return message.channel.send(responses);
  }
};

module.exports.help = {
  name: 'image'
};
