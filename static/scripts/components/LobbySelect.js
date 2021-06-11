"use strict";
import HEADER from "./templates/HeaderSelect.js";
import BasicLobby from "./BasicLobby.js";
import TableSelect from "./templates/TableSelect.js";
import RightSideContainer from "./templates/RightSide.js";
/**
 * @bryndalski
 * @description Class creaded for maintaing and handling
 * view of smaller lobby with JOIN options.
 */
//TODO zmień przed hostowaniem adres websocketa

export default class LobbySelect extends BasicLobby {
  constructor(user) {
    super();
    this.header = new HEADER(user);
    this.rightContainer = new RightSideContainer();
    this.user = user; //user from params
    this.render(); // renders page
    this.header.listen();
    this.socket = new WebSocket(
      `wss://${window.location.hostname}:${window.location.port}/sockets/lobbyWS`
    ); // init websocket
    this.lastScrollDirection = null; // last scroll direction
    this.init(); // method from BASCI LOBBY class
    this.screenType = ""; //contains screen type
    this.collectPage(); // collects page element
    this.handelWindowResize(); // handles window resize after init
    this.connectScokets(); // connect sockets => makes handshake
    this.listenSockets(); //start listening to socket
    this.lobbyList = []; // containes list of lobby and connected with them div
    this.closeListen(); // executes on code reload
  }

  /**
   *  handle behaviour for small screens
   * @override
   * @method
   */
  async smallScreen() {
    try {
      this.screenType = "small";
      this.table.style.top = this.header.clientHeight + 10 + "px";
      this.table.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
      this.rightSidePanel.style.top = this.header.clientHeight + 10 + "px";
      this.rightSidePanel.style.left = this.table.clientWidth + 10 + "px";
      this.rightSidePanel.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    } catch (err) {
      await this.sleep(200);
      console.warn(err);
    }
  }

  async hugeScrean() {
    this.screenType = "huge";
    try {
      this.screenType = "huge";
      this.table.style.top = this.header.clientHeight + 10 + "px";
      this.table.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";

      this.rightSidePanel.style.top = this.header.clientHeight + 10 + "px";
      this.rightSidePanel.style.left = this.table.clientWidth + 10 + "px";
      this.rightSidePanel.style.height =
        window.innerHeight - this.header.clientHeight - 13 + "px";
    } catch (err) {
      console.warn(err);
      await this.sleep(200);
    }
  }
  /**
   * Connects sockets
   */
  connectScokets() {
    console.log(this.socket);
    this.socket.addEventListener("open", (event) => {
      this.socket.send("Good morning ");
    });
  }
  /**
   * Listens to socket message
   * @netwotk
   */
  //TODO napraw filtrowanie renderek działą
  listenSockets() {
    this.socket.addEventListener("message", (event) => {
      console.log("Message from server ", JSON.parse(event.data));
      let data = JSON.parse(event.data);
      if (this.lobbyList.length === 0) {
        this.lobbyList = data;
        this.lobbyList.forEach((element, counter) => {
          TableSelect.render(element, counter + 1);
        });
      }
      try {
        data.forEach((element, counter) => this.filtrate(element, counter));
      } catch (err) {
        console.warn(err);
      }
    });
  }
  /**
   * Filtrates if rooms exists
   * @param {JSON} room room data
   * @param {Number} counter room number
   */
  filtrate(room, counter) {
    let index = this.lobbyList.find(
      (element) => element.roomId === room.roomId
    );
    if (index === undefined) {
      TableSelect.render(room, counter + 1);
    }
  }
  /**
   * Handling scrollUp
   * @override
   */
  scrollUp = async () => {
    if (this.screenType == "small") {
      //hides top scroll
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
    this.rightSidePanel = document.querySelector(".rightContainer");
  }
  /**
   * Closes socket on window unload
   */
  closeListen() {
    window.addEventListener("beforeunload", () => {
      this.socket.close();
    });
  }
  /**
   * Renders page using basic components
   */
  render() {
    document.body.insertAdjacentHTML("beforeend", this.header.render());
    TableSelect.renderBasic();
    this.rightContainer.render();
  }
}
