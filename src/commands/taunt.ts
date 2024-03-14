import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextBasedChannel,
  VoiceBasedChannel,
} from "discord.js";
import {
  MAXIMUM_TAUNT_ID,
  MAXIMUM_TAUNT_ID_DEFINITIVE_EDITION,
  MINIMUM_TAUNT_ID,
  TauntIDToMessageMap,
} from "../constants/taunts";
import { getAudioFilePath } from "../utils/getAudioFilePath";
import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";

export const data = new SlashCommandBuilder()
  .setName("taunt")
  .setDescription(
    "Joins the user's voice channel and plays a specified AoE2 taunt"
  )
  .addNumberOption((option) =>
    option
      .setName("tauntid")
      .setDescription("The AoE2 taunt ID to play")
      .setRequired(true)
      .setMinValue(MINIMUM_TAUNT_ID)
      .setMaxValue(MAXIMUM_TAUNT_ID)
  )
  .addBooleanOption((option) =>
    option
      .setName("ephemeral")
      .setDescription(
        "Whether the taunt should be printed to the command's channel for everyone to see"
      )
  );

const audioPlayer = createAudioPlayer({
  behaviors: { noSubscriber: NoSubscriberBehavior.Stop },
});

const attachAudioResource = (audioFilePath: string) => {
  const resource = createAudioResource(audioFilePath, {
    inputType: StreamType.Raw,
  });
  audioPlayer.play(resource);
};

const connectToVoiceChannel = async (channel: VoiceBasedChannel) => {
  const connection = joinVoiceChannel({
    adapterCreator: channel.guild.voiceAdapterCreator,
    channelId: channel.id,
    guildId: channel.guildId,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 10 * 1000);
    return connection;
  } catch (e) {
    connection.destroy();
    throw e;
  }
};

const joinVoiceChannelAndPlayTaunt = async (
  voiceChannel: VoiceBasedChannel,
  tauntID: number
) => {
  try {
    const filePath = getAudioFilePath(tauntID);
    if (!filePath) throw new Error("No file path for given tauntID");

    const connection = await connectToVoiceChannel(voiceChannel);

    attachAudioResource(filePath);
    const subscription = connection.subscribe(audioPlayer);

    audioPlayer.on(AudioPlayerStatus.Idle, (asdf) => {
      console.log("idle, stopping, ", asdf);
      audioPlayer.stop();
      console.log("unsubscribing");
      subscription?.unsubscribe();
      connection.disconnect();
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const tauntID = interaction.options.getNumber("tauntid");
  const ephemeral = interaction.options.getBoolean("ephemeral");

  const guild = interaction.client.guilds.cache.get(interaction.guildId ?? "");
  const member = guild?.members.cache.get(interaction.member?.user.id ?? "");
  const voiceChannel = member?.voice.channel;
  if (!voiceChannel) {
    interaction.reply("You're not in a voice channel for me to join");
    return;
  }
  const messageChannel = interaction.channel;
  if (!messageChannel) {
    interaction.reply("Something isn't working...");
    console.error(
      "How did this interaction not have a message channel? ",
      interaction
    );
    return;
  }

  if (!tauntID) {
    interaction.reply("No taunt specified");
    return;
  }
  if (
    tauntID > MAXIMUM_TAUNT_ID &&
    tauntID <= MAXIMUM_TAUNT_ID_DEFINITIVE_EDITION
  ) {
    interaction.reply(
      "I don't have any audio files from the Definitive Edition yet"
    );
    return;
  }
  if (tauntID < MINIMUM_TAUNT_ID || tauntID > MAXIMUM_TAUNT_ID) {
    interaction.reply(
      `${tauntID} isn't a valid taunt - try a number between ${MINIMUM_TAUNT_ID}-${MAXIMUM_TAUNT_ID}`
    );
    console.log(`Attempted to taunt with invalid argument ${tauntID}`);
    return;
  }
  try {
    await joinVoiceChannelAndPlayTaunt(voiceChannel, tauntID);
    interaction.reply(TauntIDToMessageMap[tauntID]);
  } catch (e) {
    interaction.reply("Something isn't working...");
    console.error(e);
  }
};
