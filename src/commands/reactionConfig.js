const { SlashCommandBuilder } = require("@discordjs/builders");
const { textToSlash, commandTypes } = require("../utils/textToSlash");
const { MessageActionRow, Guild, MessageSelectMenu } = require("discord.js")

/**
 * 
 * @param {Guild} guild 
 */
async function createDropdown(guild) {
    const roleCollection = await guild.roles.fetch();
    const roles = Array.from(roleCollection).slice(0, 25);
    return new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId("roleSelection")
            .setPlaceholder("Select the role you want for this emoji")
            .setMaxValues(1)
            .setOptions(
                roles.map(([id, role]) => {
                    console.log(role.name);
                    return {
                        label: role.name,
                        value: id
                    }
                })
            )
    )
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reaction_config")
    .setDescription("Configure a role message")
    .setDefaultPermission(false),
    async execute({ type, args, message }) {
        const interaction =
        type === commandTypes.TEXT ? textToSlash(message) : message;

        const sentMsg = await interaction.reply({content: "React to this message to see the emoji id!", fetchReply: true});
        const filter = (reaction, user) => {console.log("Filtering"); return true;};
        const collector = sentMsg.createReactionCollector(filter, {time: 15000});
        
        collector.on('collect', async (r, user) => {
            console.log(`${r.emoji} has id ${r.emoji.id}`)
            const newMsg = await r.message.channel.send({
                content: `What role for ${r.emoji}?`,
                components: [
                    (await createDropdown(r.message.guild))
                ],
                fetchReply: true
            });
            const collector = newMsg.createMessageComponentCollector({
                componentType: "SELECT_MENU",
                filter: (interaction) => {
                    return interaction.customId == "roleSelection";
                },
                time: 1800 * 1000
            });
            collector.on("collect", (i) => {
                console.log(i.values[0]);
            })
            
        });
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    },
    parse() {
    return [];
  },
}