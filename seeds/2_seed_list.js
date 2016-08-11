exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('list').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('list').insert({ list: 'do something fun', users_id: 1}),
            knex('list').insert({ list: 'do something sad', users_id: 1}),
                knex('list').insert({ list: 'do something to poop', users_id: 1}),
        knex('list').insert({ list: 'do something sad', users_id: 2}),
        knex('list').insert({ list: 'do something weird', users_id: 3})
      ]);
    });
};
