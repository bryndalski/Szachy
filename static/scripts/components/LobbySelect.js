"use strict";
import HEADER from "./templates/HEADER_SELECT.js";
import BasicLobby from "./BasicLobby.js";
import CONTAINERS from "./templates/CONTAINERS_SELECT.js";
import TableSelect from "./templates/TABLE_SELECT.js";
/**
 * @bryndalski
 * @description Class creaded for maintaing and handling
 * view of smaller lobby with JOIN options.
 */

export default class LobbySelect extends BasicLobby {
  constructor(user) {
    super();
    this.header = new HEADER(user);
    this.user = user; //user from params
    this.render(); // renders page
    this.header.listen();
    this.socket = new WebSocket("ws://localhost:5500/sockets/lobbyWS"); // init websocket
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
      this.table.style.top = this.header.clientHeight + 10 + "px";
      this.table.style.height =
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
    console.log("jazda jazda ");
    this.socket.addEventListener("open", (event) => {
      console.log("dzień dobry");
      this.socket.send("my new lobby");
    });
  }
  /**
   * Listens to socket message
   */
  //TODO napraw filtrowanie renderek działą
  listenSockets() {
    this.socket.addEventListener("message", function (event) {
      console.log("Message from server ", JSON.parse(event.data));
      let data = JSON.parse(event.data);
      try {
        data.forEach((element, counter) => {
          TableSelect.render(element, counter);
          this.filtrate(element, counter);
        });
        this.lobbyList = event.data;
      } catch (err) {
        console.warn(err);
      }
    });
  }
  //TODO status
  //TODO napraw pokoje publiczne
  //TODO testuj mnie
  filtrate(element, counter) {
    if (counter >= this.lobbyList.length)
      return console.log("nic do zmiany po prostu nowy dodany ");
    if (JSON.stringify(this.lobbyList[counter]) !== JSON.stringify(element)) {
      if (this.lobbyList[counter].availible != element.availible) {
        console.log("element do wywalenia");
      } else if (this.lobbyList[counter].private != element.private) {
        console.log("do rerenderowania statusu");
      }
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
  }
  closeListen() {
    console.log("no wykounje sie");
    window.addEventListener("beforeunload", () => {
      alert("zamykam");
      this.socket.close();
    });
  }
  /**
   * Renders page using basic components
   */
  render() {
    console.log(TableSelect);
    document.body.insertAdjacentHTML("beforeend", this.header.render());
    TableSelect.renderBasic();
  }
}
