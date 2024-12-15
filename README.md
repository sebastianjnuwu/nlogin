
---

# nLogin-js

<p align="center">
  <img alt="logo" src="https://392013314-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FKVum4E4GDZV1mBUNLw4i%2Fuploads%2FLOdi7QbjHbbfwqtjr1CX%2Fimage.png?alt=media&token=0d2f861d-fb86-4afe-a0d9-bed902f80a7a" width="72%"  />
  <br>
  <i>"nLogin is an authentication system used by the biggest servers in Brazil now in JavaScript!"</i>
</p>

## Overview

`nLogin-js` is a JavaScript library that provides various hashing algorithms for secure password management. It is inspired by the popular nLogin system used in major servers in Brazil. This library supports multiple hashing techniques including bcrypt, PBKDF2, SHA256, SHA512, and more.

## Installation

To install `nlogin-js`, use npm or yarn:

```sh
npm install nlogin-js
```

or

```sh
yarn add nlogin-js
```

## Usage

Here's a quick example of how to use `nlogin-js`:

```js
import { Nlogin } from "nlogin-js";

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
```

## API

### `Nlogin` Class

#### Constructor

- `new Nlogin()`: Creates a new instance of the `Nlogin` class.

#### Methods

- `.$create(password: string, type?: string): Promise<string>`
  - Creates a hash for the provided password. Default hashing type is `bcrypt`. Acceptable values for `type` include `'PBKDF2'`, `'SHA256'`, `'SHA512'`, `'SHA'`, or defaults to `'bcrypt'`.

- `.$password(hash: string, password: string): Promise<boolean>`
  - Verifies if the provided password matches the hash. The hash type is inferred from the hash string and can be `'PBKDF2'`, `'SHA256'`, `'SHA512'`, `'SHA'`, or `'bcrypt'`.

---

<strong style="color: purple">• Ko-fi:</strong> Buy the developer a coffee [here!](https://ko-fi.com/sebastianjnuwu)

<strong style="color: purple">• Sponsor:</strong> Support this project by clicking [here.](https://github.com/sponsors/sebastianjnuwu)

<strong style="color: purple">• Open source:</strong> Click [here!](https://github.com/sebastianjnuwu/nlogin)
