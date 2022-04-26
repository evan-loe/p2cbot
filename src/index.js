const fs = require("fs");
const path = require("path");
const { Intents, Client } = require("discord.js");
const StateManager = require("./utils/StateManager");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

process.env.DEV_STAGE = "development";

if (dotenv.error) {
  console.log(dotenv);
}

client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});

const commands = [];

// retrieve commands in command folder
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set key to name of command and value as exported module of file
  commands.push(command.data.toJSON());
  StateManager.commands.set(command.data.name, command);
}

const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (!event.name) continue;
  console.log("Registering event: ", event.name);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    client.on(event.name, (...args) => event.execute(...args, commands));
  }
}

client.login(process.env.TOKEN);
module.exports = client;

