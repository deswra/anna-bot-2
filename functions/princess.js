const fetch = require('node-fetch');

const types = require('../resources/types');
const { capitalizeFirstLetter } = require('../functions/helpers');

const isAnniSSR = (card) => {
  if (card.extraType === 5 || card.extraType === 7) {
    if (card.rarity === 4) return true;
  }
  return false;
};

const sortCardsByRarity = (cards) => {
  cards.sort((a, b) => {
    if (a.rarity === b.rarity) {
      return a.id - b.id;
    }
    return b.rarity - a.rarity;
  });
  return cards;
};

const getIdolTypeName = (idolType) => {
  if (idolType === 4) return 'all';
  return types[idolType].name;
};

const getRarityName = (rarity) => {
  switch (rarity) {
    case 1:
      return 'N';
    case 2:
      return 'R';
    case 3:
      return 'SR';
    case 4:
      return 'SSR';
  }
};

const getExtraTypeName = (extraType) => {
  switch (extraType) {
    case 0:
      return 'Normal';
    case 2:
      return 'Ranking';
    case 3:
      return 'Points';
    case 4:
      return 'FES';
    case 5:
      return '1st Anniversary';
    case 6:
      return 'Extra';
    case 7:
      return '2nd Anniversary';
    case 8:
      return 'Extra Ranking';
    case 9:
      return 'Extra Points';
    case 10:
      return '3rd Anniversary';
  }
};

const getCategoryName = (category) => {
  switch (category) {
    case 'normal':
      return 'Initial';
    case 'gasha0':
      return 'Permanent';
    case 'gasha1':
      return 'Limited';
    case 'gasha2':
      return 'FES';
    case 'event0':
      return 'MilliColle';
    case 'event1':
      return 'PSTheater';
    case 'event2':
      return 'PSTour';
    case 'event3':
      return 'Anniversary';
    case 'event4':
      return 'Voting event SR';
    case 'event5':
      return 'MilliColle';
    case 'other':
      return 'Other';
  }
};

const getCardTitleFromName = (name) => {
  const splitName = name.split('　'); // not a space character
  if (splitName.length === 1) return 'Initial';
  return splitName[0];
};

const getCostumeTitleFromName = (name) => {
  return name.substring(name.indexOf('[') + 1, name.indexOf(']'));
};

const getEvaluationType = (evaluation) => {
  switch (evaluation) {
    case 0:
      return 'all';
    case 1:
      return 'Perfect';
    case 2:
      return 'Perfect/Great';
    case 3:
      return 'Great';
    case 4:
      return 'Great/Good/Fast/Slow';
    case 5:
      return 'Perfect/Great/Good';
    case 6:
      return 'Perfect/Great/Good/Fast/Slow';
    case 7:
      return 'Great/Good';
  }
};

const getSkillDescription = (skill) => {
  switch (skill.effectId) {
    case 1:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${getEvaluationType(
        skill.evaluation
      )} note scores will increase by ${skill.value[0]}% for ${skill.duration} seconds.`;
    case 2:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that combo bonuses will increase by ${skill.value[0]}% for ${skill.duration} seconds.`;
    case 3:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${getEvaluationType(
        skill.evaluation
      )} notes will recover ${skill.value[0]} life for ${skill.duration} seconds.`;
    case 4:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that life does not decrease for ${skill.duration} seconds.`;
    case 5:
      return `Every ${skill.interval} seconds, there is a ${
        skill.probability
      }% chance that combos will continue through ${getEvaluationType(skill.evaluation)} notes for ${
        skill.duration
      } seconds.`;
    case 6:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${getEvaluationType(
        skill.evaluation
      )} notes will become Perfect notes for ${skill.duration} seconds.`;
    case 7:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${getEvaluationType(
        skill.evaluation
      )} note scores will increase by ${skill.value[0]}% and combo bonuses will increase by ${skill.value[1]}% for ${
        skill.duration
      } seconds`;
    case 8:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${getEvaluationType(
        skill.evaluation
      )} note scores will increase by ${skill.value[0]}% for ${skill.duration} seconds and ${
        skill.value[1]
      } life will be recovered for every ${getEvaluationType(skill.evaluation2)} note.`;
    case 10:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${
        skill.value[1]
      } life will be consumed so that ${getEvaluationType(skill.evaluation)} note scores increase by ${
        skill.value[0]
      }% for ${skill.duration} seconds`;
    case 11:
      return `Every ${skill.interval} seconds, there is a ${skill.probability}% chance that ${skill.value[1]} life will be consumed so that combo bonuses increase by ${skill.value[0]}% for ${skill.duration} seconds`;
  }
};

const getAttributeName = (attribute) => {
  switch (attribute) {
    case 1:
      return 'vocal appeal';
    case 2:
      return 'dance appeal';
    case 3:
      return 'visual appeal';
    case 4:
      return 'total appeal';
    case 5:
      return 'life';
    case 6:
      return 'skill activation rate';
  }
};

const getLeaderSkillDescription = (centerEffect) => {
  let description = '';
  if (centerEffect.specificIdolType) {
    if (centerEffect.specificIdolType === 4) {
      description += 'If your team has idols of all three attributes, ';
    } else {
      switch (centerEffect.specificIdolType) {
        case 1:
          description += 'If all your idols have Princess attribute, ';
          break;
        case 2:
          description += 'If all your idols have Fairy attribute, ';
          break;
        case 3:
          description += 'If all your idols have Angel attribute, ';
          break;
      }
    }
  }
  description += `${capitalizeFirstLetter(getIdolTypeName(centerEffect.idolType))} idols's ${getAttributeName(
    centerEffect.attribute
  )} increase by ${centerEffect.value}%.`;
  return description;
};

module.exports = {
  async searchLounge(name) {
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/search?name=${encodeURI(name)}`);
    const resData = await response.json();
    return resData;
  },
  async getLoungeData(loungeId) {
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  },
  async getLoungeHistory(loungeId) {
    const response = await fetch(`https://api.matsurihi.me/mltd/v1/lounges/${loungeId}/eventHistory?prettyPrint=false`);
    const resData = await response.json();
    return resData;
  },
  async getLoungePoints(loungeId, eventId) {
    const response = await fetch(
      `https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/logs/loungePoint/${loungeId}?prettyPrint=false`
    );
    const resData = await response.json();
    return resData;
  },
  async getCurrentEvent() {
    let now = new Date();
    now.setHours(now.getHours() + 9);
    return fetch(`https://api.matsurihi.me/mltd/v1/events?at=${now}?prettyPrint=false`)
      .then((res) => res.json())
      .then((res) => res[0]);
  },
  async getSummaryCounts(eventId, type) {
    return fetch(`https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/summaries/${type}?prettyPrint=false`)
      .then((res) => res.json())
      .then((res) => res[res.length - 1]);
  },
  async getBorders(eventId, type, tiers) {
    return fetch(
      `https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/logs/${type}/${tiers}?prettyPrint=false`
    ).then((res) => res.json());
  },
  async getCardList() {
    return fetch(
      'https://api.matsurihi.me/mltd/v1/cards?rarity=ssr,sr,r&extraType=none,pst,pstr,fes&prettyPrint=false'
    ).then((res) => res.json());
  },
  async getIdolPoint(eventId, idolId, tiers = `1,2,3,10,100,1000`) {
    return fetch(
      `https://api.matsurihi.me/mltd/v1/events/${eventId}/rankings/logs/idolPoint/${idolId}/${tiers}?prettyPrint=false`
    ).then((res) => res.json());
  },
  async getCardsById(id) {
    return fetch(`https://api.matsurihi.me/mltd/v1/cards?idolId=${id}&prettyPrint=false`)
      .then((res) => res.json())
      .then((res) => res.filter((card) => !isAnniSSR(card)));
  },
  sortCardsByRarity,
  getIdolTypeName,
  getRarityName,
  getExtraTypeName,
  getCardTitleFromName,
  getSkillDescription,
  getLeaderSkillDescription,
  getCostumeTitleFromName,
  getCategoryName,
};
