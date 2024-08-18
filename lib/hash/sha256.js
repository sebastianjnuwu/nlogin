import crypto from 'crypto';

/**
 * Inicializa a classe SHA256 com o conjunto de caracteres e comprimento do salt.
 */

/**
 * Cria um hash para a senha fornecida usando SHA-256.
 * 
 * 1. Gera um salt aleatório.
 * 2. Cria um hash usando SHA-256 aplicado duas vezes à combinação da senha e do salt.
 * 3. Retorna o hash formatado com o prefixo '$SHA256$' seguido pelo hash e o salt.
 * 
 * @param {string} password - A senha a ser hash.
 * @returns {string} O hash resultante.
 */

/**
 * Verifica se a senha fornecida corresponde ao hash.
 * 
 * 1. Separa o hash em partes usando '$' como delimitador.
 * 2. Verifica se a senha corresponde ao hash usando o salt extraído.
 * 3. Lança um erro se o comprimento das partes for inválido.
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
 * 1. Adiciona letras maiúsculas de A a Z e dígitos de 0 a 9.
 * 
 * @returns {string} O conjunto de caracteres permitido.
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
 
export class SHA256 {

  constructor() {
    this.CHARS = this.initCharRange();
    this.SALT_LENGTH = 24;
  }

  hash(password) {
    const salt = this.generateSalt();
    return '$SHA256$' + this.sha256(this.sha256(password) + salt) + '$' + salt;
  }

  verify(password, hash) {
    const parts = hash.split('$');
    const partsLength = parts.length;
    switch (partsLength) {
      case 3: // old format
        const saltParts = hash.split('@');
        const salt = saltParts[1];
        return parts[2] + '@' + salt === this.sha256(this.sha256(password) + salt);

      case 4: // new format
        return parts[2] === this.sha256(this.sha256(password) + parts[3]);

      default:
        throw new Error("invalid hash parts length! length=" + partsLength + ', raw="' + hash + '"');
    }
  }

  generateSalt() {
    const maxCharIndex = this.CHARS.length - 1;
    let salt = '';
    for (let i = 0; i < this.SALT_LENGTH; ++i) {
      salt += this.CHARS[Math.floor(Math.random() * (maxCharIndex + 1))];
    }
    return salt;
  }

  initCharRange() {
    let chars = '';
    for (let i = 65; i <= 90; i++) {
      chars += String.fromCharCode(i); // uppercase letters A-Z
    }
    for (let i = 0; i <= 9; i++) {
      chars += i.toString(); // digits 0-9
    }
    return chars;
  }

  sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
  }
};