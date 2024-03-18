import crypto from 'crypto';

export class SHA256 {

  constructor() {
    this.CHARS = this.initCharRange();
    this.SALT_LENGTH = 24;
  }

  hash(password) {
    const salt = this.generateSalt();
    return '$SHA256$' + this.sha256(this.sha256(password) + salt) + '$' + salt;
  }

  verify(password, hash) {
    const parts = hash.split('$');
    const partsLength = parts.length;
    switch (partsLength) {
      case 3: // old format
        const saltParts = hash.split('@');
        const salt = saltParts[1];
        return parts[2] + '@' + salt === this.sha256(this.sha256(password) + salt);

      case 4: // new format
        return parts[2] === this.sha256(this.sha256(password) + parts[3]);

      default:
        throw new Error("invalid hash parts length! length=" + partsLength + ', raw="' + hash + '"');
    }
  }

  generateSalt() {
    const maxCharIndex = this.CHARS.length - 1;
    let salt = '';
    for (let i = 0; i < this.SALT_LENGTH; ++i) {
      salt += this.CHARS[Math.floor(Math.random() * (maxCharIndex + 1))];
    }
    return salt;
  }

  initCharRange() {
    let chars = '';
    for (let i = 65; i <= 90; i++) {
      chars += String.fromCharCode(i); // uppercase letters A-Z
    }
    for (let i = 0; i <= 9; i++) {
      chars += i.toString(); // digits 0-9
    }
    return chars;
  }

  sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}