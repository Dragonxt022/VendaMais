module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'companies', key: 'id' },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'suppliers', key: 'id' },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    min_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    manage_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'products',
    timestamps: true,
    paranoid: true,
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Company, { foreignKey: 'company_id' });
    Product.hasMany(models.StockMovement, { foreignKey: 'product_id' });
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
  };

  return Product;
};
