require("colors");
const router = require("express").Router();
const lobby = require("../data/Lobby");
const { logIn } = require("../User");

//!! tymaczasowe chess
const { Chess } = require('chess.js')
const chess = new Chess()


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
      //!!! let room = lobby.lobby.findIndex(elem => elem.gameId == req.session.sendableUser.gameID) // zwraca -1
      // console.log(room)

      msg = JSON.parse(msg)
      switch (msg.type) {
        case "init":
          //!! na razie ustawione statycznie
          ws.send(JSON.stringify({ type: "init", color: "white", loadBoard: chess.board() }))
          break;
        case "moveOptions":
          console.log(msg.position)
          const moves = chess.moves({ square: msg.position })
          console.log(moves)
          ws.send(JSON.stringify({ type: "moveOptions", clicked: msg.position, moves: moves, ischeck: chess.in_check(), ischeckmate: chess.in_checkmate(), isdraw: chess.in_draw(), isstalemate: chess.in_stalemate() }))
          break;
        case "move":
          let move = chess.move({ from: msg.piecePos, to: msg.destPos })
          ws.send(JSON.stringify({ type: "move", move: move }))
          break;
      }
    })
  } catch (err) {
    console.log(err.toString().red);
  }
})

module.exports = router;
