const { sequelize } = require('../models');

async function runMigrations() {
  try {
    console.log('Forçando sincronização do banco...');
    
    // Sincroniza todos os modelos com o banco
    await sequelize.sync({ force: false, alter: true, logging: console.log });
    
    console.log('Banco sincronizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao sincronizar banco:', error);
    process.exit(1);
  }
}

runMigrations();