import nlogin from '../login.js';
import database from './database.js';

 // define the class with database
const plugin = new nlogin(database);

 // register user 
plugin.register('name', '123456', register => {
  console.log(register); // return true or false
});

 // check password
 plugin.login('name', '123456', auth => {
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
 
   // get the player's uuid
 plugin.uuid('name', uuid => {
   console.log(uuid); // returns result or false
 });
 
  // set the player's discord id
 plugin.set_discord('name', '9897878', discord => {
  console.log(discord); // returns true or false
 });

  // get the player's discord id
 plugin.get_discord('name', discord => {
  console.log(discord); // returns result or false
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