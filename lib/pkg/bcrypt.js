import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

export class Bcrypt {

  constructor() {
    this.saltPrefix = '2a';
    this.saltLength = 22;
    this.defaultCost = 14;
  };

  hash(string, cost = null) {
   
    if (!cost) {
      cost = this.defaultCost;
    }

    const salt = this.generate_random_salt();

   
    const hashString = this.generate_hash_string(parseInt(cost), salt);

    return bcrypt.hashSync(string, hashString);
  };

  verify(password, hash) {
    return bcrypt.compareSync(password, hash);
  };

  generate_random_salt() {
    // Salt seed
    const seed = v4();

    // Generate salt
    let salt = Buffer.from(seed).toString('base64');
    salt = salt.replace(/\+/g, '.');

    return salt.substring(0, this.saltLength);
  };

  generate_hash_string(cost, salt) {
    return '$' + this.saltPrefix + '$' + ('0' + cost).slice(-2) + '$' + salt + '$';
  };
  
};