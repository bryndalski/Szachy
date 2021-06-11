"use strict";

import BasicLobby from "../BasicLobby.js";
export default class CreateLobbyAlert extends BasicLobby {
  constructor() {
    super();
    this.eventEmiter = new CustomEvent("alertFire");
    this.fired = false;
    this.alertListener();
  }

  /**
   * Listens to button click
   */
  clickListen = () => {
    document.body.insertAdjacentHTML("beforeend", this.fire());
  };
  /**
   *
   * @param {event} e validates data from input on live typing
   */
  inputValidator = (e) => {
    if (e.target.value.replace(/\s\s+/g, " ").length < 3) {
      e.target.style.borderColor = "#dc3545";
      document
        .querySelector(".alertControlls button:first-child")
        .removeEventListener("click", this.joinLobby);
      document.querySelector(
        ".alertControlls button:first-child"
      ).disabled = true;
    } else {
      e.target.style.borderColor = "#0d6efd";
      document
        .querySelector(".alertControlls button:first-child")
        .addEventListener("click", this.joinLobby);
      document.querySelector(
        ".alertControlls button:first-child"
      ).disabled = false;
    }
  };

  /**
   * Send data of new room
   */
  joinLobby = () => {
    let inputs = Array.from(document.querySelectorAll(".options input"));
    console.log(inputs[1].checked);
    fetch("/addRoom", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: inputs[0].value,
        passwordRequired: inputs[1].checked,
        password: inputs[2].value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Essa");
          window.location.href = "/game";
        }
      });
    this.atomize();
  };
  /**
   *Listens to alert fire action on listener
   */
  alertListener() {
    window.addEventListener("alertFire", () => {
      //disable button
      document.querySelector(".createHeader button").disabled = false;
      //password
      document
        .querySelector(".form-check-input")
        .addEventListener("change", this.listenPassInputRequirement);
      //alert gone
      document
        .querySelector(".plachta")
        .addEventListener("click", this.atomize);
      //submit button
      document
        .querySelector(".alertControlls button:first-child")
        .addEventListener("click", this.joinLobby);
      //cansel button
      document
        .querySelector(".alertControlls button:nth-child(2)")
        .addEventListener("click", this.atomize);
      document.querySelector(".createHeader button").disabled = false;
      //password type password
      document
        .querySelector(".passer")
        .addEventListener("input", this.inputValidator);
      //login validate
      document
        .querySelector(".options input:first-child")
        .addEventListener("input", this.inputValidator);
    });
  }
  /**
   * listens if room requires password or not
   * @css
   */
  listenPassInputRequirement = (e) => {
    let label = document.querySelector(".form-check-label");
    let passInput = document.querySelector(".passer");
    if (e.target.checked) {
      label.innerText = "Hasło";
      passInput.style.visibility = "visible";
      passInput.disabled = false;
      document
        .querySelector(".passer")
        .addEventListener("input", this.inputValidator);
    } else {
      document
        .querySelector(".passer")
        .removeEventListener("input", this.inputValidator);
      label.innerText = "Brak hasła";
      passInput.style.visibility = "hidden";
      passInput.disabled = true;
    }
  };
  /**
   * Fires lobby create page
   * @returns {HTMLDivElement} LobbyAlert
   * @emits alertFire
   */
  fire() {
    this.fired = true;
    this.sleep(10).then((v) => dispatchEvent(this.eventEmiter));
    return `
    <div class="plachta"></div>
    <div class="addRoom">
        <span>Alert Name</span>
        <div class="options">
          <input
            type="text"
            name="roomName"
            placeholder="Room name"
            maxlength="20"
            minlength="3"
            required
          />
          <div class="form-check form-switch pl-0 d-flex flex-column">
           <input class="form-check-input " type="checkbox" checked >
            <label 
            class="form-check-label"
            for="form-check-input"
            disabled
    
              >Hasło</label
            >
          </div>
          <form>
          <input type="password" placeholder="Password" class="passer" autocomplete="off" />
          </form>
          <div class="alertControlls">
            <button disabled>Join</button>
            <button>Chanel</button>
          </div>
      </div>`;
  }
  /**
   * Removes alert dialog and all components created with it
   * @warning DOES NOT SEND ANDY DATA
   */
  atomize() {
    //enables button
    document.querySelector(".createHeader button").disabled = false;
    //remove input password requirement listener
    document
      .querySelector(".form-check-input")
      .removeEventListener("change", this.listenPassInputRequirement);
    //remove plachta listener
    document
      .querySelector(".plachta")
      .removeEventListener("click", this.atomize);
    //remove elements from button
    document
      .querySelector(".alertControlls button:first-child")
      .removeEventListener("click", this.joinLobby);
    //dismiss button
    document
      .querySelector(".alertControlls button:nth-child(2)")
      .removeEventListener("click", this.atomize);
    //password valdator
    document
      .querySelector(".passer")
      .removeEventListener("input", this.inputValidator);
    //name valdator
    document
      .querySelector(".options input:first-child")
      .removeEventListener("input", this.inputValidator);
    document.body
      .querySelector(".addRoom")
      .parentNode.removeChild(document.body.querySelector(".addRoom"));
    document.body.removeChild(document.querySelector(".plachta"));
  }
}
