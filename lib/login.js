import { Bcrypt } from '#pkg/bcrypt'
import { AuthMe } from '#pkg/authme'
import { SHA256 } from '#pkg/sha256'
import { SHA512 } from '#pkg/sha512'

class nlogin {

  constructor(sequelize, callback) {
    this.bcrypt = new Bcrypt();
    this.authme = new AuthMe();
    this.sha256 = new SHA256();
    this.sha512 = new SHA256();
    this.db = sequelize;
  };
  
   // perform player login 
  async login(nickname, password, callback) {
    
   this.password(nickname, (hash) => {
     if (hash) {
      const type_hash = this.detected(hash);
     if (type_hash) {
      return callback(type_hash.verify(password, hash));
     };
      } else {
        return callback(false);
      };

    });

  };
  
   // searches for player's encrypted password 
  async password(nickname, callback) {
    
   try {
  
    const search = await this.db.query(`select password from nlogin where last_name = '${nickname.toLowerCase()}' limit 1`);

    if (search[0]?.[0] == undefined) {
      return callback(false);
    };

    return callback(search[0]?.[0].password);
    
    } catch(err) {
      console.log(err.message)
      return callback(false);
    }
  };
  
   // register the player
  async register({ nickname, password, email, discord }, callback) {
    
  if (!nickname || !password) {
    return callback(false);
  };

  const hash = this.hash(password);

  try {
    
    this.password(nickname, async(encrypt) => { 
      
      if (!encrypt) {
        
        const search = await this.db.query(`
      INSERT INTO nlogin (last_name, password, email, discord)
      VALUES (:nickname, :password, :email, :discord)
    `, {
      replacements: {
        nickname: nickname.toLowerCase(),
        password: hash,
        email: email ? email.trim() : null,
        discord: discord ? discord.trim() : null,
      },
      type: this.db.QueryTypes.INSERT
    });
        
        if (search[1] === 1) {
          return callback(true);
        };
        
      } else {
        return callback(false);
      }
      
    });
  
 
  } catch(err) {
    console.log(err.message);
    return callback(false)
  }
};
  
   // see what encryption is being used
  detected(encrypted) {

    const type_hash = (encrypted.includes("$") ? encrypted.split("$")[1]: '').toUpperCase();

    switch (type_hash) {
      case '2':
      case '2A':
        return this.bcrypt;

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
   
   // encrypt player password 
  hash(password) {
    return this.bcrypt.hash(password);
  };
  
};

export default nlogin;