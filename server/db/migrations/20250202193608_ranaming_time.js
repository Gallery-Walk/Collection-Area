/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.renameColumn('password', 'password_hash');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.renameColumn('password_hash', 'password'); // Rollback action
  });
};
