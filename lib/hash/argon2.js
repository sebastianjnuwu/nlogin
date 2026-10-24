import crypto from 'crypto';
import { argon2id, argon2i, argon2d, argon2Verify } from 'hash-wasm';

/**
 * Argon2 (id, i and d variants) in the PHC format, the same one used by
 * nLogin:
 *
 *   $argon2id$v=19$m=65536,t=10,p=1$<salt>$<hash>
 *
 * hash-wasm is async, so the methods here return a Promise.
 *
 * nLogin's own defaults (Argon2 section of its config.yml) are
 * m=65536 (64 MiB), t=10 and p=1. They can be mirrored with
 * `new Nlogin({ argon2: { memorySize: 65536, iterations: 10 } })`, but keep
 * in mind that verification in WebAssembly is slower than in Java: those
 * values take ~4 s per hash here.
 */

export class Argon2 {

  /**
   * @param {object} [options]
   * @param {number} [options.memorySize=19456] - Memory in KiB (19 MiB).
   * @param {number} [options.iterations=2] - Time cost.
   * @param {number} [options.parallelism=1] - Threads.
   * @param {number} [options.hashLength=32] - Hash length in bytes.
   * @param {'id'|'i'|'d'} [options.variant='id'] - Variant used by `hash`.
   */
  constructor(options = {}) {
    this.memorySize = options.memorySize ?? 19456;
    this.iterations = options.iterations ?? 2;
    this.parallelism = options.parallelism ?? 1;
    this.hashLength = options.hashLength ?? 32;
    this.variant = (options.variant ?? 'id').toLowerCase();
  };

  /**
   * Creates an Argon2 hash in the PHC format.
   *
   * @param {string} password
   * @param {'id'|'i'|'d'} [variant=this.variant]
   * @returns {Promise<string>}
   */
  async hash(password, variant = this.variant) {
    const options = {
      password,
      salt: crypto.randomBytes(16),
      parallelism: this.parallelism,
      iterations: this.iterations,
      memorySize: this.memorySize,
      hashLength: this.hashLength,
      outputType: 'encoded'
    };

    switch (variant.toLowerCase()) {
      case 'i': return argon2i(options);
      case 'd': return argon2d(options);
      default: return argon2id(options);
    };
  };

  /**
   * Verifies a password against an Argon2 hash (any variant).
   *
   * The parameters (m, t, p) are read from the hash itself, so hashes
   * created by nLogin with other settings still verify correctly.
   *
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async verify(password, hash) {
    return argon2Verify({ password, hash });
  };

  /**
   * Reads the variant and the parameters from a PHC hash.
   *
   * @param {string} hash - e.g. `$argon2id$v=19$m=65536,t=10,p=1$salt$hash`
   * @returns {{variant: string, version: string, memorySize: number,
   *   iterations: number, parallelism: number, salt: string, hash: string}|null}
   */
  parse(hash) {
    const parts = hash.split('$');
    const variant = (parts[1] || '').toLowerCase().replace('argon2', '');
    if (!['id', 'i', 'd'].includes(variant)) return null;

    const params = {};
    for (const pair of (parts[3] || '').split(',')) {
      const [key, value] = pair.split('=');
      params[key] = parseInt(value, 10);
    };

    return {
      variant,
      version: parts[2],
      memorySize: params.m,
      iterations: params.t,
      parallelism: params.p,
      salt: parts[4],
      hash: parts[5]
    };
  };

  /**
   * Tells whether a hash was created with settings different from the ones
   * configured here.
   *
   * By default only weaker hashes (less memory, fewer iterations or fewer
   * threads) are reported. Pass `true` as `allowDowngrade` to also report
   * hashes that are stronger than the configured settings.
   *
   * @param {string} hash
   * @param {boolean} [allowDowngrade=false]
   * @returns {boolean}
   */
  needsRehash(hash, allowDowngrade = false) {
    const parsed = this.parse(hash);
    if (!parsed) return false;

    const differs =
      parsed.variant !== this.variant ||
      parsed.memorySize !== this.memorySize ||
      parsed.iterations !== this.iterations ||
      parsed.parallelism !== this.parallelism;

    if (allowDowngrade) return differs;

    return parsed.memorySize < this.memorySize ||
      parsed.iterations < this.iterations ||
      parsed.parallelism < this.parallelism;
  };
};
