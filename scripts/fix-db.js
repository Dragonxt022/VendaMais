const { sequelize } = require('../models');

async function fixAndSync() {
  try {
    console.log('--- Iniciando Manutenção Definitiva do Banco ---');
    
    // 1. Verificar se a tabela existe
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length > 0) {
      console.log('1. Transformando coluna role em VARCHAR para permitir migração...');
      await sequelize.query("ALTER TABLE users MODIFY COLUMN role VARCHAR(255)");

      console.log("2. Atualizando roles: 'user' será agora 'gerente'...");
      await sequelize.query("UPDATE users SET role = 'gerente' WHERE role = 'user'");
      
      console.log('3. Aplicando novo ENUM e sincronizando estrutura...');
    } else {
      console.log('Tabela users não existe ainda. Sincronização inicial...');
    }

    await sequelize.sync({ alter: true, logging: console.log });
    
    console.log('--- Banco de dados MySQL pronto e atualizado! ---');
    process.exit(0);
  } catch (error) {
    console.error('Erro na manutenção:', error);
    process.exit(1);
  }
}

fixAndSync();
