const { EventEmitter } = require("events");

const { Collection } = require("discord.js");
// const gc = require("../search/importDictionary");

class StateManager extends EventEmitter {
  constructor(options) {
    super(options);
    this.commands = new Collection();
  }
}

// async function createStateManager() {
//   const state = new StateManager();
//   await state.initialize();
//   console.log(state);
//   return state;
// }

module.exports = new StateManager();
