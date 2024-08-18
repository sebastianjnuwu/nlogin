import crypto from 'crypto';

/**
 * Classe PBKDF2 para gerar e verificar hashes.
 */
 
/**
 * Construtor define as iterações, o comprimento da chave e o algoritmo de digestão.
 */

/**
 * Gera um hash para a senha fornecida, incluindo o salt.
 * @param {string} password - A senha a ser hasheada.
 * @returns {string} - O hash gerado no formato PBKDF2.
 */

/**
 * Verifica se a senha fornecida corresponde ao hash armazenado.
 * @param {string} password - A senha a ser verificada.
 * @param {string} hash - O hash armazenado para comparação.
 * @returns {boolean} - Verdadeiro se a senha corresponder ao hash, falso caso contrário.
 */

/**
 * Separa o hash em partes e realiza a verificação da senha.
 * @param {string} password - A senha a ser verificada.
 * @param {string} hash - O hash armazenado para comparação.
 * @returns {boolean} - Verdadeiro se a senha corresponder ao hash, falso caso contrário.
 */
 
export class PBKDF2 {
  constructor() {
    this.iterations = 10;
    this.keyLength = 16;
    this.digest = 'sha512';
  }

  hash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest).toString('hex');
    return `$PBKDF2$${this.iterations}$${salt}$${hash}`;
  }

  verify(password, hash) {
    const parts = hash.split('$');
    const iterations = parseInt(parts[2]);
    const salt = parts[3];
    const originalHash = parts[4];
    const hashToCompare = crypto.pbkdf2Sync(password, salt, iterations, this.keyLength, this.digest).toString('hex');
    return originalHash === hashToCompare;
  }
};