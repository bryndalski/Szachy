/**
 * User session class
 * @alias (Session)
 * @class
 * @description class containing user session
 */
class Session {
  /**
   * @param {object} user user class from mongodb
   */
  constructor(user) {
    this.user = user;
    this.sendableUser = {
      nickname: user.nickname || undefined,
      stats: { ...user.stats },
      lobbyID: null,
      gameID: null, //TODO sprawdź czy jest potrzebne
    };
  }
}
module.exports = Session;
