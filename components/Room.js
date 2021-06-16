"use strict";
const { v4: uuidv4 } = require("uuid");
const { Chess } = require("chess.js");
/**
 * EXTENDS CHESS JS
 */

class Room extends Chess {
  /**
   *
   * @param {string} playerOne creator nickname
   * @param {string} roomName room name
   * @param {boolean=} [isPrivate=false] room accessibility
   * @param {string=} [password=null] password for private room
   */
  constructor(playerOne, roomName, isPrivate, password) {
    super();
    this.roomId = uuidv4(); //unique lobby id
    this.roomName = roomName;
    this.private = isPrivate || false;
    this.playerOneColor = "white";
    this.playerTwoColor = "black";
    this.playerOneWsId = null;
    this.playerTwoWsId = null;
    this.playerOne = playerOne;
    this.playerTwo = null;
    this.roomPassword = password || null;
    this.board = [
      'd1', 'a1', 'a2', 'c1', 'e1', 'h1', 'b1', 'f1', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'g1', 'd8', 'a8', 'a7', 'c8', 'e8', 'h8', 'b8', 'f8', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'g8'
    ]
  }

  /**
   * Pozwala na dodanie nowego gracza do room
   * @param {string} nickname2 nick drugiego gracza
   * @param {string} password room password
   * @returns {Boolean} If password has passed
   */
  addNewPlayer(nickname2, password) {
    if (this.isPrivate)
      if (this.password == password) {
        this.playerTwo = nickname2;
      } else return false;
    else this.playerTwo = nickname2;
    return true;
  }
  /**
   * Zwraca dostępnośc room
   * @returns {boolean} dostępnośc
   */
  get isAvailible() {
    if (this.playerTwo === null) return true;
    else return false;
  }
  /**
   *
   * @param {*} popsition
   * @returns {JSON} resurns object with positions, game status
   */
  moveOption(popsition) {
    let moves = this.moves({ square: position });
    return {
      type: "moveOptions",
      clicked: position,
      moves: moves,
      ischeck: this.in_check(),
      ischeckmate: this.in_checkmate(),
      isdraw: this.in_draw(),
      isstalemate: this.in_stalemate(),
    };
  }

}

module.exports = Room;
