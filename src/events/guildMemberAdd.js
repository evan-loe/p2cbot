
const welcomeChannelId = '968336471356481589';

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    try {
      const roleChannel = await member.guild.channels.fetch("969998822803644456");
      const ruleChannel = await member.guild.channels.fetch("968339905543569438");
      const channel = await member.guild.channels.fetch(welcomeChannelId)
      channel.send(`Welcome to the summer P2C server ${member}!\nPlease check out ${ruleChannel} and pick up some roles in ${roleChannel}!`);

    } catch (err) {
      console.log(err);
    }
  },
};
