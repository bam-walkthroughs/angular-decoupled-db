require('dotenv').config();
module.exports = {
  	development: {
//set up development envierment to pg (postgresql)
   	 client: 'pg',
// after making a database you will change DATABASE_NAME to the database you make or declair it in the .env file
    	connection: 'postgres://localhost/list-2-db'
 	 },
 	 production:{
    	client: 'pg',
    	connection: process.env.DATABASE_URL + '?ssl=true'
  	}
};
