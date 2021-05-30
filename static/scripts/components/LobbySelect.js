//TODO reame me
"use strict";
import HEADER from "./templates/HEADER_SELECT.js";
import BasicLobby from "./BasicLobby.js";
import CONTAINERS from "./templates/CONTAINERS_SELECT.js";
import TABLESELECT from "./templates/TABLE_SELECT.js";
/**
 * @bryndalski
 * @description Class creaded for maintaing and handling
 * view of smaller lobby with JOIN options.
 */

export default class LobbySelect extends BasicLobby {
  constructor() {
    super();
    this.render(); // renders page
    this.lastScrollDirection = null; // last scroll direction
    this.init(); // method from BASCI LOBBY class
    this.screenType = null; //contains screen type
    this.collectPage(); // collects page element
    this.handelWindowResize(); // handles window resize after init
  }

  /**
   *  handle behaviour for small screens
   * @override
   * @method
   */
  async smallScreen() {
    try {
      console.log("Mały ekranik");
      this.screenType = "small";
      console.log(window.innerHeight - this.header.clientHeight);
      this.mainContainer.style.top = this.header.clientHeight + 10 + "px";
      this.mainContainer.style.width = this.header.clientWidth + "px";
      this.mainContainer.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    } catch (err) {
      await this.sleep(200);
      console.warn(err);
      // this.smallScreen();
    }
  }

  hugeScrean() {
    console.log("Duuuży ekranik");
    this.screenType = "huge";
  }

  /**
   * Handling scrollUp
   * @override
   */
  scrollUp() {}
  /**
   * Scrolling down
   * @override
   */
  scrollDown() {
    try {
      console.log(window.innerHeight - this.header.clientHeight);
      this.mainContainer.style.top = this.header.clientHeight + 10 + "px";
      this.mainContainer.style.width = this.header.clientWidth + "px";
      this.mainContainer.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    } catch (err) {
      await this.sleep(200);
      console.warn(err);
      // this.smallScreen();
    }
  }
  /**
   * Collect all containers in page
   */
  collectPage() {
    this.header = document.querySelector("header");
    this.mainContainer = document.querySelector(".lobby");
    this.tableConstinaer = document.querySelector(".lobbyList");
    this.table = document.querySelector("table");
    this.infoPanel = document.querySelector(".lobbyDetail");
  }

  /**
   * Renders page using basic components
   */
  render() {
    document.body.innerHTML += HEADER;
    document.body.innerHTML += CONTAINERS;
    document.querySelector(".lobbyList").innerHTML += TABLESELECT;
  }
  /**
   *
   * @param {Milliseconds} time time in ms
   * @returns {Promise} await time
   */
  sleep(time) {
    return new Promise((suc) => setTimeout(suc(), time));
  }
}
