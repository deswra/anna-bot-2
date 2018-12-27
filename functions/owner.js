const Discord = require('discord.js');

module.exports = {
  forOwner(message) {
    if (message.author.id == process.env.ownerID) {
      if (message.content.includes('Mèo')) {
        return message.reply('yay');
      }
    }
  }
}