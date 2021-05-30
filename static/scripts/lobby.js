// const lobbyMenager = {};

import LobbySelect from "./components/LobbySelect.js";

let socket = new WebSocket("ws://localhost:5500/sockets/lobbyWS");
// Connection opened
socket.addEventListener("open", function (event) {
  socket.send("my new lobby");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from server ", event.data);
});

let lobby = new LobbySelect();
lobby.render();
