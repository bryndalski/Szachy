"use strict";
import BasicLobby from "../BasicLobby.js";

export default class BasicAlertClass extends BasicLobby {
  /**
   *
   *    @param {String} alertContent HTML STRING with alert body
   *    @param {String} alertName Names alert
 
   */
  constructor(eventName) {
    super();
    this.alertContent = "";
    this.alertName = ""; // alert name
    this.eventName = eventName;
    this.eventEmiter = new CustomEvent(eventName);
    this.fireTarget = null;
    this.alertListener();
  }

  //* Listeners

  /**
   * Allows user to specify custom listeners
   * @override
   */
  customListen() {}

  submitButtonListen() {
    console.log("zgadzam się w 100 %");
    
  }

  /**
   * Removes alert behavior
   */
  customListenersRemover() {}

  // !!!! DO NOT CHANGE  / OVERWRITTE

  /**
   * Listens to button click
   */
  clickListen = (e) => {
    this.fireTarget = e.target;
    this.fireTarget.removeEventListener("click", this.clickListen);
    document.body.insertAdjacentHTML("beforeend", this.fire());
  };

  /**
   *Listens to alert fire action on listener
   @override DO NOT OVERWIRTE
   */
  alertListener() {
    window.addEventListener(this.eventName, () => {
      this.customListen();
      //ok button
      document
        .querySelector(".alertControlls button:nth-child(1)")
        .addEventListener("click", this.submitButtonListen);
      //cansel button
      document
        .querySelector(".alertControlls button:nth-child(2)")
        .addEventListener("click", this.atomize);
      document
        .querySelector(".plachta")
        .addEventListener("click", this.atomize);
    });
  }

  /**
   * Fires lobby create page
   * @returns {HTMLDivElement} LobbyAlert
   * @emits alertFire
   */
  fire() {
    this.sleep(10).then((v) => dispatchEvent(this.eventEmiter));
    return `
    <div class="plachta"></div>
    <div class="addRoom">
        <span>${[this.alertName]}</span>
            ${[this.alertContent]}
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
  atomize = () => {
    try {
      this.customListenersRemover();
      //ok button
      //   document
      //     .querySelector(".alertControlls button:first-child")
      //     .removeEventListener("click", this.submitButtonListen);
      //   //remove chancel liestener
      //   document
      //     .querySelector(".alertControlls button:nth-child(2)")
      //     .removeEventListener("click", this.atomize);
      document.body
        .querySelector(".addRoom")
        .parentNode.removeChild(document.body.querySelector(".addRoom"));
      document.body.removeChild(document.querySelector(".plachta"));
      console.log(this.fireTarget);
      this.fireTarget.addEventListener("click", this.clickListen);
    } catch (err) {
      console.warn(err);
    }
  };
}
