const StateManager = require("../utils/StateManager");
const { commandTypes } = require("../utils/textToSlash");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = StateManager.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply({
        content:
          "Sorry, that is not a valid command. You can find a list of commands by using `/help`",
        ephemeral: true,
      });
    }

    try {
      await command.execute({
        type: commandTypes.SLASH,
        message: interaction,
        args: [],
      });
    } catch (error) {
      if (error) console.error(error);
      try {
        await interaction.channel.send({
          content: "An error occurred while executing that command."
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
};
