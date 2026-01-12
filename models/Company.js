module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      plan: {
        type: DataTypes.ENUM("basic", "pro"),
        defaultValue: "basic",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      trial_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "companies",
      timestamps: true,
      paranoid: true,
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.User, { foreignKey: "company_id" });
    Company.hasMany(models.Product, { foreignKey: "company_id" });
  };

  return Company;
};
