if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const Discord = require('discord.js');
const anna = new Discord.Client();
const { forOwner } = require('./functions/owner');

anna.once('ready', () => {
  console.log('Anna is ready!');
});

anna.on('message', message => {
  forOwner(message);
})

anna.login(process.env.TOKEN);