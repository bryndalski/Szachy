require("colors");
const router = require("express").Router();
const lobby = require("../data/Lobby");
const { logIn } = require("../User");
let socektId = 0;
let socektArray = [];

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
        let room = lobby.lobby.findIndex(
          (elem) => elem.roomId == req.session.user.sendableUser.gameID
        );
        msg = JSON.parse(msg);
        switch (msg.type) {
          case "init":
            // //!! na razie ustawione statycznie
            ws.socektId = socektId++;
            // try {
            //   console.log(id);
            //   let room = lobby.lobby.findIndex(
            //     (elem) => elem.roomId == req.session.user.sendableUser.gameID
            //   );
            console.log("UWGA");
            console.log(
              req.session.user.user.nickname == lobby.lobby[room].playerOne
                ? "playerOneWsId"
                : "playerTwoWsId"
            );
            lobby.lobby[room][
              req.session.user.user.nickname == lobby.lobby[room].playerOne
                ? "playerOneWsId"
                : "playerTwoWsId"
            ] = socektId;
            socektArray[ws.socektId] = ws;
            console.log(lobby.lobby[room]);
            // } catch (er) {
            //   console.log(er);
            // }

            ws.send(
              JSON.stringify({
                type: "init",
                color:
                  lobby.lobby[room].playerOne == req.session.user.user.nickname
                    ? "white"
                    : "black",
                loadBoard: chess.board(),
              })
            );
            break;
          case "moveOptions":
            // console.log(msg.position);
            const moves = chess.moves({ square: msg.position });
            // console.log(moves);
            ws.send(
              JSON.stringify({
                type: "moveOptions",
                clicked: msg.position,
                moves: moves,
                ischeck: chess.in_check(),
                ischeckmate: chess.in_checkmate(),
                isdraw: chess.in_draw(),
                isstalemate: chess.in_stalemate(),
              })
            );
            break;
          case "move":
            let move = chess.move({ from: msg.piecePos, to: msg.destPos });
            //TODO tuuutaj zmiaana
            ws.send(JSON.stringify({ type: "move", move: move }));
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
