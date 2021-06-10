import BasicAlertClass from "./BasicAlert.js";

export default class ChangePasswordAlert extends BasicAlertClass {
  constructor() {
    super("passChange");
  }

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
          <div class="alertControlls flex-row">
            <button>Zmień</button>
            <button>Anuluj</button>
          </div>
      </div>`;
  }
}
