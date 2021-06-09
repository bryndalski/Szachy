import ScrollBehavior from "../LobbyScroll.js";

export default class RightSideContainer extends ScrollBehavior {
  constructor() {
    super();
    this.firstRender = true;
    this.sendableData = {};
    window.addEventListener("roomChange", this.handleListen);
  }
  /**
   * Renders basic page structure
   */
  render() {
    //renders maoin container
    this.renderContainer = document.createElement("div");
    this.renderContainer.classList.add("rightContainer");
    document.body.appendChild(this.renderContainer);
    //basic look generator
    let roomImage = document.createElement("img");
    roomImage.src = "/images/pawn.svg";
    this.renderContainer.appendChild(roomImage);
    //buttonJoin
  }
  /**
   * Listens for event
   * @param {Event} e Envent containg data with details
   */
  handleListen = (e) => {
    if (this.firstRender) this.buildUserize();
    if (JSON.stringify(this.sendableData) !== JSON.stringify(e.detail)) {
      this.userize(e.detail);
      this.sendableData = e.detail;
    }
  };

  /**
   * Creates everything which is neede for user to join the room
   */
  userize(element) {
    this.roomName.innerText = element.roomName;
    this.passInput.style.visibility = element.private ? "visible" : "hidden";
    //submit Button
    this.enterButton = document.createElement("button");
  }
  /**
   * First userize render
   */
  buildUserize() {
    let container = document.createElement("div");
    container.classList.add("RightSideAuthcContainer");
    this.roomName = document.createElement("span");
    this.passInput = document.createElement("input");
    this.passInput.type = "password";
    this.joinButton = document.createElement("button");
    this.joinButton.innerText = "Dołącz";
    this.authorizeError = document.createElement("span");
    this.firstRender = false;
    this.renderContainer.appendChild(this.roomName);
    container.appendChild(this.passInput);
    container.appendChild(this.joinButton);
    container.appendChild(this.authorizeError);
    this.renderContainer.appendChild(container);
    //listen to butto
    this.joinButton.addEventListener("click", this.buttonSend);
  }
  /**
   * Sends lobby data to client
   *
   * Handles connection between client and server sanidng data abnotu lobby and allowing it to
   * reconnect
   */
  buttonSend = async () => {
    fetch("/addToRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.sendableData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("jakakowliek cokolwiek");
        console.log("Success:", data);
        if (data.success) {
          window.location.href = "/game";
        } else {
          this.authorizeError.innerText = "Błędne hasło zostało podane";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
}
