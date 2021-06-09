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
  /**
   * Removes element with this ID
   *
   * @param {String} roomID
   */
  remove(roomID) {
    this.emit("change");
  }

  /**
   * Changes value in lobby such as availibility
   *
   * Uses to daa user to lobby
   * Emits event
   *
   * @param {String } roomId
   * @param {Object} Value
   * !!! czy potrzebne 
   */
  changeInportantValue(roomId, key, value) {
    let indexNumber = this.lobby.find((element) => element.roomId === roomId);
    console.log(indexNumber);
    //checks if room with matching id exists
    if (indexNumber === null || indexNumber === undefined) return false;
    this.lobby[indexNumber][key] = value;
    this.emit("change");
  }
  /**
   * Tryes to add new player to lobby
   */
  addPlayerToRoomLobby() {

  }
  /**
   * Returns lobby content
   */
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
