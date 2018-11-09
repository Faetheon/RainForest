require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.CR_URL,
    migrations: {
      directory: __dirname + '/database/migrations'
    },
    seeds: {
      directory: __dirname + '/database/seeds/development'
    }
  },

  staging: {
    client: 'postgresql',
    connection: process.env.CR_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.CR_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};