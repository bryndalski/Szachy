import BasicAlertClass from "./BasicAlert.js";

export default class ConfirmAlert extends BasicAlertClass {
  constructor() {
    super("confirmAlert");
  }

  fire() {
    console.log("wywołanie alerta ");
    this.sleep(10).then((v) => dispatchEvent(this.eventEmiter));
    document.body.innerHTML += `
    <div class="plachta"></div>
    <div class="addRoom">
        <span class="m-1">Czy chcesz się wylogować ?</span>
          <div class="alertControlls flex-row">
            <button>Tak</button>
            <button>Nie</button>
          </div>
      </div>`;
  }
}
