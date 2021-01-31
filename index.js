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
  console.log('ready!');
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
      connection.on('debug', console.log);
      const dispatcher = connection.play(getAudioFile(tauntId));
      dispatcher.once('end', () => voiceChannel.leave());
    } catch (e) {
      console.error(e);
    } finally {
      // voiceChannel.leave();
    }
  }
});

client.login(process.env.TOKEN);
