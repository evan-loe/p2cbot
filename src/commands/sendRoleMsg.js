const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { textToSlash, commandTypes } = require("../utils/textToSlash");
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("send_role_msg")
    .setDescription("Send role message in specific channel")
    .setDefaultPermission(false),
    async execute({ type, args, message }) {
        const interaction =
        type === commandTypes.TEXT ? textToSlash(message) : message;
        
        const data = require("../assets/reactionRoleMessages.json");
        const roles = data["reactionMessage"];
        

        const embed = new MessageEmbed()
            .setTitle("Roles!")
            .setDescription(`React to pick up a role!\n\n${Object.entries(roles).map(([emoji, roleId]) => {
                const role = message.guild.roles.cache.get(roleId);
                return `${emoji} - ${role}`
            }).join("\n")}`)
            .setColor([178, 245, 78]);

        const sentMsg = await interaction.channel.send({embeds: [embed], fetchReply: true});
        Object.entries(roles).forEach(([emoji]) => {
            sentMsg.react(emoji);
        })
        data[sentMsg.id] = roles;
        fs.writeFileSync("./src/assets/reactionRoleMessages.json", JSON.stringify(data));
        interaction.reply("OK done!");
    },
    parse() {
    return [];
  }
}