/**
 * @alias  (MongoOperations) Operacje logowania/użytkownika na mongodb
 * @class
 *
 */
class MongoOperations {
  /**
   *
   */
  constructor() {
    this.collection = null;
    this.ObjectID = null;
  }

  //methods
  /**
   *
   * @param {collection} collection kolekcja
   * @param {id} ObjectID id objektu
   */
  selectCollection(collection, ObjectID) {
    this.collection = collection;
    this.ObjectID = ObjectID;
  }
  /**
   *
   * @param {object} data objekt do dodania
   * @returns {Promise<boolean>}
   */
  insert(data) {
    return new Promise((suc, err) => {
      this.collection
        .insertOne(data)
        .then((result) => suc(result))
        .catch((err) => err(err));
    });
  }
  /**
   * Pobiera wszystkie wartości z bazy danych
   *
   * @returns {Promise<object>}
   */
  getAll() {
    return new Promise((suc, err) => {
      this.collection.find({}).toArray(function (err, items) {
        suc(items);
      });
    });
  }
  /**
   *
   * @param {string} id Id obiektu
   * @returns
   */
  delete(id) {
    return new Promise((suc, err) => {
      this.collection.deleteOne({ _id: this.ObjectID(id) }).then((data) => {
        suc(data);
      });
    });
  }
  /**
   * Służąca do update
   *
   * @param {JSON} data dane do update
   * @returns {Promise<boolean>}
   */
  update(data) {
    return new Promise((suc, err) => {
      console.log(data);
      this.collection
        .updateOne(
          { _id: this.ObjectID(data._id) },
          { $set: { password: data.password, login: data.login } }
        )
        .then((data) => suc(data));
    });
  }
  /**
   *
   * @param {JSON} data object containg nickname
   * @returns {Promise<JSON>} returns JSON or null
   */
  getOne(data) {
    return new Promise((suc) => {
      this.collection
        .findOne({ nickname: data.nickname })
        .then((result) => suc(result));
    });
  }
}
module.exports = new MongoOperations();
