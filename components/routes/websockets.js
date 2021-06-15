require("colors");
const router = require("express").Router();
const lobby = require("../data/Lobby");
const { logIn } = require("../User");
let socektId = 0;
let socektArray = [];
let room = "";
//!! tymaczasowe chess
const { Chess } = require("chess.js");
const chess = new Chess();

router.ws("/lobbyWS", function (ws, req) {
  try {
    ws.on("message", function (msg) {
      ws.send(JSON.stringify(lobby.lobbyContent));
    });
    lobby.addListener("change", () => {
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

router.ws("/Szaszki", function (ws, req) {
  try {
    ws.on("message", function (msg) {
      try {
        msg = JSON.parse(msg);
        switch (msg.type) {
          case "init":
            // //!! na razie ustawione statycznie
            ws.socektId = socektId++;
            let room = lobby.lobby.findIndex(
              (elem) => elem.roomId == req.session.user.sendableUser.gameID
            );
            lobby.lobby[room][
              req.session.user.user.nickname == lobby.lobby[room].playerOne
                ? "playerOneWsId"
                : "playerTwoWsId"
            ] = socektId;
            socektArray[socektId] = ws;
            socektArray[
              lobby.lobby[room][
                req.session.user.user.nickname == lobby.lobby[room].playerOne
                  ? "playerOneWsId"
                  : "playerTwoWsId"
              ]
            ].send(
              JSON.stringify({
                type: "init",
                color:
                  lobby.lobby[room].playerOne == req.session.user.user.nickname
                    ? "white"
                    : "black",
              })
            );
            break;
          case "moveOptions":
            room = lobby.lobby.findIndex(
              (elem) => elem.roomId == req.session.user.sendableUser.gameID
            );
            socektArray[
              lobby.lobby[room][
                req.session.user.user.nickname == lobby.lobby[room].playerOne
                  ? "playerOneWsId"
                  : "playerTwoWsId"
              ]
            ].send(
              JSON.stringify({
                type: "init",
                color:
                  lobby.lobby[room].playerOne == req.session.user.user.nickname
                    ? "white"
                    : "black",
              })
            );
            break;
          case "move":
            let room2 = lobby.lobby.findIndex(
              (elem) => elem.roomId == req.session.user.sendableUser.gameID
            );
            let socketDestinations = [
              lobby.lobby[room2].playerOneWsId,
              lobby.lobby[room2].playerTwoWsId,
            ];
            lobby.lobby[room2].move({ from: msg.piecePos, to: msg.destPos });

            socketDestinations.forEach((e) =>
              socektArray[e].send({ type: "move", move: move })
            );
            break;
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err.toString().red);
  }
});

module.exports = router;
