import crypto from 'crypto';

/**
 * SHA512 hashes:
 *
 *   $SHA512$<hash>$<salt>   (current format)
 *   $SHA512$<hash>@<salt>   (old format, still accepted when verifying)
 *
 * where hash := SHA512(SHA512(password) + salt) and the salt is 24
 * uppercase letters/digits.
 */

export class SHA512 {

  constructor() {
    this.CHARS = this.initCharRange();
    this.SALT_LENGTH = 24;
  };

  /**
   * @param {string} password
   * @returns {string} the hash
   */
  hash(password) {
    const salt = this.generateSalt();
    return '$SHA512$' + this.sha512(this.sha512(password) + salt) + '$' + salt;
  };

  /**
   * @param {string} password
   * @param {string} hash
   * @returns {boolean}
   */
  verify(password, hash) {
    const parts = hash.split('$');
    const partsLength = parts.length;
    switch (partsLength) {
      case 3: // old format
        const saltParts = hash.split('@');
        const salt = saltParts[1];
        return parts[2] + '@' + salt === this.sha512(this.sha512(password) + salt);

      case 4: // current format
        return parts[2] === this.sha512(this.sha512(password) + parts[3]);

      default:
        throw new Error("invalid hash parts length! length=" + partsLength + ', raw="' + hash + '"');
    }
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
   * @returns {string} allowed salt characters (A-Z, 0-9)
   */
  initCharRange() {
    let chars = '';
    for (let i = 65; i <= 90; i++) {
      chars += String.fromCharCode(i); // uppercase letters A-Z
    }
    for (let i = 0; i <= 9; i++) {
      chars += i.toString(); // digits 0-9
    }
    return chars;
  };

  /**
   * @param {string} input
   * @returns {string} SHA512 hex digest
   */
  sha512(input) {
    return crypto.createHash('sha512').update(input).digest('hex');
  };

};
