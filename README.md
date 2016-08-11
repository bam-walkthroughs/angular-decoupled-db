# angular-decoupled-db
Part 1 of Angular-To-Do
Make a DataBase 

(1)Npm init 
	-makes your package.json file 
(2)Npm initstall
	-make node_modules
(3)npm install gitignore -g (if you don't have gitignore installed globally)
  	Gitignore node
		-makes a .gitignore file

ADD DEPENDENCIES Knex, pg dotenv

(4)npm install knex pg dotenv  --save
-Installs dotenv module and adds to the dependencies in package.json(this loads the environment variables)Installs pg and knex and add them to the dependencies in the package.json 
(4)Knex init 
	-Creates knexfile.js
(5)Git init 
-Initialize git repo 
(6)Echo node_modules > .gitignore 
		-moves node modules to a .gitignore file 
(7)Touch .env 	 
	-Makes a empty .env file in the root directory 
(8)echo .env >> .gitignore
		-adds .env file to .gitignore so git doesn't track it
(10)Atom .
	-open atom

(11)Change knexfile.js 
require('dotenv').config();
module.exports = {
  	development: {
   	 client: 'pg',
    	connection: 'postgres://localhost/DATABASE_NAME'
 	 },
 	 production:{
    	client: 'pg',
    	connection: process.env.DATABASE_URL + '?ssl=true'
  	}
};



(12)Create directory called db 
(13)Makefile knex.js 
	-Add to knex.js
		var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile')[environment];
var knex = require('knex')(config);
module.exports= knex;


SETTING UP DATABASE POSTGRES DATABASE

(1)Open Terminal 

(2)Createdb db_name (name you want the database to be)
	-go into knexfile.js and add database name to development connection
		(connection: 'postgres://localhost/DATABASE NAME YOU JUST CREATED')

(3)Knex migrate:make table_name 
(we will make a users table for auth)
	exports.up = function(knex, Promise) {
 return knex.schema.createTable('users', function(table){
 			  table.increments();
  			 table.string('userName');
			 table.text('password');
 			 });
};
exports.down = function(knex, Promise) {
 	return knex.schema.dropTableIfExists('users');
};


(4)Knex migrate:make table_name 
(we will make a list table for the list data)

exports.up = function(knex, Promise) {
 return knex.schema.createTable('list', function(table){
   table.increments();
   table.text('list');
   table.integer('users_id').references('users.id');
 	 });
};
exports.down = function(knex, Promise) {
 	return knex.schema.dropTableIfExists('list');
};





(6)Knex migrate:latest
Adds tables to your database 


SEEDING DATA
-Add in a number so the seeds will run in order 



(6)Knex seed:make 0_seed_reset
	-go into new seed file and set up seed data 


exports.seed = function(knex, Promise) {
  return knex.raw("TRUNCATE users , list RESTART IDENTITY CASCADE")
  .then(function(){
    			return knex('users').del()
   		 .then(function(){
      		return knex('list').del();
  	 	 });
 	 	});
};



(7)Knex seed:make 1_seed_users 
-go into new seed file and set up seed data 
	-To make hashed passwords go to 
https://www.dailycred.com/article/bcrypt-calculator#
For now i am setting all seed data passwords to (password)


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(‘users’).del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({userName: 'alex', password: '$2a$08$hz1l.K5FG9L4jOsBMEs.f.Toasi1egQIi9AjFNAxVDmVbXrs4Htae'}),

        knex('users').insert({userName: 'bradford', password: '$2a$08$3IzKZNj/Fwr4EvAQwg0e7.UHpfsqobTJWGNcVNUKRgYYW.S49kzrC'}),

        knex('users').insert({userName: 'west', password : '$2a$08$Ke4xLA90Sxr3gB.tYeOej.HQDpCKNdMe6PB8Gg/L3l17YU3yhwCAW'})
      ]);
    });
};


(7)Knex seed:make 2_seed_list
-go into new seed file and set up seed data 


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('list').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('list').insert({ list: 'do something fun', users_id: 1}),
        knex('list').insert({ list: 'do something sad', users_id: 2}),
        knex('list').insert({ list: 'do something weird', users_id: 3})
      ]);
    });
};


(8)Knex seed:run
	-adds data to your table 


