"use strict";
const { v4: uuidv4 } = require("uuid");

class Room {
  /**
   *
   * @param {string} playerOne creator nickname
   * @param {string} roomName room name
   * @param {boolean=} [isPrivate=false] room accessibility
   * @param {string=} [password=null] password for private room
   */
  constructor(playerOne, roomName, isPrivate, password) {
    this.roomId = uuidv4;
    this.roomName = roomName;
    this.private = isPrivate || false;
    this.playerOne = playerOne || null;
    this.playerTwo = playerTwo || null;
    this.roomPassword = password || null;
  }

  /**
   * Pozwala na dodanie nowego gracza do room
   * @param {string} nickname2 nick drugiego gracza
   */
  addNewPlayer(nickname2) {
    this.playerTwo = nickname2;
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
   * Zwraca id room
   * @returns {id} roomId
   */
  get roomId() {
    return this.roomId;
  }
}

module.exports = Room;
