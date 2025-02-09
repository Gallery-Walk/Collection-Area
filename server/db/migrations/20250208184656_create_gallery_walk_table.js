/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('gallery_walk', (table) => {
    table.increments('id').primary();
    table.specificType('imageUrl', 'TEXT[]').notNullable();  // Store imageUrl as an array
    table.integer('userId').notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('gallery_walk');
};
