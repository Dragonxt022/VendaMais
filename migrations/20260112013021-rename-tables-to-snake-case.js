'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tables = [
      { old: 'Categories', new: 'categories' },
      { old: 'Suppliers', new: 'suppliers' },
      { old: 'StockLots', new: 'stock_lots' }
    ];

    for (const table of tables) {
      // Check if old exists and new does NOT exist
      try {
        await queryInterface.renameTable(table.old, table.new);
        console.log(`Renamed ${table.old} to ${table.new}`);
      } catch (error) {
        console.log(`Skipping rename of ${table.old} to ${table.new}: ${error.message}`);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    const tables = [
      { old: 'categories', new: 'Categories' },
      { old: 'suppliers', new: 'Suppliers' },
      { old: 'stock_lots', new: 'StockLots' }
    ];

    for (const table of tables) {
      try {
        await queryInterface.renameTable(table.old, table.new);
      } catch (error) {
        // ignore
      }
    }
  }
};
