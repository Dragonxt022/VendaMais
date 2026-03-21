module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define('StockMovement', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM('in', 'out', 'adjustment'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    stock_lot_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'stock_lots', key: 'id' },
    },
  }, {
    tableName: 'stock_movements',
    timestamps: true,
    paranoid: true,
  });

  StockMovement.associate = (models) => {
    StockMovement.belongsTo(models.Product, { foreignKey: 'product_id' });
    StockMovement.belongsTo(models.User, { foreignKey: 'user_id' });
    StockMovement.belongsTo(models.StockLot, { foreignKey: 'stock_lot_id' });
  };

  return StockMovement;
};
