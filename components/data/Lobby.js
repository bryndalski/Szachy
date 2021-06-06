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
    let lobbyToReturn = this.lobby.map((element) => {
      return {
        roomId: element.roomId,
        roomName: element.roomName,
        availible: element.playerTwo === null ? true : false,
        private: element.private,
      };
    });
    return lobbyToReturn;
  }
}

module.exports = new Lobby();
