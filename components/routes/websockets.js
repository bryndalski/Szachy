require("colors");
const router = require("express").Router();
const lobby = require("../data/Lobby");
const { logIn } = require("../User");
let socektId = 0;
let socektArray = [];
let room = "";

router.ws("/lobbyWS", function (ws, req) {
  try {
    ws.on("message", function (msg) {
      ws.send(JSON.stringify(lobby.lobbyContent));
    });
    lobby.addListener("change", () => {
      try {
        ws.send(JSON.stringify(lobby.lobbyContent));
      } catch (err) { }
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
        let room
        msg = JSON.parse(msg);
        console.log(msg)
        switch (msg.type) {
          case "init":
            ws.socektId = socektId++;
            room = lobby.lobby.findIndex(
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
                board: lobby.lobby[room].board
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
                type: "moveOptions",
                clicked: msg.position,
                moves: lobby.lobby[room].moves({ square: msg.position })
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
            let move = lobby.lobby[room2].move({ from: msg.piecePos, to: msg.destPos });
            lobby.lobby[room2].board = msg.board

            socketDestinations = socketDestinations.filter(x => x != null)

            socketDestinations.forEach((e) => {
              socektArray[e].send(JSON.stringify({
                type: "move",
                move: move,
                board: lobby.lobby[room2].board,
                ischeck: lobby.lobby[room2].in_check(),
                ischeckmate: lobby.lobby[room2].in_checkmate(),
                isdraw: lobby.lobby[room2].in_draw(),
                isstalemate: lobby.lobby[room2].in_stalemate(),
              }))
            }
            );
            break;
          case "end":
            //!!! zwiększ statystyki


            let room3 = lobby.lobby.findIndex(
              (elem) => elem.roomId == req.session.user.sendableUser.gameID
            );
            let socketDestinations2 = [
              lobby.lobby[room3].playerOneWsId,
              lobby.lobby[room3].playerTwoWsId,
            ];

            socketDestinations2 = socketDestinations2.filter(x => x != null)

            if (lobby.lobby[room3].turn() == 'b') {
              socketDestinations2.forEach((e) => {
                socektArray[e].send(JSON.stringify({
                  type: "end",
                  winner: "czarny"
                }))
              }
              );
            } else {
              socketDestinations2.forEach((e) => {
                socektArray[e].send(JSON.stringify({
                  type: "end",
                  winner: "biały"
                }))
              }
              );
            }


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
