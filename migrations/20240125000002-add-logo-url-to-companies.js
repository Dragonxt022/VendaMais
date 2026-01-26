'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('companies', 'logo_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'trial_expires_at'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('companies', 'logo_url');
  }
};