exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('list').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('list').insert({ list: 'do something fun'}),
        knex('list').insert({ list: 'do something sad'}),
        knex('list').insert({ list: 'do something weird'})
      ]);
    });
};
