const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { textToSlash, commandTypes } = require("../utils/textToSlash");
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest an improvement to the server or anything really!")
    .setDefaultPermission(true),
    async execute({ type, args, message }) {
        const interaction =
        type === commandTypes.TEXT ? textToSlash(message) : message;
        
        await interaction.reply({content: "Suggestion recorded! Thanks for the feedback!", fetchReply: true});
        const data = require("../assets/suggestions.json");
        data.append({
            "suggestorId": type === commandTypes.TEXT ? message.author.id : message.user.id,
            "suggesterName": type === commandTypes.TEXT ? message.author.username : message.user.username,
            "body": args,
            "timestamp": Date.now()
        })
        fs.writeFileSync("./src/assets/suggestions.json", JSON.stringify(data));
        interaction.reply("OK done!");
    },
    parse(args) {
    return args;
  }
}