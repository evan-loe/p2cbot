const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const PaginationEmbed = require("../embeds/PaginationEmbed");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { textToSlash, commandTypes } = require("../utils/textToSlash");
const fetch = require("node-fetch")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bible")
    .setDescription("Searches the Bible")
    .setDefaultPermission(true),
  async execute({ type, args, message }) {
    const interaction =
      type === commandTypes.TEXT ? textToSlash(message) : message;

    function parseDescription(name, value) {
      return `\`${name}\`\n${value}`.replaceAll("{prefix}", "/");
    }

    async function searchAPI(phrase) {
        const req_url = `https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/search?query=${phrase}`
        const response = await fetch(req_url, {
            headers: {
                'api-key': require("../config/credentials.json").bibleApiKey,
            }
        })
        console.log(response);
    }
    searchAPI("Jesus");

    // function constructEmbeds() {
    //   let embedList = [];
    //   data.help.forEach((page) => {
    //     embedList.push(
    //       new MessageEmbed()
    //         .setTitle(page.title)
    //         .setDescription(parseDescription(page.name, page.value))
    //         .setColor([page.colour[0], page.colour[1], page.colour[2]])
    //     );
    //   });
    //   return embedList;
    // }

    // let paginate = new PaginationEmbed(constructEmbeds()).addFooters();

    // const row = new MessageActionRow().addComponents([
    //   new MessageButton()
    //     .setCustomId("prev")
    //     .setLabel("Previous")
    //     .setStyle("PRIMARY"),
    //   new MessageButton()
    //     .setCustomId("next")
    //     .setLabel("Next")
    //     .setStyle("PRIMARY"),
    // ]);

    // // send help embed
    // const sentMsg = await interaction.reply({
    //   embeds: [paginate.render()],
    //   components: [row],
    //   fetchReply: true,
    // });
    // console.log(sentMsg);

    // // wait for user interaction
    // const collector = sentMsg.createMessageComponentCollector({
    //   componentType: 2, // Component type: button
    //   filter: (interaction) => {
    //     return ["prev", "next"].includes(String(interaction.customId));
    //   },
    //   time: 1800 * 1000,
    // });
    // collector.on("collect", (i) => {
    //   let page;
    //   if (i.customId == "next") {
    //     page = paginate.nextPage();
    //   } else if (i.customId == "prev") {
    //     page = paginate.prevPage();
    //   }
    //   i.update({ embeds: [page] });
    // });
    // collector.on("end", (collected) =>
    //   console.log(`Collected ${collected.size} items`)
    // );
  },
  parse() {
    return [];
  },
};
