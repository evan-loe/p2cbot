const { escapeRegExp } = require("../utils/misc");
const StateManager = require("../utils/StateManager");
const { commandTypes } = require("../utils/textToSlash");
module.exports = {
  name: "messageCreate",
  execute(message) {
    const prefix = ">";
    if (!message.content.startsWith(prefix) || message.author.bot) {
      return;
    }
    const commands = StateManager.commands;
    for (const command of commands.entries()) {
      let textCommand = escapeRegExp(message.content);
      textCommand = textCommand.match(
        new RegExp(`${escapeRegExp(prefix)}[a-zA-Z1-9\\-]+\\b`)
      );
      if (textCommand === null) return;
      if (prefix + command[0] === textCommand[0]) {
        const argString = message.content.replace(
          new RegExp(`${escapeRegExp(prefix)}[a-zA-Z1-9\\-]+\\b`),
          ""
        );
        const args = command[1].parse(argString);
        console.log(args);
        command[1].execute({
          type: commandTypes.TEXT,
          args: args,
          message: message,
        });
      }
    }
  },
};
