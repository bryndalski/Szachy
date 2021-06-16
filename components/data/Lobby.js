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
  changeInportantValue = (roomId, key, value) => {
    let indexNumber = this.lobby.findIndex(
      (element) => element.roomId === roomId
    );
    console.log(indexNumber);
    //checks if room with matching id exists
    if (indexNumber === null || indexNumber === undefined) return false;
    this.lobby[indexNumber][key] = value;
    this.emit("change");
  };
  /**
   * Adds new user to room
   *
   * @param {String} roomID room id
   * @param {String} playerName player to add
   * @param {[String|null]} password p
   * @returns
   */
  addPlayerToRoomLobby = (roomID, playerName, password) => {
    let indexNumber = this.lobby.findIndex(
      (element) => element.roomId == roomID
    );
    console.log(indexNumber.addToGame);
    console.log(this.lobby[indexNumber]);
    //checks if room with matching id exists
    if (indexNumber === null || indexNumber === undefined) return false;
    if (this.lobby[indexNumber].addToGame(playerName, password)) {
      console.log("No to raczej się udało");
      this.emit("change");
      return true;
    } else return false;
  };
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
