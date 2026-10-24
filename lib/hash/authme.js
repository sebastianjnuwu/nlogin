import crypto from 'crypto';

/**
 * AuthMe hashes:
 *
 *   $SHA$<salt>$<sha256(sha256(password) + salt)>$AUTHME
 *
 * The salt contains 16 hex characters (0-9, a-f).
 */

export class AuthMe {

  constructor() {
    this.CHARS = this.initCharRange();
    this.SALT_LENGTH = 16;
  };

  /**
   * @param {string} password
   * @returns {string} the hash
   */
  hash(password) {
    const salt = this.generateSalt();
    return '$SHA$' + salt + '$' + this.sha256(this.sha256(password) + salt) + '$AUTHME';
  };

  /**
   * @param {string} password
   * @param {string} hash
   * @returns {boolean}
   */
  verify(password, hash) {
    const parts = hash.split('$');
    const count = parts.length;
    return (count === 4 || count === 5) && parts[3] === this.sha256(this.sha256(password) + parts[2]);
  };

  /**
   * @returns {string} random salt
   */
  generateSalt() {
    const maxCharIndex = this.CHARS.length - 1;
    let salt = '';
    for (let i = 0; i < this.SALT_LENGTH; ++i) {
      salt += this.CHARS[crypto.randomInt(0, maxCharIndex + 1)];
    }
    return salt;
  };

  /**
   * @returns {string[]} allowed salt characters (0-9, a-f)
   */
  initCharRange() {
    const chars = [];
    for (let i = 48; i <= 57; i++) {
      chars.push(String.fromCharCode(i)); // digits 0-9
    }
    for (let i = 97; i <= 102; i++) {
      chars.push(String.fromCharCode(i)); // lowercase letters a-f
    }
    return chars;
  };

  /**
   * @param {string} input
   * @returns {string} SHA-256 hex digest
   */
  sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
  };

};
