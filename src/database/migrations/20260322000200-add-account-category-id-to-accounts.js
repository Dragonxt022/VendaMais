'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('accounts', 'account_category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'account_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('accounts', 'account_category_id');
  }
};
