window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("logIn")
    .addEventListener("click", loginMenager.handleButton);
  document
    .getElementById("register")
    .addEventListener("click", loginMenager.handleRegButton);

  window.addEventListener("keypress", (e) => {
    if (e.key == "Enter") loginMenager.handleButton();
  });
});
const loginMenager = {
  login: "",
  password: "",
  /**
   * Checks login and password validation
   *
   * @returns {boolean} if data is not valid
   * @returns {object}  if data is valid
   *
   */
  validateInputs() {
    let inputArray = Array.from(document.querySelectorAll("input"));
    console.log(inputArray);
    inputArray = inputArray.map((element) => element.value);
    if (inputArray[0].length <= 6 && inputArray[1].length <= 6) {
      return false;
    } else {
      return { nickname: inputArray[0], password: inputArray[1] };
    }
  },
  //* ========== button handlers =========
  handleButton: () =>
    loginMenager.sendData("/login", loginMenager.logInCallBack),
  handleRegButton: () =>
    loginMenager.sendData("/register", loginMenager.registerCallBack),
  //* ========== end of button handlers ====
  /**
   * Sending data from input to adress
   * @method POST
   * @content JSON
   * @callback <function> Callback in case of failed login/register
   * @param {string} address request address
   */
  async sendData(address, callback) {
    let data = this.validateInputs();
    if (data)
      fetch(address, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        redirect: "follow",
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) window.location.href = data.next;
          else callback();
        });
    else {
      document.querySelector(".warnMessage").innerText = "Oba pola są wyamgane";
    }
  },
  /**
   * Callback containg bad register info
   */
  registerCallBack() {
    document.querySelector(".warnMessage").innerText =
      "Użytkownik o takim nicku już istnieje";
  },
  /**
   * Callback containg bad log in message
   */
  logInCallBack() {
    document.querySelector(".warnMessage").innerText =
      "Podano błędny login lub hasło";
  },
};
