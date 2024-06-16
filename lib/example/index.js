import nlogin from '../login.js';
import database from './database.js';

 // define the class with database
const plugin = new nlogin(database);
 
 // perform player login 
plugin.login('name', '12356', auth => {
   console.log(auth); // return true or false
 });

 // register user 
plugin.register({ nickname: 'name', password: '123456', email: null, discord: 12345678910 }, (register) => {
  console.log(register); // return true or false
});
