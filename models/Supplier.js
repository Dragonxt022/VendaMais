'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Supplier.belongsTo(models.Company, { foreignKey: 'company_id' });
      // For now, simpler association: Product belongs to Supplier (or simple FK)
      // Or Product hasMany Supplier? Usually Product hasOne MainSupplier.
      // Let's assume Product belongsTo Supplier for MVP.
      Supplier.hasMany(models.Product, { foreignKey: 'supplier_id' });
    }
  }
  Supplier.init({
    name: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    company_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Supplier',
    tableName: 'suppliers',
    paranoid: true,
    timestamps: true
  });
  return Supplier;
};