// const lobbyMenager = {};

import LobbySelect from "./components/LobbySelect.js";

class ClientLobby {
  constructor() {
    this.init();
  }
  async init() {
    try {
      this.user = await this.getUser();
      if (this.user.lobbyID === null) {
        new LobbySelect(this.user);
      }
    } catch (err) {}
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
