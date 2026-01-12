'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tables = ['Categories', 'Suppliers', 'StockLots'];
    
    for (const table of tables) {
      const tableInfo = await queryInterface.describeTable(table);
      if (!tableInfo.deletedAt) {
        await queryInterface.addColumn(table, 'deletedAt', {
          type: Sequelize.DATE,
          allowNull: true
        });
      }
    }
  },

  async down (queryInterface, Sequelize) {
    // We can try to remove, or leave it. Removing might be risky if we want to preserve data from previous partial runs, but normally down should inverse up.
    // Let's safe remove.
    const tables = ['Categories', 'Suppliers', 'StockLots'];
    for (const table of tables) {
       try {
         await queryInterface.removeColumn(table, 'deletedAt');
       } catch (e) {
         // ignore if doesn't exist
       }
    }
  }
};
