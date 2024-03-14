import { REST, Routes } from "discord.js";
import { clientID, token } from "./config";
import { data as tauntCommandData } from "./commands/taunt";

const commands = [tauntCommandData.toJSON()];

const rest = new REST({ version: "10" }).setToken(token ?? "");

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(Routes.applicationCommands(clientID ?? ""), {
      body: commands,
    })) as unknown[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
