const router = require("express").Router();
const lobby = require("../data/Lobby");
router.ws("/lobbyWS", function (ws, req) {
  console.log("socket connected");
  ws.on("message", function (msg) {});

  lobby.addListener("change", () => {
    console.log("Tutaj coś powinienem wysłać");
    console.log("wysyłam ");
    ws.send(JSON.stringify(lobby.lobbyContent));
  });
});

module.exports = router;
