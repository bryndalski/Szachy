//TODO reame me

import LobbyScroll from "./LobbyScroll.js";
/**
 * @alias (BasicLobby)
 * @bryndalski
 * @description Class creaded for maintaing and handling
 * basic lobby
 * @event scrollUp
 * @event screllDown
 */
export default class BasicLobby {
  constructor() {
    this.oldScroll = null; // needed to comapare to old scroll
    this.scroll = new LobbyScroll(); // init scroll listener
  }
  /**
   * Initialize lobby and get all the elements at page
   */
  init() {
    this.scrollListen();
    this.responsive();
    this.scroll.initScrollBehav();
    this.scrollListen();
  }
  /**
   * Start listening for lobby resize
   */
  responsive() {
    window.addEventListener("resize", this.handelWindowResize);
  }
  /**
   * Handling lobby resize, menaging views and availible data with css
   */
  handelWindowResize = () => {
    console.log(window.innerWidth);
    if (window.innerWidth < 470) {
      this.smallScreen();
    } else {
      this.hugeScrean();
    }
  };
  /**
   * @override
   * Handles scroll up
   */
  scrollUp() {
    console.log("beee");
  }
  /**
   * @override
   * Handles scroll down
   */
  scrollDown() {}
  /**
   * @override
   * Dedicated for handling small screans lobby
   */
  smallScreen() {
    console.log("Small screen");
  }
  /**
   * @override
   * Dedicated for huge screans
   */
  hugeScrean() {
    console.log("Huge sscreeemn");
  }
  /**
   * Listen for scroll direction up / down
   */
  scrollListen() {
    window.addEventListener("scrollUp", this.scrollUp);
    window.addEventListener("scrollDown", this.scrollDown);
  }
  /**
   * Remove scroll listeners
   *
   */
  removeScrollListen() {
    window.removeEventListener("scrollUp", this.scrollUp);
    window.removeEventListener("scrollDown", this.scrollDown);
  }
  /**
   * Await script execution for some time
   * @async
   * @param {time} time time in ms
   * @returns {Promise} awaits script execution for some time
   */
  sleep(time) {
    return new Promise((suc) => setTimeout(suc(), time));
  }
}
