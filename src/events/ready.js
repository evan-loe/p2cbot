const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("../config/config.json");

module.exports = {
  name: "ready",
  once: true,
  execute(client, commands) {
    console.log("Sze Yap bot is online");
    console.log(commands);

    const CLIENT_ID = client.user.id;

    const rest = new REST({
      version: "9",
    }).setToken(process.env.TOKEN);

    (async () => {
      try {
        // start the google calendar checks when the client is ready
        require("../utils/gcalReminders");

        if (process.env.DEV_STAGE === "production") {
          await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
          });
          console.log("Successfully registered commands globally.");
        } else {
          await rest.put(Routes.applicationGuildCommands(CLIENT_ID, String(config.guildId)), {
            body: commands,
          });
          console.log("Successfully registered commands locally.");
        }

      } catch (error) {
        if (error) console.error(error);
      }
    })();

    // adding permissions
  },
};
