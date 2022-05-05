const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const PaginationEmbed = require("../embeds/PaginationEmbed");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { textToSlash, commandTypes } = require("../utils/textToSlash");
const fetch = require("node-fetch");
const { parse } = require("node-html-parser");
const { htmlToText } = require("html-to-text");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bible")
    .setDescription("Searches the Bible")
    .setDefaultPermission(true)
    .addStringOption((option) => 
      option.setName("phrase").setDescription("Search the Bible by keyword, chapter, or verse").setRequired(true)
    ),
  async execute({ type, args, message }) {
    const interaction = type == commandTypes.TEXT ? textToSlash(message) : message;
    const phrase =
      type == commandTypes.TEXT
        ? args[0]
        : interaction.options.getString("phrase");
  
    if (!phrase || !phrase.trim()) {
      interaction.reply({ content: "Please provide a phrase or word to search!", emphemeral: true});
      return;
    }

    function parseDescription(name, value) {
      return `\`${name}\`\n${value}`.replaceAll("{prefix}", "/");
    }

    async function searchAPI(phrase) {
        const req_url = `https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/search?query=${phrase}`
        const response = await fetch(req_url, {
            headers: {
                'api-key': require("../config/credentials.json").bibleApiKey,
            }
        });
        return (await response.json()).data;
    }

    async function renderEmbedList(response) {
      console.log(response);
      if (response.hasOwnProperty("passages")) {
        const embedList = [];
        response.passages.forEach((passage) => {
          let text = parse(passage.content);
          embedList.push(new MessageEmbed()
            .setTitle(`Search results for ${phrase}`)
            .setDescription(htmlToText(text)));
        });
        return new PaginationEmbed(embedList).addFooters();
      } else {
        const embedList = [];
        response.verses.forEach((verse) => {
          embedList.push(
            new MessageEmbed()
              .setTitle(`Search results for ${phrase}`)
              .setDescription(`${verse.text}\n${verse.reference}`)
          );
        });
        return new PaginationEmbed(embedList).addFooters();
      }
    }


    const paginate = await renderEmbedList(await searchAPI(phrase));
    await searchAPI(phrase);
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

    const sentMsg = await interaction.reply({
      embeds: [paginate.render()],
      components: [row],
      fetchReply: true,
    });

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
  parse(commandString) {
    return [commandString.trim()];
  },
};
