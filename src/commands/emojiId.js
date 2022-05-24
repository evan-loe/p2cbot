const { SlashCommandBuilder } = require("@discordjs/builders");
const { textToSlash, commandTypes } = require("../utils/textToSlash");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("emoji_id")
    .setDescription("Get the id of an emoji")
    .setDefaultPermission(false),
    async execute({ type, args, message }) {
        const interaction =
        type === commandTypes.TEXT ? textToSlash(message) : message;

        const sentMsg = await interaction.reply({content: "React to this message to see the emoji id!", fetchReply: true});
        const filter = (reaction, user) => {console.log("Filtering"); return true;};
        const collector = sentMsg.createReactionCollector(filter, {time: 15000});
        collector.on('collect', (r, user) => {
          console.log(`${r.emoji} has id ${r.emoji.id}`)});
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    },
    parse() {
    return [];
  },
}