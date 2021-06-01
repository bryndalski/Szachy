
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
    this.screenType = ""; //contains screen type
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
      this.table.style.top = this.header.clientHeight + 10 + "px";
      this.table.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    } catch (err) {
      await this.sleep(200);
      console.warn(err);
      // this.smallScreen();
    }
  }
  smallScreenZip() {}

  async hugeScrean() {
    this.screenType = "huge";
    try {
      console.log("Duuuży ekranik");
      this.screenType = "small";
      console.log(window.innerHeight - this.header.clientHeight);
      this.table.style.top = this.header.clientHeight + 10 + "px";
      this.table.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    } catch (err) {
      console.warn(err);
      await this.sleep(200);
    }
  }

  /**
   * Handling scrollUp
   * @override
   */
  scrollUp = async () => {
    if (this.screenType == "small") {
      //hides top scroll
      console.log(this);
      this.header.style.top = "5px";
      this.table.style.top = this.header.clientHeight + 10 + "px";
      this.table.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    }
  };
  /**
   *  Scrolling down
   *@override
   */
  scrollDown = async () => {
    if (this.screenType == "small") {
      this.header.style.top = -1 * this.header.clientHeight + "px";
      this.table.style.top = 5 + "px";
      this.table.style.height = window.innerHeight + "px";
    }
  };
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
    document.body.innerHTML += TABLESELECT;
  }
}
