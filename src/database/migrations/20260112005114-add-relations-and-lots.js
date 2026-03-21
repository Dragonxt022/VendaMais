'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add columns to products
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('products', 'supplier_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'suppliers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add column to stock_movements
    await queryInterface.addColumn('stock_movements', 'stock_lot_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'stock_lots', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category_id');
    await queryInterface.removeColumn('products', 'supplier_id');
    await queryInterface.removeColumn('stock_movements', 'stock_lot_id');
  }
};
