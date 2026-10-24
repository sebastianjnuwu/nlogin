import bcrypt from 'bcryptjs';

/**
 * bcrypt hashes (bcryptjs is pure JavaScript).
 *
 * The cost is stored inside the hash, so changing the default cost does not
 * break previously stored hashes: they still verify with their own cost.
 */

export class Bcrypt {

  /**
   * @param {number} [cost=10] - bcrypt cost (4 to 31). 10 is the recommended
   * value for logins: cost 14 in bcryptjs takes ~5 s per verification.
   */
  constructor(cost = 10) {
    this.defaultCost = cost;
  };

  /**
   * @param {string} string - The password to hash.
   * @param {number} [cost=this.defaultCost]
   * @returns {string} the hash
   */
  hash(string, cost = this.defaultCost) {
    return bcrypt.hashSync(string, bcrypt.genSaltSync(cost));
  };

  /**
   * @param {string} password
   * @param {string} hash
   * @returns {boolean}
   */
  verify(password, hash) {
    return bcrypt.compareSync(password, hash);
  };

  /**
   * Async version of `hash` (returns a Promise).
   *
   * @param {string} string
   * @param {number} [cost=this.defaultCost]
   * @returns {Promise<string>}
   */
  hashAsync(string, cost = this.defaultCost) {
    return bcrypt.hash(string, bcrypt.genSaltSync(cost));
  };

  /**
   * Async version of `verify` (returns a Promise).
   *
   * Note: bcryptjs is pure JavaScript, so this still uses the same CPU.
   *
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  verifyAsync(password, hash) {
    return bcrypt.compare(password, hash);
  };

};
