import { Bcrypt } from '#pkg/bcrypt'
import { AuthMe } from '#pkg/authme'
import { SHA256 } from '#pkg/sha256'
import { SHA512 } from '#pkg/sha512'

class nlogin {

  constructor(sequelize, log) {
    this.bcrypt = new Bcrypt();
    this.authme = new AuthMe();
    this.sha256 = new SHA256();
    this.sha512 = new SHA256();
    this.db = sequelize;
  };

  async password(username, log) {
    username = username.trim();
    
    try {
  
    let result = await this.db.query(`select password from nlogin where last_name = '${username.toLowerCase()}' limit 1`);

    if (result[0]?.[0] == undefined) return log(false);

    log(result[0]?.[0].password);
    
    } catch(e) {
    return log(false)
  }
  };

  async login(username, password, log) {
    this.password(username, (hash) => {
      if (hash) {
        const type_hash = this.detected(hash);
        if (type_hash) {
          log(type_hash.isValid(password, hash))
        }
      } else log(false)

    });

  };

  async player(username, log) {

    username = username.trim();
   try {
    const result = await this.db.query(`SELECT * FROM nlogin WHERE last_name = '${username.toLowerCase()}' LIMIT 1`);

    if (!result[0]?.[0]) return log(false);

    log(result[0]?.[0]);
   } catch (e) {
     log(false)
   }
  };
  
  async register({ username, password, email, discord }, log) {
    
  if (!username || !password) return log(false);

  const hash = this.bcrypt.hash(password);

  try {
    
  const result = await this.db.query(`
      INSERT INTO nlogin (username, password, email, discord)
      VALUES (:username, :password, :email, :discord)
    `, {
      replacements: {
        username: username.trim(),
        password: hash,
        email: email ? email.trim() : null,
        discord: discord ? discord.trim() : null,
      },
      type: this.db.QueryTypes.INSERT
    });

  if (result[1] === 1) return log(true);
 
  } catch(e) {
    return log(false)
  }
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