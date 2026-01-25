'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Prioriza variáveis do .env, senão usa o que está no config.json
const dbName = process.env.DB_NAME || config.database;
const dbUser = process.env.DB_USER || config.username;
const dbPass = process.env.DB_PASSWORD || config.password;
const dbHost = process.env.DB_HOST || config.host || 'localhost';
const dbPort = process.env.DB_PORT || config.port || 3306;

console.log(`[Database] Tentando conectar como '${dbUser}' em '${dbHost}:${dbPort}' no banco '${dbName}'...`);

let sequelize;
if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log(`[Database] Usando variáveis individuais para conexão (${env})...`);
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
