'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Note: SQLite has limited support for modifying columns. 
    // Usually we'd use queryInterface.changeColumn, but for ENUMs in SQLite it's just TEXT.
    // However, to satisfy Sequelize and other DBs:
    
    // Update existing users from 'user' to 'gerente' as they are likely the merchants
    await queryInterface.bulkUpdate('users', { role: 'gerente' }, { role: 'user' });
    
    // In many dialects this would update the ENUM definition
    // For SQLite, it just documents the change in the migration history
    try {
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM('admin', 'gerente', 'colaborador', 'usuario'),
        defaultValue: 'gerente'
      });
    } catch (e) {
      console.log('Skipping changeColumn as SQLite might not support it for ENUM transitions.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('users', { role: 'user' }, { role: 'gerente' });
    await queryInterface.bulkUpdate('users', { role: 'user' }, { role: 'colaborador' });
    await queryInterface.bulkUpdate('users', { role: 'user' }, { role: 'usuario' });

    try {
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
      });
    } catch (e) {
      console.log('Skipping changeColumn down as SQLite might not support it.');
    }
  }
};
