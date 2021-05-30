//TODO reame me
"use strict";
/**
 * @bryndalski
 * @description Class creaded for maintaing and handling
 * view of smaller lobby with JOIN options.
 */
import HEADER from "./templates/HEADER_SELECT.js";
import BasicLobby from "./BasicLobby.js";
export default class LobbySelect extends BasicLobby {
  constructor() {
    super();
    this.lastScrollDirection = null; // last scroll direction
    this.init(); // method from BASCI LOBBY class
    this.screenType = null;
  }

  /**
   *  handle behaviour for small screens
   * @override
   * @method
   */
  smallScreen() {
    console.log("Mały ekranik");
    this.screenType = "small";
  }

  /**
   * Handling scrollUp
   * @override
   */
  scrollUp() {}
  /**
   * Collect all containers in page
   */
  collectPage() {
    this.header = document.querySelector("header");
    this.tableConstinaer = document.querySelector("table");
    this.infoPanel = document.querySelector(".lobbyDetail");
  }

  /**
   * Renders page using basic components
   */
  render() {
    document.body.innerHTML += HEADER;
  }
}
