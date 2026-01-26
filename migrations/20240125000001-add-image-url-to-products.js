'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'is_favorite'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'image_url');
  }
};