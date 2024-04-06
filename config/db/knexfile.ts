import type { Knex } from "knex";
import env from "../config";
// Update with your config settings.
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: env.development_url,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: "",
      user: "",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
