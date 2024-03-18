import crypto from 'crypto';

export class AuthMe {

  constructor() {
    this.CHARS = this.initCharRange();
    this.SALT_LENGTH = 16;
  }

  hash(password) {
    const salt = this.generateSalt();
    return '$SHA$' + salt + '$' + this.sha256(this.sha256(password) + salt) + '$AUTHME';
  };

  verify(password, hash) {
    const parts = hash.split('$');
    const count = parts.length;
    return (count === 4 || count === 5) && parts[3] === this.sha256(this.sha256(password) + parts[2]);
  };

  generateSalt() {
    const maxCharIndex = this.CHARS.length - 1;
    let salt = '';
    for (let i = 0; i < this.SALT_LENGTH; ++i) {
      salt += this.CHARS[Math.floor(Math.random() * (maxCharIndex + 1))];
    }
    return salt;
  };

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

  sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
  };
  
};
