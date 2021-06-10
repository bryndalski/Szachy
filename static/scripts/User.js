// import NickChangeAlert from "./components/auth/NickChangeAlert.js";
import ChangePasswordAlert from "./components/auth/ChangePasswordAlert.js";
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
    this.passwordChangeAlert = new ChangePasswordAlert();
    //chart data
    this.chartStats = [];
    this.scaleCanvas();
    this.init();
  }

  /**
   * Init user
   */
  async init() {
    fetch("/userinfo")
      .then((response) => response.json())
      .then((data) => {
        this.chartStats = Object.values(data.stats);
        this.buttonize();
        this.chats();
      });
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
            data: this.chartStats, //TODO dane z serwera tutaj
            backgroundColor: ["transparent", "transparent", "transparent"],
            borderColor: ["#5cb85c", "#d9534f", "#5bc0de"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        devicePixelRatio: 1,
        responsive: true,
        maintainAspectRatio: false,
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
    //go back
    document
      .querySelector("header button:first-child")
      .addEventListener("click", () => {
        window.location.href = "/lobby";
      });
    //zmień nick
    document
      .querySelector(".userData button:first-child")
      .addEventListener("click", () => {
        // this.nickLobbyAlert.fire();
      });
    //zmień hasło
    document
      .querySelector(".userData button:nth-child(2)")
      .addEventListener("click", (e) => {
        this.passwordChangeAlert.clickListen(e);
      });
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
