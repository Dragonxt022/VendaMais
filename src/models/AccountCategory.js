module.exports = (sequelize, DataTypes) => {
  const AccountCategory = sequelize.define('AccountCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#94a3b8'
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'companies', key: 'id' }
    }
  }, {
    tableName: 'account_categories',
    timestamps: true,
    paranoid: true
  });

  AccountCategory.associate = (models) => {
    AccountCategory.belongsTo(models.Company, { foreignKey: 'company_id' });
    AccountCategory.hasMany(models.Account, { foreignKey: 'account_category_id' });
  };

  return AccountCategory;
};
