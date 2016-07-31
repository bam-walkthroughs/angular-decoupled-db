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
