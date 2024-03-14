import { Client, Events } from "discord.js";
import { routeInteraction } from "./src/interaction-router";
import { token } from "./src/config";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent"],
});

client.once(Events.ClientReady, () => {
  console.log(`roggan-bot started at ${new Date().toISOString()}`);
});

client.on(Events.InteractionCreate, routeInteraction);

client.login(token);
