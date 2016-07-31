
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({userName: 'alex', password: '$2a$08$hz1l.K5FG9L4jOsBMEs.f.Toasi1egQIi9AjFNAxVDmVbXrs4Htae'}),

        knex('users').insert({userName: 'bradford', password: '$2a$08$3IzKZNj/Fwr4EvAQwg0e7.UHpfsqobTJWGNcVNUKRgYYW.S49kzrC'}),

        knex('users').insert({userName: 'west', password : '$2a$08$Ke4xLA90Sxr3gB.tYeOej.HQDpCKNdMe6PB8Gg/L3l17YU3yhwCAW'})
      ]);
    });
};
