module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'companies', key: 'id' }
    },
    account_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'account_categories', key: 'id' }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Outro'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    issued_at: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachment_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'accounts',
    timestamps: true,
    paranoid: true
  });

  Account.associate = (models) => {
    Account.belongsTo(models.Company, { foreignKey: 'company_id' });
    Account.belongsTo(models.AccountCategory, { foreignKey: 'account_category_id' });
  };

  return Account;
};
