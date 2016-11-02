# Angular Decoupled Database

### Objective:
In this series of walk-throughs we will be creating a simple to-do list decoupled Angular app. In this segment we will demonstrate how to set up a database for storing users and to-do list items. We have set up this project to demonstrate a one-to-many relationship between tables.  

## Set up your project structure

(1) In your terminal navigate to an empty folder and enter `npm init`

	- This creates a package.json file

(2) Next type in `npm install`

	- This creates a node_modules file
	
(3) Initiate a git file with `git init`

	- Creates a git repo in your project folder

(4) Next enter `npm install gitignore -g`

	- This will install gitignore globally on your system if you don't have it already
	
(5) Finally in your terminal enter `gitignore node`
	
	- This creates a .gitignore file for your project and adds node_modules to the list of files to disregard when commiting

### Add dependecies: Knex, pg and Dotenv

(6) In terminal enter `npm install knex pg dotenv  --save`

	- This installs the dotenv, postgress and knex.js modules and adds them as dependencies in your package.json. Dotenv is a module to load the environment variables. Pg is short for postgres and adds postgres capabilites to your project. Knex.js is used as a SQL query builder.
	
[Knex.js](http://knexjs.org/)

[pg](https://www.npmjs.com/package/pg)

[Dotenv](https://www.npmjs.com/package/dotenv)

(7) Next enter in `knex init`

	- Initiates a knexfile.js in your project folder

(8) The next step is to enter `touch .env`
	
	- This creates an empty .env file

(9) In terminal add .env to the .gitignore file with `echo .env >> .gitignore`

	- This adds .env to your .gitignore file, disregarding the .env file when commiting

(10) Finally lets open our project up with your prefered text editor

### Start adding code

(11) Navigate to the knexfile.js file we created earlier and add the following:

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

	- This code snippet imports dotenv to your knexfile.js and sets up two different sets of environment variables; one for development and one for production. Both environments are using the imported pg module but development connects to a local database and production will use a hosted database.



(12) Next in the terminal in the root directory make a folder called db and within that, a file called knex.js `mkdir db && cd db && touch knex.js`

	- This creates a location for us to store our Knex.js configuration so that we can use it later

(13) Add the follwing to knex.js:

```
var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile')[environment];
var knex = require('knex')(config);
module.exports= knex;
```

## Set up a local Postgres database

(14) In terminal `createdb DB_NAME` (name you want the database to be)

(15) Lets go back into knexfile.js and add the database name to your development environment. For example:

	- connection: 'postgres://localhost/DB_NAME'

(16) Now lets start creating tables using our knex module `knex migrate:make table_name`

	- This creates a new migration file named whatever you passed in as the table_name, for this project lets call it 'users'

(16.1) Inside of the knex migration file named 'users' add the following code:

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

	- This code when executed later will create a users table within our local database with three rows; one for an incrementing ID, one for userName and one for password.

(17) Lets repeat the process and create a second table for the to-do list data, in the terminal enter `knex migrate:make to_do`

(17.1) Open up the 'to_do' migration folder and add:

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

	- This will create an incrementing ID row, list row and a users_id reference row that references your first 'users' tables' 'id' row, this is called a foreign key.

(18) Now that you have two tables set up you will need to use the knex module to import those to your local database. In your terminal when you're at the root of your project directory enter `knex migrate:latest`

	- This uses the knex module and creates the two tables using your development environment in your local database


## Seeding Your Database

- **When making seed file name, add in a number so the seeds will run in a specific order (for example: '01_userSeed')**


(19) To start seeding files, in the terminal enter `knex seed:make 00_seed_reset`

	- This seed reset file, prefaced with 00, will run first everytime you use the knex module to seed your database

(19.1) Navigate to the newly created seed file in your text editor, and set up the reset seed data.

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

	- The seed data above will run first each time you initiate the knex module. It ensures that all seed data is cleared before from both tables before reseeding with any new data, removing the possibility for duplicates or the incrementing ID's from not reseting to 0.


(20) To seed the 'users' table create a second seed file by typing in to the terminal  `knex seed:make 01_seed_users`

	- Passwords need to be hashed!!!! For the purpose of demonstrating we will be using the Bcrypt website to hash passwords for us, but for full production you would need to integrate bcrypt into your app. For more information check out:
   [Bcrypt] (https://www.dailycred.com/article/bcrypt-calculator)
   
(20.1) Now that you have created a seed file for users lets navigate to it in our text editor and add some sample seed data:
   
	
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
					userName: 'russell',
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

	- As you can see above we are seeding a userName and hashed password for each user. The first row of the table (the incrementing ID) will be auto-filled when seeding.

(21) To create the final seed file, in the terminal enter `knex seed:make 02_seed_list`

(21.1) Go into the newly created seed file and set up seed data for items that will be inside of each user's to-do lists.

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

(22) After all of your seed data is entered we need to use the knex module to populate our tables. In your terminal enter `knex seed:run` 

	- This will add all the seed data to the tables in the database. Knex module will work in order based off of the prefixed number 00-02. Each time it runs it will clear the users table and any information associated with that user, reset the ID count so each time you will start from 1 and then clear any extranious users and to-do list items.
	
### That's it! Later in the series we will show you how to set up a heroku based database for production, but for now, you set up an Angular Decoupled Database! Make sure to check out the next walk-through where we will work on creating an [Angular server](https://github.com/bam-walkthroughs/angular-decoupled-server). Or checkout other walk-throughs at https://github.com/bam-walkthroughs.


