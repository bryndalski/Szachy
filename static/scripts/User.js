// import NickChangeAlert from "./components/auth/NickChangeAlert.js";
import ConfirmAlert from "./components/auth/ConfirmAlert.js";
class User {
  constructor() {
    this.stats = {};
    this.canvas = document.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    console.log(this.canvas);
    this.canvasContainer = document.querySelector(".chartContainer");
    //alerts
    // this.nickLobbyAlert = new NickChangeAlert();
    this.conrirmAlert = new ConfirmAlert();
    this.scaleCanvas();
    this.init();
  }
  /**
   * Init user
   */
  async init() {
    this.buttonize();
    window.addEventListener("resize", this.scaleCanvas);
    this.chats();
  }
  /**
   * Scales canvas
   */
  scaleCanvas = () => {
    console.log(this.canvasContainer.clientHeight);
    this.canvas.width = this.canvasContainer.clientWidth;
    this.canvas.height = this.canvasContainer.clientHeight;
  };
  /**
   * Init charts
   */
  chats() {
    new Chart(this.canvasContext, {
      type: "bar",
      data: {
        labels: ["Wygrane", "Przegrane", "Remisy"],
        datasets: [
          {
            label: "Statystyka",
            data: [12, 19, 3], //TODO dane z serwera tutaj
            backgroundColor: ["transparent", "transparent", "transparent"],
            borderColor: ["#5cb85c", "#d9534f", "#5bc0de"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
  /**
   * Starts handling buttons actione
   */
  buttonize() {
    document
      .querySelector(".userData button:first-child")
      .addEventListener("click", () => {
        // this.nickLobbyAlert.fire();
      }); // zmień nick
    //wyloguj
    document
      .querySelector("header button:nth-child(2)")
      .addEventListener("click", (e) => {
        this.conrirmAlert.clickListen(e);
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new User();
});
