import BasicAlertClass from "./BasicAlert.js";

export default class ChangePasswordAlert extends BasicAlertClass {
  constructor() {
    super("passChange");
    this.inputValue = "";
  }
  //valoidates password
  validator = () => {
    let inputs = Array.from(document.querySelectorAll(".options input"));
    let values = inputs.map((e) => e.value);
    let shouldBeDisabled = false;
    values.forEach((e, counter) => {
      if (e.replace(/\s\s+/g, " ").length < 5) {
        console.log(e);
        inputs[counter].style.borderColor = "#dc3545";
        this.shouldBeDisabled = true;
      }
    });
    if (values[0] != values[1]) shouldBeDisabled = true;
    if (!shouldBeDisabled) {
      inputs.forEach((e) => (e.style.borderColor = "#198754"));
      this.inputValue = values[0];
    }

    document.querySelector(".addRoom span:nth-child(3)").style.visibility =
      shouldBeDisabled ? "visible" : "hidden";
    document.querySelector(".alertControlls button:first-child").disabled =
      shouldBeDisabled;
  };
  /**
   * Opens custom listeners
   */
  customListen() {
    document
      .querySelector(".options input:first-child")
      .addEventListener("input", this.validator);
    document
      .querySelector(".options input:nth-child(2)")
      .addEventListener("input", this.validator);
  }
  /**
   * Removes event listeners
   */
  customListenersRemover() {
    document
      .querySelector(".options input:first-child")
      .removeEventListener("input", this.validator);
    document
      .querySelector(".options input:nth-child(2)")
      .removeEventListener("input", this.validator);
  }
  /**
   *
   */
  submitButtonListen = async () => {
    await fetch("/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: this.inputValue }),
    });
    window.location.href = "/";
  };

  /**
   * Fires alert
   * @returns {HTML string}
   */
  fire() {
    console.log("wywołanie alerta ");
    this.sleep(10).then((v) => dispatchEvent(this.eventEmiter));
    return `
    <div class="plachta"></div>
    <div class="addRoom">
        <span class="m-1">Zmień hasło</span>
          <div class="options">
            <input type="password" minlength="7" required>
            <input type="password" minlength="7" required>
          </div>
          <span style="visibility:hidden">Hasła nie pasują</span>
          <div class="alertControlls flex-row">
            <button disabled>Zmień</button>
            <button>Anuluj</button>
          </div>
      </div>`;
  }
}
