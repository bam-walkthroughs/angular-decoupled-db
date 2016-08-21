# Angular Decoupled Database

### Objective:
The purpose of this walkthrough is demonstrate setting up a database for authorization and storing pertinent information about the to-do list. It will demonstrate a one-to-many relationship between tables.  

##Part 1 of Angular-To-Do: Make a Database

(1)In terminal do in an empty directory `npm init`

	- This spins up your package.json file

(2)From the terminal type `npm initstall`

	- This makes the node_modules

(3)In terminal `npm install gitignore -g` (if you don't have gitignore installed globally)

	- This makes your .gitignore file

##ADD DEPENDENCIES Knex, pg dotenv

(4) In terminal `npm install knex pg dotenv  --save`

 - Installs dotenv module and adds to the dependencies in package.json(this loads the environment variables)Installs postgres and knex.js and adds them to the dependencies in the package.json

(5)In terminal type `knex init`

 * Creates knexfile.js

(6)In terminal `git init`

 * This initializes a git repo for your project

(7) In terminal `echo node_modules > .gitignore`

* This moves node modules to the .gitignore file

(8)In terminal `touch .env` 	 

* This makes an empty .env file in the root directory

(9)In terminal `echo .env >> .gitignore`

* This adds the .env file to .gitignore so git doesn't track it

(11)In terminal `atom .`

* This opens the directory in atom

(12)Inside the knexfile.js add the following.  

```

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

```



(13)In terminal in the root directory make a directory called db

- `mkdir db && cd db && touch knex.js`

(14) Add the follwing to knex.js

```
var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile')[environment];
var knex = require('knex')(config);
module.exports= knex;
```

##SETTING UP DATABASE POSTGRES DATABASE

(1)In terminal `createdb db_name` (name you want the database to be)

(2) Go into knexfile.js and add database name to development connection

		- connection: 'postgres://localhost/DATABASE NAME YOU JUST CREATED'

(3)In terminal `knex migrate:make table_name`

	- we will make a users table for auth inside of this table, best to name it 'users'. This will occur in the migrations folder that will be set up once the command is ran.

(3.1) Inside of the knex migration file add the following.

```
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

```

(4)We will now make the second table for to-do list data, in terminal `knex migrate:make table_name`

(4.1) Inside of the new migration folder add:

```

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

```

(6) In your terminal type `knex migrate:latest`

- This adds the tables to your database


##SEEDING DATA

- **When making seed file name, add in a number so the seeds will run in order**



(6) In terminal `knex seed:make 0_seed_reset` this will make a new seed file called 0_seed_reset.

(6.1) Open the seed file in Atom, and set up seed data.

```
exports.seed = function(knex, Promise) {
  return knex.raw("TRUNCATE users , list RESTART IDENTITY CASCADE")
  .then(function(){
    			return knex('users').del()
   		 .then(function(){
      		return knex('list').del();
  	 	 });
 	 	});
};
```


(7) This will make the second seed file, in terminal type  `knex seed:make 1_seed_users`

- To make hashed passwords go to (passwords need to be hashed!!!)
https://www.dailycred.com/article/bcrypt-calculator#
For now i am setting all seed data passwords to (password)

- Once you have hashed the passwords go into new seed file and set up seed data

```

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(‘users’).del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
					userName: 'alex',
					//this is where you put the hashed password
					password: '$2a$08$hz1l.K5FG9L4jOsBMEs.f.Toasi1egQIi9AjFNAxVDmVbXrs4Htae'
					}),

        knex('users').insert({
					userName: 'bradford',
					password: '$2a$08$3IzKZNj/Fwr4EvAQwg0e7.UHpfsqobTJWGNcVNUKRgYYW.S49kzrC'
					}),

        knex('users').insert({
				 userName: 'west',
				 password : '$2a$08$Ke4xLA90Sxr3gB.tYeOej.HQDpCKNdMe6PB8Gg/L3l17YU3yhwCAW'
				 })
      ]);
    });
};

```

(7) To create the final seed file, in terminal, `knex seed:make 2_seed_list`

(7.1) Go into newly created seed file and set up seed data for items that will be inside of user's to-do lists.

```
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
```

(8) In your terminal `knex seed:run` this will add all the data to the tables in the database.
