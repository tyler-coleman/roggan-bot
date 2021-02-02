const TauntMessageEnum = require('../constants/taunt-message-enum.js');

const getAudioFilePath = id => {
  if (id && id > 0 && id <= 42) {
    const formattedId = id.toString().padStart(2, "0");
    return `assets/${formattedId}.mp3`;
  }
  return null;
};

const sendTaunt = async (tauntId, voiceChannel, message) => {
  if (!voiceChannel) {
    message.channel.send('You\'re not in a voice channel for me to join');
    return;
  }
  
  const parsedId = parseInt(tauntId, 10);

  if (parsedId > 42 && parsedId <= 105) {
    message.channel.send('I don\'t have any audio files from the Definitive Edition yet');
    return;
  }

  const file = getAudioFilePath(parsedId);

  if (!file) {
    message.channel.send(`${tauntId === ''
      ? 'No taunt specified'
      : `${tauntId} isn't a valid taunt`} - try a number between 0-42`);
    console.log(`Attempted to taunt with invalid argument ${tauntId}`);
    return;
  }

  try {
    const connection = await voiceChannel.join();
    console.log(`Attempting to play file ${file}`);
    message.channel.send(TauntMessageEnum[parsedId]);
    const dispatcher = connection.play(getAudioFilePath(tauntId));
    dispatcher.once('finish', () => setTimeout(() => voiceChannel.leave(), 500));
  } catch (e) {
    message.channel.send('Something isn\'t working...');
    voiceChannel.leave();
    console.error(e);
  }
};

module.exports = sendTaunt;
