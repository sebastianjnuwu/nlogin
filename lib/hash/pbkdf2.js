import crypto from 'crypto';

/**
 * PBKDF2 hashes in the nLogin format:
 *
 *   $PBKDF2$<iterations>$<salt hex>$<hash hex>
 *
 * The digest and the key length are fixed; the iteration count is read from
 * the hash when verifying, so old hashes with fewer iterations still work.
 */

export class PBKDF2 {
  constructor() {
    this.iterations = 100000;
    this.keyLength = 16;
    this.digest = 'sha512';
  }

  /**
   * @param {string} password
   * @returns {string} the hash
   */
  hash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest).toString('hex');
    return `$PBKDF2$${this.iterations}$${salt}$${hash}`;
  }

  /**
   * @param {string} password
   * @param {string} hash
   * @returns {boolean}
   */
  verify(password, hash) {
    const parts = hash.split('$');
    const iterations = parseInt(parts[2]);
    const salt = parts[3];
    const originalHash = parts[4];
    const hashToCompare = crypto.pbkdf2Sync(password, salt, iterations, this.keyLength, this.digest).toString('hex');
    return originalHash === hashToCompare;
  }

  /**
   * Async version of `hash` (uses libuv's thread pool).
   * @param {string} password
   * @returns {Promise<string>}
   */
  hashAsync(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, this.iterations, this.keyLength, this.digest, (err, derived) => {
        if (err) return reject(err);
        resolve(`$PBKDF2$${this.iterations}$${salt}$${derived.toString('hex')}`)
      });
    });
  }

  /**
   * Async version of `verify`.
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  verifyAsync(password, hash) {
    return new Promise((resolve, reject) => {
      const parts = hash.split('$');
      const iterations = parseInt(parts[2]);
      const salt = parts[3];
      const originalHash = parts[4];
      crypto.pbkdf2(password, salt, iterations, this.keyLength, this.digest, (err, derived) => {
        if (err) return reject(err);
        resolve(originalHash === derived.toString('hex'));
      });
    });
  }
};
