const bcrypt = require("bcrypt");
const MongoOperations = require("./MongoOperations");
require("colors");
/**
 * Creates user class
 * @description Creates user class containg operations that can be done on single user such as :
 *  - creation
 *  - login
 *  - register
 *  - compare passowrds
 * @class
 * @alias (User)
 */
class User {
  /**
   * @alias (User)

   */
  constructor() {}
  /**
   * Creates mongodb user
   * @asyc
   * @param {string} nickname nick
   * @param {string} password unhashed password
   * @returns {Object} mongodb data
   */
  async createUser(nickname, password) {
    return {
      nickname,
      password: await bcrypt.hash(password, 10),
      stats: {
        played: 0,
        wins: 0,
        looses: 0,
      },
    };
  }
  /**
   * Compares hashed passwords
   *
   * @param {String} unHashedPass unhashed password
   * @param {String} HashedPass  hashed password
   * @returns {Promise<boolean>} password maches
   */
  comparePasswordHash(unHashedPass, HashedPass) {
    return new Promise(async (suc) =>
      suc(await bcrypt.compare(unHashedPass, HashedPass))
    );
  }
  /**
   * Register user
   * @async
   * @param {String} nickname
   * @param {String} password
   * @returns {Promise<boolean>} Success of operation
   */
  register(nickname, password) {
    return new Promise(async (suc) => {
      if (nickname.length <= 6 || password.length <= 6) suc(false);
      else {
        if ((await MongoOperations.getOne({ nickname })) === null)
          await MongoOperations.insert(
            await this.createUser(nickname, password)
          ).then(suc(true));
        else suc(false);
      }
    });
  }
  /**
   *Log in user
   *
   * @param {string} nickname user nickname
   * @param {string} password user password
   * @returns {Promise.<boolean, JSON>}
   *
   */
  logIn(nickname, password) {
    return new Promise(async (suc) => {
      let user = await MongoOperations.getOne({ nickname });
      if (user === null) suc(false);
      else {
        if (await this.comparePasswordHash(password, user.password)) suc(user);
        else suc(false);
      }
    });
  }
  /**
   *
   * @param {_id} _id  mongo db id
   * @param {*} password new encrypted password
   * @returns {Promise} empty promise that
   */
  changePassword(_id, password) {
    return new Promise(async (suc) => {
      let hashedPass = await bcrypt.hash(password, 10);
      await MongoOperations.changePassword(_id, hashedPass);
      suc(false);
    });
  }
}

module.exports = new User();
