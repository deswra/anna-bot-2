const moment = require('moment');

const charNames = {
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

function getIdFromName(name) {
  for (const [key, value] of Object.entries(charNames)) {
    if (value.includes(name)) return key;
  }
}

module.exports = {
  eventDuration(a, b) {
    let duration = moment.duration(a - b);
    let months = Math.floor(duration.asMonths());
    let days = duration.days();
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let response = '';
    if (months > 0) {
      response += `${months} month`;
      if (months > 1) {
        response += 's ';
      } else {
        response += ' ';
      }
    }
    if (days > 0) {
      response += `${days} day`;
      if (days > 1) {
        response += 's ';
      } else {
        response += ' ';
      }
    }
    if (months == 0) {
      if (hours > 0) {
        response += `${hours} hour`;
        if (hours > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    if (months == 0 && days == 0) {
      if (minutes > 0) {
        response += `${minutes} minute`;
        if (minutes > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    if (months == 0 && days == 0 && hours == 0) {
      if (seconds > 0) {
        response += `${seconds} second`;
        if (seconds > 1) {
          response += 's ';
        } else {
          response += ' ';
        }
      }
    }
    return response.slice(0, -1);
  },
  getIdFromName
};
