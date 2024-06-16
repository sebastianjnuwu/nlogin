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

</p>
<div>

## plugin settings 

• See below the Nlogin settings in the [plugin](https://www.nickuc.com/pt/#plugins) `config.yml`, remember to configure MySQL.

```yml
  hashing:
    algorithm: "SHA256" # very important
```

## settings using nodejs

• download the dependencies:
```js
npm i nlogin-js 
```

`main.js:`
```js
import Sequelize from 'sequelize';
import nlogin from 'nlogin-js';

const sequelize = new Sequelize('nLogin', 'root', '', {
  dialect: 'mysql',
  host: '0.0.0.0',
  port: 3006,
  logging: false,
  define: {
    timestamps: false,
  },
});

(async () => {
 await sequelize.authenticate();
})()

 // define the class with database
const plugin = new nlogin(sequelize);

 
 // perform player login 
plugin.login('name', '12356', auth => {
   console.log(auth); // return true or false
 });

 // register user 
plugin.register({ nickname: 'name', password: '123456', email: null, discord: 12345678910 }, (register) => {
  console.log(register); // return true or false
});
 ```

• run the following command:
```bash
node main.js
```
