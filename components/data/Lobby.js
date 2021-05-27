const EventEmitter = require("events");

class Lobby extends EventEmitter {
  constructor() {
    super();
    this.lobby = [];
    this.xd = "XDD";
  }
  /**
   * Dodaje pokój do lobby
   *
   * @param {JSON} room json with room
   * @returns {Event} change
   */
  add(room) {
    this.lobby.push(room);
    this.emit("change");
  }
  remove(roomID) {}

  get lobbyContent() {
    return this.lobby;
  }
}

module.exports = new Lobby();
