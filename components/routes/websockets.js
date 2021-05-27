const router = require("express").Router();
const Lobby = require("../data/Lobby");
router.ws("/lobbyWS", function (ws, req) {
  console.log("socket connected");
  ws.on("message", function (msg) {
    Lobby.addListener("change", () =>
      wg.send(JSON.stringify(Lobby.lobbyContent))
    );
  });
});

module.exports = router;
