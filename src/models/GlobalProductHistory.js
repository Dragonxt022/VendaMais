module.exports = (sequelize, DataTypes) => {
  const GlobalProductHistory = sequelize.define('GlobalProductHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ean: {
      type: DataTypes.STRING(13),
      allowNull: false,
      references: { model: 'catalogo_global_ean', key: 'ean' }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    alteracao: {
      type: DataTypes.JSON,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    data_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'catalogo_global_historico',
    timestamps: true
  });

  GlobalProductHistory.associate = (models) => {
    GlobalProductHistory.belongsTo(models.GlobalProduct, { foreignKey: 'ean' });
    GlobalProductHistory.belongsTo(models.User, { foreignKey: 'usuario_id', as: 'contributor' });
  };

  return GlobalProductHistory;
};
