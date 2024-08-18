import { Nlogin } from "../lib/login.js";

/**
 * Creates an instance of the Nlogin class.
 * @type {Nlogin}
 */
const login = new Nlogin();

/**
 * Creates a hash for the provided password using the specified hashing type.
 * If no type is specified, the default is bcrypt.
 * 
 * @param {string} password - The password to be hashed.
 * @param {string} [type='bcrypt'] - The type of hash to be used. Options include 'PBKDF2', 'SHA256', 'SHA512', 'SHA', or default to 'bcrypt'.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
const hash = login.$create('your password');

/**
 * Verifies if the provided password matches the given hash using the type of hash specified in the hash string.
 * 
 * @param {string} hash - The hash of the password.
 * @param {string} password - The password to be verified.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password matches the hash, otherwise false.
 */
const auth2 = login.$password(hash, 'your password');

console.log(hash);
console.log(auth2);
