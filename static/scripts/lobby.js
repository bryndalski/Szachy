// const lobbyMenager = {};

import LobbySelect from "./components/LobbySelect.js";

class ClientLobby {
  constructor() {
    this.socket = new WebSocket("ws://localhost:5500/sockets/lobbyWS");
    this.init();
  }
  async init() {
    try {
      this.user = await this.getUser();
      console.log(this.user);
      if (this.user.lobbyID === null) {
        new LobbySelect(this.user);
      }
    } catch (err) {}
  }
  /**
   * Connects sockets
   */
  connectScokets() {
    this.socket.addEventListener("open", function (event) {
      this.socket.send("my new lobby");
    });
  }
  /**
   * Listens to socket message
   */
  listenSockets() {
    this.socket.addEventListener("message", function (event) {
      console.log("Message from server ", event.data);
    });
  }
  /**
   * Get user data from server
   * @async
   * @returns {(Promise<JSON>|Error)} returns user or error
   */
  getUser() {
    return new Promise(async (suc, err) => {
      fetch("/userInfo")
        .then((response) => response.json())
        .then((data) => suc(data))
        .catch((error) => {
          console.warn("Error:", error); //TODO zakomentuj
          err(error);
        });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new ClientLobby());
