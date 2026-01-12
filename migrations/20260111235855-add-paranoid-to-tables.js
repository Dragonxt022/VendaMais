'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('products', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('stock_movements', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'deletedAt');
    await queryInterface.removeColumn('users', 'deletedAt');
    await queryInterface.removeColumn('products', 'deletedAt');
    await queryInterface.removeColumn('stock_movements', 'deletedAt');
  }
};
