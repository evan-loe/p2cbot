const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { textToSlash, commandTypes } = require("../utils/textToSlash");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("send_role_msg")
    .setDescription("Send role message in specific channel")
    .setDefaultPermission(false),
    async execute({ type, args, message }) {
        const interaction =
        type === commandTypes.TEXT ? textToSlash(message) : message;

        const roles = require("../assets/reactionRoleMessages.json")[message.guild.id];

        const embed = new MessageEmbed()
            .setTitle("Roles!")
            .setDescription(`React to pick up a role!\n${roles.entries().map((emoji, role) => {
                `${emoji} ${role}\n`
            })}`);

        const sentMsg = await interaction.reply({embed: embed, fetchReply: true});
        roles.entries().forEach(() => {
            sentMsg.react(emoji);
        })
        // const filter = (reaction, user) => {console.log("Filtering"); return true;};
        // const collector = sentMsg.createReactionCollector(filter, {time: 15000});
        // collector.on('collect', (r, user) => {
        //   console.log(`${r.emoji} has id ${r.emoji.id}`)});
        // collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    },
    parse() {
    return [];
  },
}