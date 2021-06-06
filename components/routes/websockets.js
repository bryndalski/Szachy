require("colors");
const router = require("express").Router();
const lobby = require("../data/Lobby");
router.ws("/lobbyWS", function (ws, req) {
  try {
    ws.on("message", function (msg) {
      console.log(ws.readyState + "message");
      ws.send(JSON.stringify(lobby.lobbyContent));
    });
    lobby.addListener("change", () => {
      console.log(ws.readyState + "change");
      console.log("wysyłam ");
      try {
        ws.send(JSON.stringify(lobby.lobbyContent));
      } catch (err) {}
    });
    ws.on("close", (msg) => {
      console.log(ws.readyState);

      console.log("socket closed");
    });
  } catch (err) {
    console.log(err.toString().red);
  }
});

module.exports = router;
