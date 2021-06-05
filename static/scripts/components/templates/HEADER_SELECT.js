"use strict";

import CreateLobbyAlert from "./CreateLobbyAlert.js";

//TODO change to function
class HEADER extends CreateLobbyAlert {
  constructor(user) {
    super();
    this.user = user;
    this.nickname = user.nickname;
  }
  /**
   * Starts listening on header button
   * @requires ! Being Colled after .render()
   */
  listen() {
    this.headerCreateRoomButton = document.querySelector("header button");
    this.headerCreateRoomButton.addEventListener("click", this.clickListen);
  }

  /**
   *  Creates header
   * @returns {HTML} new header
   */
  render() {
    return `
    <header class="createHeader">
          <button>Create Room</button>
          <div class="userContainer">
            <span>${[this.nickname]}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              class="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          </div>
    </header>
`;
  }
}

export default HEADER;
