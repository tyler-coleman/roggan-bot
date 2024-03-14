import { Interaction, Message } from "discord.js";
import { execute as executeTauntCommand } from "./commands/taunt";

export const routeInteraction = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    console.log(
      "Non-command interactions not currently supported, received: ",
      interaction
    );
    return;
  }

  switch (interaction.commandName) {
    case "taunt":
      executeTauntCommand(interaction);
    default:
      return;
  }
};
