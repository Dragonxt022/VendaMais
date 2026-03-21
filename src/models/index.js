'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const db = {};

const defaultsByEnv = {
  development: {
    database: 'vendamais',
    username: 'root',
    password: 'rootpassword',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  },
  test: {
    database: 'vendamais_test',
    username: 'root',
    password: 'rootpassword',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  },
  production: {
    database: 'vendamais',
    username: 'root',
    password: 'rootpassword',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  }
};

const defaults = defaultsByEnv[env] || defaultsByEnv.development;
const dbName = process.env.DB_NAME || defaults.database;
const dbUser = process.env.DB_USER || defaults.username;
const dbPass = process.env.DB_PASSWORD || defaults.password;
const dbHost = process.env.DB_HOST || defaults.host;
const dbPort = Number(process.env.DB_PORT || defaults.port);
const dbDialect = process.env.DB_DIALECT || defaults.dialect;

console.log(`[Database] Tentando conectar como '${dbUser}' em '${dbHost}:${dbPort}' no banco '${dbName}'...`);
console.log(`[Database] Usando variaveis individuais para conexao (${env})...`);

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: env === 'development' ? console.log : false,
  define: {
    timestamps: true
  }
});

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
