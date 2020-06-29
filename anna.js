if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const Discord = require('discord.js');
const anna = new Discord.Client();
const fs = require('fs');

const birthdayCelebrate = require('./functions/birthday');

anna.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter((f) => f.split('.').pop() == 'js');
  if (jsfile.length <= 0) {
    console.log("I didn't see any commands...");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    anna.commands.set(props.help.name, props);
  });
});

anna.once('ready', async () => {
  anna.user.setActivity(process.env.game, {
    type: process.env.activityType,
  });
  console.log('Anna is ready!');
});

// Game command cooldown
let lastPlay = 0;

anna.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;

  birthdayCelebrate(anna, message);

  let prefix = process.env.prefix;
  if (!message.content.startsWith(prefix, 0)) return;
  let messageArray = message.content.slice(prefix.length).split(' ');
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd === 'game') {
    if (['easy', 'normal', 'hard'].includes(args[0])) {
      const now = Date.now();
      if (now - 7000 < lastPlay) return;
      lastPlay = now;
    }
  }
  let commandFile = anna.commands.get(cmd) || anna.commands.find((cmdd) => cmdd.aliases && cmdd.aliases.includes(cmd));
  if (commandFile) commandFile.run(anna, message, args);
});

anna.login(process.env.TOKEN);
