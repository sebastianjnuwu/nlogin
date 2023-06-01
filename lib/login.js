import cryptography from '#hash';

class nlogin {

  constructor(sequelize, callback) {
    this.bcrypt = new cryptography.BCrypt();
    this.sha256 = new cryptography.SHA256();
    this.authme = new cryptography.AuthMe();
    this.db = sequelize;
  };

  async password(username, callback) {
    username = username.trim();
    let result = await this.db.query(`select password from nlogin where name = '${username.toLowerCase()}' limit 1`)

    if(result[0]?.[0] == undefined) return callback(false);

    callback(result[0]?.[0].password);
  };

  async uuid(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT uniqueId FROM nlogin WHERE name = '${username.toLowerCase()}' LIMIT 1`);

    if(!result[0]?.[0]?.uniqueId) return callback(false);

    callback(result[0]?.[0].uniqueId.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5"));
  };
  
  async get_email(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT email FROM nlogin WHERE name = '${username.toLowerCase()}' LIMIT 1`);

    if(!result[0]?.[0]?.email) return callback(false);

    callback(result[0]?.[0].email);
  };

  async set_email(username, email, callback) {

    username = username.trim();

    const result = await this.db.query(`UPDATE nlogin SET email = '${email}' WHERE name = '${username.toLowerCase()}'`);

    if(result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };

  async get_ip(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT address FROM nlogin WHERE name = '${username.toLowerCase()}' LIMIT 1`);

    if(!result[0]?.[0]?.address) return callback(false);

    callback(result[0]?.[0].address);
  };

  async set_ip(username, ip, callback) {

    username = username.trim();

    const result = await this.db.query(`UPDATE nlogin SET address = '${ip}' WHERE name = '${username.toLowerCase()}'`);

    if(result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };

  async get_discord(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT discord FROM nlogin WHERE name = '${username.toLowerCase()}' LIMIT 1`);

    if(!result[0]?.[0]?.discord) return callback(false);

    callback(result[0]?.[0].discord);
  };

  async set_discord(username, discord, callback) {

    username = username.trim();
    
    if (typeof discord !== 'number') {
    throw new Error("The discord id needs to be a number!");
  }
  
    const result = await this.db.query(`UPDATE nlogin SET discord = '${discord}' WHERE name = '${username.toLowerCase()}'`);

    if(result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };
  
  async get_twitter(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT twitter FROM nlogin WHERE name = '${username.toLowerCase()}' LIMIT 1`);

    if(!result[0]?.[0]?.twitter) return callback(false);

    callback(result[0]?.[0].twitter);
  };
  
  async set_twitter(username, twitter, callback) {

    username = username.trim();
  
    const result = await this.db.query(`UPDATE nlogin SET twitter = '${twitter}' WHERE name = '${username.toLowerCase()}'`);

    if(result[0] && result[0].affectedRows > 0) {
      callback(true);
    } else {
      callback(false);
    }
  };
  
  async info(username, callback) {

    username = username.trim();

    const result = await this.db.query(`SELECT * FROM nlogin WHERE name = '${username.toLowerCase()}' LIMIT 1`);

    if(!result[0]?.[0]) return callback(false);

    callback(result[0]?.[0]);
  };

  login(username, password, callback) {
    this.password(username, (hash) => {
      if(hash) {
        const type_hash = this.detected(hash);
        if(type_hash) {
          callback(type_hash.isValid(password, hash))
        }
      } else callback(false)

    });

  };

  detected(pass_hash) {
    const type_hash = (pass_hash.includes("$") ? pass_hash.split("$")[1] : '').toUpperCase();
    switch(type_hash) {
      case '2':
      case '2A':
        return this.bcrypt;

      case "PBKDF2":
        // will be added
        throw new Error("PBKDF2 is not supported yet");

      case "ARGON2I":
        // will be added
        throw new Error("ARGON2I is not supported yet");

      case "SHA256":
        return this.sha256;

      case "SHA":
        return this.authme;

      default:
        throw new Error("Unknown algorithm");
    }
  };

  hash(pass) {
    return this.bcrypt.hash(pass);
  };

};

export default nlogin;