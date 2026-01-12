'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockLot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StockLot.belongsTo(models.Company, { foreignKey: 'company_id' });
      StockLot.belongsTo(models.Product, { foreignKey: 'product_id' });
      StockLot.hasMany(models.StockMovement, { foreignKey: 'stock_lot_id' });
    }
  }
  StockLot.init({
    code: DataTypes.STRING,
    manufacturing_date: DataTypes.DATE,
    expiration_date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockLot',
    tableName: 'stock_lots',
    paranoid: true,
    timestamps: true
  });
  return StockLot;
};