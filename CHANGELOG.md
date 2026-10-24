# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Versions before 2.1.0 are not documented here. See the commit history and the
> GitHub releases for details.

## [2.1.0] - 2026-10-24

### Added

- Argon2 support (`ARGON2ID`, `ARGON2I`, `ARGON2D`) using `hash-wasm`, in the
  same PHC format used by nLogin: `$argon2id$v=19$m=19456,t=2,p=1$salt$hash`.
  Parameters are read from the hash when verifying, so hashes created by the
  plugin with other settings (e.g. `m=65536,t=10,p=1`) still verify.
- `Nlogin#$passwordAsync(hash, password)` and `Nlogin#$createAsync(password, type)`
  for every algorithm, including Argon2.
- `Nlogin#$type(hash)` to detect the algorithm from the hash itself.
- `Nlogin#$needsRehash(hash, allowDowngrade)` to support rehashing on login.
  It now also inspects the Argon2 parameters (`m`, `t`, `p` and the variant).
- `Argon2#parse(hash)` and `Argon2#needsRehash(hash, allowDowngrade)`.
- `argon2.variant` option (`'id'`, `'i'` or `'d'`) for `$createAsync(password)`
  without an explicit type.
- `Bcrypt#hashAsync` and `Bcrypt#verifyAsync`.
- `PBKDF2#hashAsync` and `PBKDF2#verifyAsync` (runs on libuv's thread pool).
- Detection of `$2b$` and `$2y$` bcrypt hashes.

### Changed

- **bcrypt default cost changed from 14 to 10.** Cost 14 in pure JavaScript
  takes ~5 s per verification; cost 10 takes ~290 ms. Any other cost can be
  set with `new Nlogin(cost)` or `new Nlogin({ cost })`.
- **PBKDF2 default iterations changed from 10 to 100000.** The iteration count
  is stored in the hash, so existing hashes keep working.
- Argon2 settings are configurable: `new Nlogin({ argon2: { memorySize,
  iterations, parallelism, hashLength, variant } })`. The defaults (`m=19456,
  t=2, p=1`) follow the OWASP recommendation; nLogin's own defaults are
  `m=65536, t=10, p=1`, which take ~4 s per hash in WebAssembly.
- Salt generation for SHA256, SHA512 and AuthMe now uses `crypto.randomInt`
  instead of `Math.random`.
- The README was rewritten in English and kept short: algorithm table, usage,
  API and nLogin compatibility. Migration and performance details live here.

### Fixed

- Removed the `crypto` npm dependency: it is a Node.js built-in and the npm
  package with that name is unrelated.
- Removed the unused `uuid` dependency.
- `$create`/`$password` now handle `$2b$` and `$2y$` hashes.

### Notes

- `bcryptjs` is pure JavaScript, so the async methods return a Promise but
  still use the same CPU thread. The real speed gain comes from the cost.
- Hashes already stored with cost 14 stay slow until they are rehashed. Use
  `$needsRehash(hash, true)` and `$create(password)` on the next successful
  login to migrate them.
- Argon2 is only available through the async methods; the synchronous
  `$create`/`$password` throw for Argon2 hashes instead of returning a wrong
  `false`.

### Migrating from 2.0.x

- bcrypt cost now defaults to `10`. Hashes keep their own cost, so nothing
  breaks; migrate on login with `$needsRehash(hash, true)` + `$create(password)`.
- PBKDF2 iterations now default to `100000`. The iteration count is part of the
  hash, so old hashes still verify.
- Argon2 was added and requires `$createAsync` / `$passwordAsync`.
- The bogus `crypto` dependency and the unused `uuid` dependency were removed.
  Add them explicitly if your project relied on them transitively.

### Performance

Measured on Node.js 22, single core:

| Algorithm / settings         | Hash    | Verify  |
| ---------------------------- | ------- | ------- |
| bcrypt cost 10               | ~380 ms | ~290 ms |
| bcrypt cost 12               | ~1.1 s  | ~1.1 s  |
| bcrypt cost 14               | ~4.7 s  | ~4.9 s  |
| Argon2id m=19456, t=2, p=1   | ~0.4 s  | ~0.4 s  |
| Argon2id m=65536, t=3, p=1   | ~1.5 s  | ~1.5 s  |
| Argon2id m=65536, t=10, p=1  | ~4.0 s  | ~2.5 s  |
| SHA256 / SHA512 / AuthMe     | < 10 ms | < 10 ms |
