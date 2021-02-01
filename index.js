const dotenv = require('dotenv');
const Discord = require('discord.js');
const { prefix } = require('./config.json');

const sendTaunt = require('./src/commands/sendTaunt.js');

dotenv.config();

const client = new Discord.Client();

client.once('ready', () => {
  console.log(`roggan-bot started at ${new Date().toISOString()}`);
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  if (!message.member.voice.channel) {
    message.channel.send('You\'re not in a voice channel for me to join');
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  switch (command) {
    case 'taunt':
      await sendTaunt(
        (args.shift() || '').toLowerCase(),
        message.member.voice.channel,
        message
      );
    default:
      return;
  }
});

client.login(process.env.TOKEN);
