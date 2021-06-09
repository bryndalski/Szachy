"use strict";
const { v4: uuidv4 } = require("uuid");
/**
 * EXTENDS CHESS JS
 */

class Room {
  /**
   *
   * @param {string} playerOne creator nickname
   * @param {string} roomName room name
   * @param {boolean=} [isPrivate=false] room accessibility
   * @param {string=} [password=null] password for private room
   */
  constructor(playerOne, roomName, isPrivate, password) {
    this.roomId = uuidv4(); //unique lobby id
    this.roomName = roomName;
    this.private = isPrivate || false;
    this.playerOne = playerOne || null;
    this.playerTwo = null;
    this.roomPassword = password || null;
  }

  /**
   * Pozwala na dodanie nowego gracza do room
   * @param {string} nickname2 nick drugiego gracza
   * @param {string} password room password
   * @returns {Boolean} If password has passed
   */
  addNewPlayer(nickname2, password) {
    if (this.isPrivate)
      if (this.password === password) {
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
}

module.exports = Room;
