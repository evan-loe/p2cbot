const { EventEmitter } = require("events");

const { Collection } = require("discord.js");
const fs = require('fs');
// const gc = require("../search/importDictionary");

class StateManager extends EventEmitter {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.reactionRoleMessages = require("../assets/reactionRoleMessages.json");
  }

  // update cache and save messages we want to listen to for reactions
  /*
   * messageReactable = {
   *    messageId: {
   *      reactionId: roleId,
   *    } 
   *  }
   */
  updateReactionRoleMessages(messageReactable) {
    Object.assign(this.reactionRoleMessages, messageReactable);
    fs.writeFile("./src/assets/reactionRoleMessage.json", this.reactionRoleMessages, (err) => {
      if (err) {
        console.log(err);
      }
    })
  }

}

module.exports = new StateManager();
