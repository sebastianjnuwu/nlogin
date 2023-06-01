# About nLogin

<div>
 <p align="center">
  <img alt="logo" src="https://392013314-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FKVum4E4GDZV1mBUNLw4i%2Fuploads%2FLOdi7QbjHbbfwqtjr1CX%2Fimage.png?alt=media&token=0d2f861d-fb86-4afe-a0d9-bed902f80a7a" width="72%"  />
  <br>
  <a href="https://opensource.org/licenses/Apache-2.0"><img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-orange.svg"/></a>
  <a href="https://discord.gg/NDzFeDp8YE"><img src="https://discordapp.com/api/guilds/893997835412971570/widget.png"></a>
  <br>
  <br>
   <i>"nLogin is an authentication system used by the biggest servers in Brazil now in javascript!"</i>
  
   - login verification
   - get and set email 
   - get and set ip

> **Warning**: The supported hashes are: BCRYPT2Y, BCRYPT2A, SHA256; we recommend using **SHA256**.

</p>
<div>

## plugin settings 

• See below the Nlogin settings in the [plugin](https://www.nickuc.com/pt/#plugins) `config.yml`, remember to configure MySQL.

```yml
# .....
# Password settings.
passwords:
  small: 5
  large: 15
  bruteforce:
    max-login-tries: 2
    auto-punish: true
    punishment-duration: 15
  insecure-passwords:
    warn: true
    level: "123"
  hashing:
    algorithm: "SHA256" # very important 
    bcrypt:
      rounds: 10
    argon2:
      iterations: 10
      memory: 64
      parallelism: 10
 # ....
```

## settings using nodejs

**"important pay attention to the details below"**

• download the dependencies:
```js
npm i sequelize nlogin-js mysql2
```

`config.js:`
```js
import Sequelize from 'sequelize';

const sequelize = new Sequelize('database_name', 'database_user', 'database_password', {
  dialect: 'mysql',
  host: '0.0.0.0',
  port: 3306,
  logging: false,
  define: {
    timestamps: false,
  },
});

try {
 
(async () => {
 await sequelize.authenticate();
 console.log(`• Connected to mysql database`);
}) ();
 
} catch (e) {
  console.log(`• An error occurred in the db: ${e.message}`);
}

export default sequelize;
```

`index.js:`
```js
 // importing package and settings in es6
import sequelize from './config.js';
import nlogin from 'nlogin-js';

 // define the class with database
const plugin = new nlogin(sequelize);

 // check password
 plugin.login('name', 'pass_123', auth => {
   console.log(auth); // return true or false
 });
 
  // get the Nlogin information about the player.
 plugin.info('name', info => {
   console.log(info); // return JSON or false
 });
 
  // get the player's email 
 plugin.get_email('name', email => {
   console.log(email); // returns result or false
 });
 
  // set the player's email 
 plugin.set_email('name', 'email@gmail.com', email => {
   console.log(email); // returns true or false
 });
 
  // get the player's ip
 plugin.get_ip('name', ip => {
   console.log(ip); // returns result or false
 });
 
  // set the player's ip
 plugin.set_ip('name', '0.0.0.0', ip => {
   console.log(ip); // returns true or false
 });
```

• run the following command:
```bash
node index.js
```