'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalogo_global_ean', {
      ean: {
        type: Sequelize.STRING(13),
        primaryKey: true,
        allowNull: false
      },
      nome_produto: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nivel_confianca: {
        type: Sequelize.INTEGER,
        defaultValue: 50,
        validate: {
          min: 0,
          max: 100
        }
      },
      origem: {
        type: Sequelize.ENUM('fabricante', 'usuário', 'importado', 'parceiro'),
        defaultValue: 'usuário'
      },
      status: {
        type: Sequelize.ENUM('pendente', 'validado', 'rejeitado', 'arquivado'),
        defaultValue: 'pendente'
      },
      quantidade_fontes: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      data_primeiro_cadastro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      data_ultima_verificacao: {
        type: Sequelize.DATE,
        allowNull: true
      },
      moderado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      foto_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      categoria_sugerida: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      ncm: {
        type: Sequelize.STRING(8),
        allowNull: true
      },
      marca: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      modelo: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      versao: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      hash_verificacao: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('catalogo_global_historico', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        references: {
          model: 'catalogo_global_ean',
          key: 'ean'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      alteracao: {
        type: Sequelize.JSON,
        allowNull: false
      },
      motivo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      data_hora: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('catalogo_global_ean', ['status']);
    await queryInterface.addIndex('catalogo_global_historico', ['ean']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('catalogo_global_historico');
    await queryInterface.dropTable('catalogo_global_ean');
  }
};
