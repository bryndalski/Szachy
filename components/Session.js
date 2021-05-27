/**
 * User session class
 * @alias (Session)
 * @class
 * @description class containing user session
 */
class Session {
  /**
   * @param {string} user user class from mongodb
   */
  constructor(user) {
    this.user = user;
    this.nickname = user.nickname || undefined;
    this.lobbyID = null;
    this.gameID = null; //TODO sprawdź czy jest potrzebne
  }
  /**
   * Assign user to lobby id ( creates connection )
   * @param {string} lobby ID lobby
   */
  addToLobby(lobby) {
    this.lobbyID = lobby;
  }
  /**
   * Removes connection between user and lobby
   */
  get dropLobby() {
    this.lobbyID = null;
  }
  /**
   * Returns user for room
   * @returns {object} User for room
   */
  get roomUser() {
    return {
      nickname: this.user.nickname,
      stats: this.user.stats,
    };
  }
}
module.exports = Session;
