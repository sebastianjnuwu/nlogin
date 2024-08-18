import crypto from 'crypto';

/**
 * Inicializa AuthMe com o conjunto de caracteres e comprimento do salt.
 */

/**
 * Cria um hash para a senha fornecida usando o método AuthMe.
 * 
 * 1. Gera um salt aleatório.
 * 2. Cria um hash usando SHA-256 aplicado duas vezes à combinação da senha e do salt.
 * 3. Retorna o hash formatado com o prefixo '$SHA$' e o sufixo '$AUTHME'.
 * 
 * @param {string} password - A senha a ser hash.
 * @returns {string} O hash resultante.
 */

/**
 * Verifica se a senha fornecida corresponde ao hash.
 * 
 * 1. Separa o hash em partes usando '$' como delimitador.
 * 2. Verifica se a senha corresponde ao hash usando o salt extraído.
 * 
 * @param {string} password - A senha a ser verificada.
 * @param {string} hash - O hash contra o qual a senha será verificada.
 * @returns {boolean} Verdadeiro se a senha corresponder ao hash, falso caso contrário.
 */

/**
 * Gera um salt aleatório para uso no hashing.
 * 
 * 1. Seleciona caracteres aleatórios do conjunto predefinido.
 * 2. Gera um salt de comprimento fixo.
 * 
 * @returns {string} O salt gerado.
 */

/**
 * Inicializa o conjunto de caracteres permitidos para o salt.
 * 
 * 1. Adiciona dígitos de 0 a 9 e letras minúsculas de a a f.
 * 
 * @returns {string[]} O conjunto de caracteres permitido.
 */

/**
 * Calcula o hash SHA-256 de uma entrada.
 * 
 * 1. Cria um hash SHA-256 da entrada.
 * 2. Retorna o hash em formato hexadecimal.
 * 
 * @param {string} input - A entrada a ser hasheada.
 * @returns {string} O hash SHA-256 da entrada.
 */
 
export class AuthMe {

  constructor() {
    this.CHARS = this.initCharRange();
    this.SALT_LENGTH = 16;
  };

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