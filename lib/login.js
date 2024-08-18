import { Bcrypt } from '#hash/bcrypt';
import { AuthMe } from '#hash/authme';
import { SHA256 } from '#hash/sha256';
import { SHA512 } from '#hash/sha512';
import { PBKDF2 } from '#hash/pbkdf2';

/**
 * Classe que gerencia diferentes algoritmos de hashing e verificação de senhas.
 */

/**
 * Verifica se a senha fornecida corresponde ao hash usando o tipo de hash especificado.
 * 
 * @param {string} hash - O hash da senha a ser verificado.
 * @param {string} password - A senha fornecida para verificação.
 * @returns {boolean} - Retorna verdadeiro se a senha corresponder ao hash, caso contrário, falso.
 */

/**
 * Cria um hash para a senha fornecida usando o tipo de hash especificado.
 * 
 * @param {string} password - A senha a ser hashada.
 * @param {string} type - O tipo de hash a ser usado.
 * @returns {Promise<string>} - Retorna uma promessa que resolve para o hash da senha.
 */
 
export class Nlogin {

  constructor() {
    this.bcrypt = new Bcrypt();
    this.authme = new AuthMe();
    this.sha256 = new SHA256();
    this.sha512 = new SHA512();
    this.pbkdf2 = new PBKDF2();
  };

  $password(hash, password) {
    
    const type = (hash.includes("$") ? hash.split("$")[1] : '').toUpperCase();
    
    switch (type) {
        case '2':
        case '2A':
          return this.bcrypt.verify(password, hash);
        break;
        
        case 'PBKDF2':
          return this.pbkdf2.verify(password, hash);
        break;
        
        case 'SHA256':
          return this.sha256.verify(password, hash);
        break;
        
        case 'SHA512':
          return this.sha512.verify(password, hash);
        break;
        
        case 'SHA':
          return this.authme.verify(password, hash);
        break;
        
        default:
          return false;
    };
  };

  $create(password, type) {
    
    switch (type) {
        case 'PBKDF2':
          return this.pbkdf2.hash(password);
        break;
        
        case 'SHA256':
          return this.sha256.hash(password);
        break;
        
        case 'SHA512':
          return this.sha512.hash(password);
        break;

        case 'SHA':
          return this.authme.hash(password);
        break;

        default:
          return this.bcrypt.hash(password);
    };
  };

};