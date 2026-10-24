import { Nlogin } from '../lib/login.js';

const [hash, password] = process.argv.slice(2);

if (!hash || !password) {
  console.log('usage: node exemple/test-hash.js "<hash>" "<password>"');
  process.exit(1);
}

const login = new Nlogin();
const type = login.$type(hash);
const cost = hash.startsWith('$2') ? hash.split('$')[2] : null;

console.log('hash    :', hash.slice(0, 40) + (hash.length > 40 ? '...' : ''));
console.log('type    :', type || '(unknown)');
if (cost) console.log('cost    :', cost, '(each +1 doubles the work)');

const started = performance.now();
const ok = await login.$passwordAsync(hash, password);
const ms = (performance.now() - started).toFixed(0);

console.log('valid   :', ok, `(${ms} ms)`);
if (cost) console.log('rehash  :', login.$needsRehash(hash, true) ? 'yes' : 'no');
