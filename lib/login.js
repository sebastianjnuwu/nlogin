import { Bcrypt } from '#hash/bcrypt';
import { AuthMe } from '#hash/authme';
import { SHA256 } from '#hash/sha256';
import { SHA512 } from '#hash/sha512';
import { PBKDF2 } from '#hash/pbkdf2';
import { Argon2 } from '#hash/argon2';

/**
 * Handles the supported hashing algorithms and password verification.
 *
 * Performance note: bcrypt at a high cost in pure JavaScript (bcryptjs) is
 * slow (~5 s at cost 14). The default cost here is 10. The "*Async" methods
 * return a Promise, but bcryptjs still runs on the same CPU/thread.
 */

export class Nlogin {

  /**
   * @param {number|{cost?: number, argon2?: object}} [options=10] - bcrypt cost
   *   (or an options object with `cost` and Argon2 settings).
   */
  constructor(options = 10) {
    const cost = typeof options === 'number' ? options : (options?.cost ?? 10);
    this.cost = cost;
    this.bcrypt = new Bcrypt(cost);
    this.authme = new AuthMe();
    this.sha256 = new SHA256();
    this.sha512 = new SHA512();
    this.pbkdf2 = new PBKDF2();
    this.argon2 = new Argon2(options?.argon2);
  };

  /**
   * Reads the algorithm from the hash itself.
   *
   * @param {string} hash
   * @returns {string} e.g. '2A', 'SHA256', 'SHA', 'PBKDF2', 'ARGON2ID'
   */
  $type(hash) {
    return (hash.includes("$") ? hash.split("$")[1] : '').toUpperCase();
  };

  /**
   * Tells whether a hash was created with settings different from the
   * configured ones (bcrypt cost or Argon2 parameters), so it can be
   * rehashed on the next successful login.
   *
   * By default it only reports hashes weaker than the configured settings.
   * Pass `true` as `allowDowngrade` to also rehash stronger hashes (e.g.
   * migrate old cost-14 bcrypt hashes to cost 10).
   *
   * @param {string} hash
   * @param {boolean} [allowDowngrade=false]
   * @returns {boolean}
   */
  $needsRehash(hash, allowDowngrade = false) {
    const type = this.$type(hash);
    if (['2', '2A', '2B', '2Y'].includes(type)) {
      const cost = parseInt(hash.split('$')[2], 10);
      if (!Number.isFinite(cost)) return false;
      return cost < this.cost || (allowDowngrade && cost > this.cost);
    }
    if (['ARGON2', 'ARGON2ID', 'ARGON2I', 'ARGON2D'].includes(type)) {
      return this.argon2.needsRehash(hash, allowDowngrade);
    }
    return false;
  };

  /**
   * Verifies a password against a hash (synchronous).
   *
   * Argon2 hashes throw here because the Argon2 implementation is async;
   * use `$passwordAsync` for them.
   *
   * @param {string} hash - The stored password hash.
   * @param {string} password - The plain password to verify.
   * @returns {boolean}
   */
  $password(hash, password) {
    switch (this.$type(hash)) {
      case '2':
      case '2A':
      case '2B':
      case '2Y':
        return this.bcrypt.verify(password, hash);

      case 'PBKDF2':
        return this.pbkdf2.verify(password, hash);

      case 'SHA256':
        return this.sha256.verify(password, hash);

      case 'SHA512':
        return this.sha512.verify(password, hash);

      case 'SHA':
        return this.authme.verify(password, hash);

      case 'ARGON2I':
      case 'ARGON2ID':
      case 'ARGON2D':
        throw new Error('Argon2 hash: use $passwordAsync(hash, password)');

      default:
        return false;
    };
  };

  /**
   * Async version of `$password`. Supports every algorithm, including Argon2.
   *
   * @param {string} hash - The stored password hash.
   * @param {string} password - The plain password to verify.
   * @returns {Promise<boolean>}
   */
  async $passwordAsync(hash, password) {
    switch (this.$type(hash)) {
      case '2':
      case '2A':
      case '2B':
      case '2Y':
        return this.bcrypt.verifyAsync(password, hash);

      case 'PBKDF2':
        return this.pbkdf2.verifyAsync(password, hash);

      case 'SHA256':
        return this.sha256.verify(password, hash);

      case 'SHA512':
        return this.sha512.verify(password, hash);

      case 'SHA':
        return this.authme.verify(password, hash);

      case 'ARGON2I':
      case 'ARGON2ID':
      case 'ARGON2D':
        return this.argon2.verify(password, hash);

      default:
        return false;
    };
  };

  /**
   * Creates a hash for the given password (synchronous).
   *
   * Argon2 throws here; use `$createAsync` with type 'ARGON2ID', 'ARGON2I'
   * or 'ARGON2D'.
   *
   * @param {string} password - The password to hash.
   * @param {string} [type='bcrypt'] - 'PBKDF2', 'SHA256', 'SHA512' or 'SHA'.
   * @returns {string}
   */
  $create(password, type) {
    switch (type) {
      case 'PBKDF2':
        return this.pbkdf2.hash(password);

      case 'SHA256':
        return this.sha256.hash(password);

      case 'SHA512':
        return this.sha512.hash(password);

      case 'SHA':
        return this.authme.hash(password);

      case 'ARGON2I':
      case 'ARGON2ID':
      case 'ARGON2D':
        throw new Error('Argon2 hash: use $createAsync(password, type)');

      default:
        return this.bcrypt.hash(password);
    };
  };

  /**
   * Async version of `$create`. Supports every algorithm, including Argon2.
   *
   * @param {string} password - The password to hash.
   * @param {string} [type='bcrypt'] - 'PBKDF2', 'SHA256', 'SHA512', 'SHA'
   *   or 'ARGON2ID' / 'ARGON2I' / 'ARGON2D'.
   * @returns {Promise<string>}
   */
  async $createAsync(password, type) {
    switch (type) {
      case 'PBKDF2':
        return this.pbkdf2.hashAsync(password);

      case 'SHA256':
        return this.sha256.hash(password);

      case 'SHA512':
        return this.sha512.hash(password);

      case 'SHA':
        return this.authme.hash(password);

      case 'ARGON2':
        return this.argon2.hash(password);

      case 'ARGON2ID':
        return this.argon2.hash(password, 'id');

      case 'ARGON2I':
        return this.argon2.hash(password, 'i');

      case 'ARGON2D':
        return this.argon2.hash(password, 'd');

      default:
        return this.bcrypt.hashAsync(password);
    };
  };

};
