import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sprintf from 'sprintf-js';
import uniqid from 'uniqid';

function cryptoRandomNumber(min, max) {
    const argc = arguments.length;
    if (argc === 0) {
      min = 0
      max = 2147483647
    } else if (argc === 1) {
      throw new Error('Warning: cryptoRandomNumber() expects exactly 2 parameters, 1 given')
    } else {
      min = parseInt(min, 10)
      max = parseInt(max, 10)
    }
    var distance = max - min;
    if (min >= max) {
      throw new Error('Warning: cryptoRandomNumber() minimum number should be less than maximum');
    } else if (distance > 281474976710655) {
      throw new Error('Warning: cryptoRandomNumber() range is greater than 256^6-1');
    } else if (max > Number.MAX_SAFE_INTEGER) {
      throw new Error('Warning: cryptoRandomNumber() maximum number should be safe integer limit');
    } else {
      var maxBytes = 6;
      var maxDec = 281474976710656;
      
      // To avoid huge mathematical operations and increase function performance for small ranges
      if (distance < 256) {
        maxBytes = 1;
        maxDec = 256;
      } else if (distance < 65536) {
        maxBytes = 2;
        maxDec = 65536;
      } else if (distance < 16777216) {
        maxBytes = 3;
        maxDec = 16777216;
      } else if (distance < 4294967296) {
        maxBytes = 4;
        maxDec = 4294967296;
      } else if (distance < 1099511627776) {
        maxBytes = 4;
        maxDec = 1099511627776;
      }
	
      var randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
      var result = Math.floor(randbytes/maxDec*(max-min+1)+min);
		
      if (result > max) {
         result = max;
      }
      return result;
    }
}
  
class Algorithm{
    hash(passwd){}
    isValid(passwd, hash){}
}
const SALT_LENGTH = 16;
function hash(method, passwd){
    return crypto.createHash(method).update(passwd).digest('hex')
}
function sha256(passwd){
    return hash("sha256", passwd);
}
function crypt(passwd,salt){
    return bcrypt.hashSync(passwd,salt);
}
const saltPrefix = "2a";
const defaultCost = 14;
const bcryptSaltLength = 22;
function base64_encode(str){
    return Buffer.from(str,"base64").toString();
}
class BCrypt extends Algorithm{
    generateRandomSalt(){
        const seed  = uniqid(cryptoRandomNumber())
        var salt = base64_encode(seed)
        salt.replace("+", ".")
        return salt.substr(0, bcryptSaltLength)
    }
    hash(passwd, cost = null){
        if(cost = null){
            cost = defaultCost;
        }
        const salt = this.generateRandomSalt()
        var hashString = this.generateHashString(parseInt(cost), salt)
        return crypt(passwd, hashString)

    }
    hash(passwd){
        hash(passwd,defaultCost)
    }
    isValid(passwd, hash){
        return crypt(passwd, hash) == hash
    }
    generateHashString(cost,salt){
        return sprintf('$%s$%02d$%s$', saltPrefix, cost, salt);

    }
}

class AuthMe extends Algorithm{

    constructor(){
        super()
        
        this.CHARS = AuthMe.initCharRange();
    }
    
    hash(passwd){
        var salt = this.generateSalt()
        return `$SHA$${salt}$${sha256(sha256(passwd) + salt)}$AUTHME`
    }

    isValid(passwd, hash){
        const parts = hash.split("$")
        const count = parts.length
        
        return (count == 4 || count == 5) && parts[3] == sha256(sha256(passwd)+parts[2])
    }
    generateSalt(){
        const maxCharIndex= 15;
        var salt = "";
        for(var i=0; i<SALT_LENGTH; i++){
            salt+=this.CHARS[cryptoRandomNumber(0,maxCharIndex)]
        }
        return salt;
    }

    static initCharRange(){
        return [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"]
    }
}
const sha256chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const sha256saltLength = 24
class SHA256 extends Algorithm{
    hash(passwd){
        const salt = generateSalt()
        return `$SHA256$${sha256(sha256(passwd) + salt)}$${salt}`
    }
    generateSalt(){
        const maxCharIndex = sha256chars.length-1
        var salt = "";
        for(var i=0; i<sha256saltLength; i++){
            salt += sha256chars[cryptoRandomNumber(0,maxCharIndex)]
        }
        return salt
    }
    isValid(passwd, hash){
        var parts = hash.split("$")
        switch(parts.length) {
            case 3:
                var saltParts = hash.split("@");
                var salt = saltParts[1];
                return parts[2] + "@" + salt == sha256(sha256(passwd)+salt)
            case 4:
                return parts[2] == sha256(sha256(passwd)+parts[3])
            default:
                return false
        }
    }
}

export default {
    Algorithm,
    AuthMe,
    BCrypt,
    SHA256
};