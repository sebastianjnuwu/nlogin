---

# nLogin-js

<p align="center">
  <img alt="logo" src="https://392013314-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FKVum4E4GDZV1mBUNLw4i%2Fuploads%2FLOdi7QbjHbbfwqtjr1CX%2Fimage.png?alt=media&token=0d2f861d-fb86-4afe-a0d9-bed902f80a7a" width="72%"  />
  <br>
  <i>"nLogin is an authentication system used by the biggest servers in Brazil now in JavaScript!"</i>
</p>

## Overview

`nlogin-js` creates and verifies password hashes in the same formats used by the
[nLogin](https://www.nickuc.com/) plugin and by
[nLogin-Web](https://github.com/nickuc-com/nLogin-Web). The algorithm is read
from the hash itself, so hashes already stored in your `nlogin` table work as is.

## Installation

```sh
npm install nlogin-js
```

```sh
yarn add nlogin-js
```

## Usage

```js
import { Nlogin } from 'nlogin-js';

const login = new Nlogin();

const hash = login.$create('my password');       // bcrypt (default)
login.$password(hash, 'my password');            // true
login.$password(hash, 'wrong');                  // false
```

## Supported algorithms

| Type passed to `$create`  | Hash written to the database |
| ------------------------- | ---------------------------- |
| `bcrypt` (default)        | `$2a$10$...`                 |
| `SHA` (AuthMe)            | `$SHA$<salt>$<hash>$AUTHME`  |
| `SHA256`                  | `$SHA256$<hash>$<salt>`      |
| `SHA512`                  | `$SHA512$<hash>$<salt>`      |
| `PBKDF2`                  | `$PBKDF2$<iterations>$...`   |

## API

### `new Nlogin(options)`

```js
new Nlogin();                  // bcrypt cost 10
new Nlogin(12);                // bcrypt cost 12
new Nlogin({ cost: 12 });
```

### Methods

| Method | Description |
| ------ | ----------- |
| `$create(password, type?)` | Creates a hash synchronously. |
| `$createAsync(password, type?)` | Asynchronous version of `$create`. |
| `$password(hash, password)` | Verifies synchronously. |
| `$passwordAsync(hash, password)` | Asynchronous version of `$password`. |
| `$type(hash)` | Returns the algorithm read from the hash (`2A`, `SHA`, ...). |
| `$needsRehash(hash, allowDowngrade?)` | `true` when the hash uses settings weaker than the configured ones. |

```js
login.$type('$SHA256$abc$salt');                  // 'SHA256'
login.$needsRehash('$2a$14$...');                 // true  (weaker than cost 10)
login.$needsRehash('$2a$14$...', true);           // true  (allow downgrade)
```

## nLogin compatibility

The hashes follow the same format used by the plugin, so nothing needs to be
migrated. See [CHANGELOG.md](./CHANGELOG.md) for the list of changes in 2.1.0.

## License

[Apache-2.0](./LICENSE)
