import {
  Bcrypt
} from './pkg/bcrypt.js'
import {
  AuthMe
} from './pkg/authme.js'
import {
  SHA256
} from './pkg/sha256.js'
import {
  SHA512
} from './pkg/sha512.js'

class nlogin {

  constructor(sequelize, callback) {
    this.bcrypt = new BCrypt();
    this.authme = new AuthMe();
    this.sha256 = new SHA256();
    this.sha512 = new SHA256();
    this.db = sequelize;
  };

  async password(username, callback) {
    username = username.trim();
    let result = await this.db.query(`select password from nlogin where last_name = '${username.toLowerCase()}' limit 1`)

    if (result[0]?.[0] == undefined) return callback(false);

    callback(result[0]?.[0].password);
  };

  async uuid(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT unique_id FROM nlogin WHERE last_name = '${username.toLowerCase()}' LIMIT 1`);

    if (!result[0]?.[0]?.unique_id) return callback(false);

    callback(result[0]?.[0].unique_id.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5"));
  };

  async get_email(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT email FROM nlogin WHERE last_name = '${username.toLowerCase()}' LIMIT 1`);

    if (!result[0]?.[0]?.email) return callback(false);

    callback(result[0]?.[0].email);
  };

  async set_email(username, email, callback) {

    username = username.trim();

    const result = await this.db.query(`UPDATE nlogin SET email = '${email}' WHERE last_name = '${username.toLowerCase()}'`);

    if (result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };

  async get_ip(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT last_ip FROM nlogin WHERE last_name = '${username.toLowerCase()}' LIMIT 1`);

    if (!result[0]?.[0]?.address) return callback(false);

    callback(result[0]?.[0].address);
  };

  async set_ip(username, ip, callback) {

    username = username.trim();

    const result = await this.db.query(`UPDATE nlogin SET last_ip = '${ip}' WHERE last_name = '${username.toLowerCase()}'`);

    if (result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };

  async get_discord(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT discord FROM nlogin WHERE last_name = '${username.toLowerCase()}' LIMIT 1`);

    if (!result[0]?.[0]?.discord) return callback(false);

    callback(result[0]?.[0].discord);
  };

  async set_discord(username, discord, callback) {

    username = username.trim();

    if (typeof discord !== 'number') {
      throw new Error("The discord id needs to be a number!");
    }

    const result = await this.db.query(`UPDATE nlogin SET discord = '${discord}' WHERE last_name = '${username.toLowerCase()}'`);

    if (result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };

  async info(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT * FROM nlogin WHERE last_name = '${username.toLowerCase()}' LIMIT 1`);

    if (!result[0]?.[0]) return callback(false);

    callback(result[0]?.[0]);
  };
  
  async register(username, password, callback) {
  if (!username || !password) return false;

  const hash = this.bcrypt.hash(password);

  try {
    const result = await sequelize.query(`
      INSERT INTO nlogin (last_name, password)
      VALUES (:username, :password)
      `, {
        replacements: {
          username: username.trim(), password: hash,
        },
        type: sequelize.QueryTypes.INSERT
      });

    if (result[1] === 1) return callback(true);

  } catch (e) {
    return callback(false);
  };

}

  login(username, password, callback) {
    this.password(username, (hash) => {
      if (hash) {
        const type_hash = this.detected(hash);
        if (type_hash) {
          callback(type_hash.isValid(password, hash))
        }
      } else callback(false)

    });

  };

  detected(pass_hash) {

    const type_hash = (pass_hash.includes("$") ? pass_hash.split("$")[1]: '').toUpperCase();

    switch (algo) {
      case '2':
      case '2A':
        return this.bcrypt ;

      case "SHA256":
        return this.sha256;

      case "SHA512":
        return this.sha512;

      case "SHA":
        return this.authme;

      default:
        return null;
    }


  };

  hash(pass) {
    return this.bcrypt.hash(pass);
  };

};

export default nlogin;