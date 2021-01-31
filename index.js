const dotenv = require('dotenv');
const Discord = require('discord.js');
const { prefix } = require('./config.json');

dotenv.config();

const client = new Discord.Client();

const getAudioFile = id => {
  const formattedId = id.padStart(2, "0");
  return `assets/${formattedId}.mp3`;
}

client.once('ready', () => {
  console.log(`roggan-bot started at ${new Date().toISOString()}`);
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  

  if (command === 'taunt' && args.length) {
    const tauntId = args.shift().toLowerCase();
    const voiceChannel = message.member.voice.channel;
    try {
      const connection = await voiceChannel.join();
      const file = getAudioFile(tauntId);
      console.log(`Attempting to play file ${file}`);
      const dispatcher = connection.play(getAudioFile(tauntId));
      dispatcher.once('finish', () => voiceChannel.leave());
    } catch (e) {
      voiceChannel.leave();
      console.error(e);
    }
  }
});

client.login(process.env.TOKEN);
