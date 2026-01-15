module.exports = (sequelize, DataTypes) => {
  const GlobalProduct = sequelize.define(
    "GlobalProduct",
    {
      ean: {
        type: DataTypes.STRING(13),
        primaryKey: true,
        allowNull: false,
      },
      nome_produto: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nivel_confianca: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
      },
      origem: {
        type: DataTypes.ENUM("fabricante", "usuário", "importado", "parceiro"),
        defaultValue: "usuário",
      },
      status: {
        type: DataTypes.ENUM("pendente", "validado", "rejeitado", "arquivado"),
        defaultValue: "pendente",
      },
      quantidade_fontes: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      data_primeiro_cadastro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      data_ultima_verificacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      moderado_por: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      foto_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      categoria_sugerida: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ncm: {
        type: DataTypes.STRING(8),
        allowNull: true,
      },
      marca: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      modelo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      versao: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      hash_verificacao: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
    },
    {
      tableName: "catalogo_global_ean",
      timestamps: true,
    }
  );

  GlobalProduct.associate = (models) => {
    GlobalProduct.belongsTo(models.User, {
      foreignKey: "moderado_por",
      as: "moderator",
    });
    GlobalProduct.hasMany(models.GlobalProductHistory, { foreignKey: "ean" });
  };

  return GlobalProduct;
};
