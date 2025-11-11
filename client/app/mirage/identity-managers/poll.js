import { generatePassphrase } from '../../utils/encryption';

export default class {
  constructor() {
    this.reset();
  }

  /**
   * Returns an unique identifier.
   *
   * @method fetch
   * @param {Object} data Records attributes hash
   * @return {String} Unique identifier
   * @public
   */
  fetch() {
    let id;

    while (id === undefined) {
      let randomString = generatePassphrase().substring(0, 10);
      if (this._ids[randomString] === undefined) {
        id = randomString;
      }
    }

    this._ids[id] = true;

    return id;
  }

  /**
   * Register an identifier.
   * Must throw if identifier is already used.
   *
   * @method set
   * @param {String|Number} id
   * @public
   */
  set(id) {
    if (typeof this._ids[id] !== 'undefined') {
      throw new Error(`Id {id} is already used.`);
    }

    this._ids[id] = true;
  }

  /**
   * Reset identity manager.
   *
   * @method reset
   * @public
   */
  reset() {
    this._ids = {};
  }
}
