import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

/**
 * Cria um hash para a string fornecida usando o bcrypt.
 * 
 * 1. Gera um salt aleatório.
 * 2. Cria uma string de hash usando o prefixo do salt e o custo especificado.
 * 3. Retorna o hash resultante.
 * 
 * @param {string} string - A string a ser hash.
 * @param {number} [cost=this.defaultCost] - O fator de custo para o hash.
 * @returns {string} O hash resultante.
 */

/**
 * Verifica se a senha fornecida corresponde ao hash.
 * 
 * 1. Compara a senha fornecida com o hash.
 * 2. Retorna verdadeiro se a senha corresponder ao hash, caso contrário, retorna falso.
 * 
 * @param {string} password - A senha a ser verificada.
 * @param {string} hash - O hash contra o qual a senha será verificada.
 * @returns {boolean} Verdadeiro se a senha corresponder ao hash, falso caso contrário.
 */

/**
 * Gera um salt aleatório para uso no hashing.
 * 
 * 1. Gera uma string base64 a partir de um UUID.
 * 2. Substitui os caracteres '+' por '.' e ajusta o comprimento do salt.
 * 3. Retorna o salt gerado.
 * 
 * @returns {string} O salt gerado.
 */
 
export class Bcrypt {

  constructor() {
    this.saltPrefix = '2a';
    this.defaultCost = 14;
  };

  hash(string, cost = this.defaultCost) {
    const salt = this.generateRandomSalt();
    const hashString = `$${this.saltPrefix}$${cost.toString().padStart(2, '0')}$${salt}$`;
    return bcrypt.hashSync(string, hashString);
  };

  verify(password, hash) {
    return bcrypt.compareSync(password, hash);
  };

  generateRandomSalt() {
    const salt = Buffer.from(v4()).toString('base64').replace(/\+/g, '.');
    return salt.substring(0, 22);
  };
};