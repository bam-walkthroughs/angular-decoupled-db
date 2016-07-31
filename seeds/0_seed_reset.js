
exports.seed = function(knex, Promise) {
  return knex.raw("TRUNCATE users , list RESTART IDENTITY CASCADE")
  .then(function(){
    			return knex('users').del()
   		 .then(function(){
      		return knex('list').del();
  	 	 });
 	 	});
};
