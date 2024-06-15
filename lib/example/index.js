import nlogin from '../login.js';
import database from './database.js';

 // define the class with database
const plugin = new nlogin(database);

 // register user 
plugin.register({ username: 'name', password: '123456' }, (register) => {
  console.log(register); // return true or false
});

 // check password
 plugin.login('name', '123456', auth => {
   console.log(auth); // return true or false
 });
 
  // get the Nlogin information about the player.
 plugin.player('name', info => {
   console.log(info); // return JSON or false
 });
 
 
