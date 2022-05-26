const { MessageReaction, User } = require("discord.js");
const StateManager = require("../utils/StateManager");
const { reactionRoleMessages } = require("../utils/StateManager");


module.exports = {
    name: "messageReactionRemove",
    /**
     * 
     * @param {MessageReaction} reaction 
     * @param {User} user 
     */
    async execute (reaction, user) {
        console.log(`Reaction was added: ${reaction.emoji.name}`);
        if (reaction.message.partial) await reaction.message.fetch();
        const { id } = reaction.message;
        if (!(id in reactionRoleMessages)) return;

        const reactionMapping = reactionRoleMessages[id];
        if (!(reaction.emoji.id ?? reaction.emoji in reactionMapping)) return;
        
        const roleId = reactionMapping[reaction.emoji.id ?? reaction.emoji];
        const member = reaction.message.guild.members.cache.get(user.id);
        const role = reaction.message.guild.roles.cache.get(roleId);
        
        if (role && member) {
            member.roles.remove(role);
            console.log(`Removed role ${role.name} for ${member.displayName}`);
        }
    }
}