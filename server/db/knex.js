const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_NAME,
    port: process.env.PG_PORT,
  },
});

module.exports = knex;