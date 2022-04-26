module.exports.textToSlash = (message) => {
  return {
    reply: (msg) => {
      return message.reply(msg.content ?? msg);
    },
    memberPermissions: message.member.permissions,
    guildId: message.guildId,
    user: message.author,
  };
};

module.exports.commandTypes = {
  TEXT: "TEXT_COMMAND",
  SLASH: "SLASH_COMMAND",
};
