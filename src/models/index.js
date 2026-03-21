'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const db = {};
const databaseDir = path.join(process.cwd(), 'src', 'database');

const defaultsByEnv = {
  development: {
    dialect: 'sqlite',
    storage: path.join(databaseDir, 'development.sqlite')
  },
  test: {
    dialect: 'sqlite',
    storage: path.join(databaseDir, 'test.sqlite')
  },
  production: {
    dialect: 'mysql',
    database: 'vendamais',
    username: 'root',
    password: 'rootpassword',
    host: 'localhost',
    port: 3306
  }
};

const defaults = defaultsByEnv[env] || defaultsByEnv.development;
const dbDialect = (process.env.DB_DIALECT || defaults.dialect).toLowerCase();

let sequelize;

if (dbDialect === 'sqlite') {
  const dbStorage = process.env.DB_STORAGE || defaults.storage;
  fs.mkdirSync(path.dirname(dbStorage), { recursive: true });

  console.log(`[Database] Usando SQLite em '${dbStorage}' (${env})...`);

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbStorage,
    logging: env === 'development' ? console.log : false,
    define: {
      timestamps: true
    }
  });
} else {
  const dbName = process.env.DB_NAME || defaults.database;
  const dbUser = process.env.DB_USER || defaults.username;
  const dbPass = process.env.DB_PASSWORD || defaults.password;
  const dbHost = process.env.DB_HOST || defaults.host;
  const dbPort = Number(process.env.DB_PORT || defaults.port);

  console.log(`[Database] Tentando conectar como '${dbUser}' em '${dbHost}:${dbPort}' no banco '${dbName}'...`);
  console.log(`[Database] Usando ${dbDialect} com variaveis individuais (${env})...`);

  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect,
    logging: env === 'development' ? console.log : false,
    define: {
      timestamps: true
    }
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
