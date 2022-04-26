const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const PaginationEmbed = require("../embeds/PaginationEmbed");
const data = require("../assets/help.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { textToSlash, commandTypes } = require("../utils/textToSlash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("A guide to using P2C Bot!")
    .setDefaultPermission(true),
  async execute({ type, args, message }) {
    const interaction =
      type === commandTypes.TEXT ? textToSlash(message) : message;

    function parseDescription(name, value) {
      return `\`${name}\`\n${value}`.replaceAll("{prefix}", "/");
    }

    function constructEmbeds() {
      let embedList = [];
      data.help.forEach((page) => {
        embedList.push(
          new MessageEmbed()
            .setTitle(page.title)
            .setDescription(parseDescription(page.name, page.value))
            .setColor([page.colour[0], page.colour[1], page.colour[2]])
        );
      });
      return embedList;
    }

    let paginate = new PaginationEmbed(constructEmbeds()).addFooters();

    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("prev")
        .setLabel("Previous")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle("PRIMARY"),
    ]);

    // send help embed
    const sentMsg = await interaction.reply({
      embeds: [paginate.render()],
      components: [row],
      fetchReply: true,
    });
    console.log(sentMsg);

    // wait for user interaction
    const collector = sentMsg.createMessageComponentCollector({
      componentType: 2, // Component type: button
      filter: (interaction) => {
        return ["prev", "next"].includes(String(interaction.customId));
      },
      time: 1800 * 1000,
    });
    collector.on("collect", (i) => {
      let page;
      if (i.customId == "next") {
        page = paginate.nextPage();
      } else if (i.customId == "prev") {
        page = paginate.prevPage();
      }
      i.update({ embeds: [page] });
    });
    collector.on("end", (collected) =>
      console.log(`Collected ${collected.size} items`)
    );
  },
  parse() {
    return [];
  },
};
