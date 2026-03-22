const { sequelize, Company, Account, AccountCategory } = require('../src/models');
const { ensureDefaultAccountCategory } = require('../src/services/accountCategoryService');

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  const normalizedTables = tables.map((table) => {
    if (typeof table === 'string') {
      return table.toLowerCase();
    }

    return String(table.tableName || table.name || table).toLowerCase();
  });

  return normalizedTables.includes(tableName.toLowerCase());
}

async function columnExists(queryInterface, tableName, columnName) {
  const tableDefinition = await queryInterface.describeTable(tableName);
  return Boolean(tableDefinition[columnName]);
}

async function ensureAccountCategoriesTable(queryInterface, Sequelize) {
  const exists = await tableExists(queryInterface, 'account_categories');
  if (exists) {
    console.log('Tabela `account_categories` ja existe.');
    return;
  }

  console.log('Criando tabela `account_categories`...');
  await queryInterface.createTable('account_categories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '#94a3b8'
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  });
}

async function ensureAccountCategoryIdColumn(queryInterface, Sequelize) {
  const exists = await columnExists(queryInterface, 'accounts', 'account_category_id');
  if (exists) {
    console.log('Coluna `accounts.account_category_id` ja existe.');
    return;
  }

  console.log('Adicionando coluna `accounts.account_category_id`...');
  await queryInterface.addColumn('accounts', 'account_category_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'account_categories',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
}

async function backfillAccountCategories() {
  const companies = await Company.findAll({ attributes: ['id', 'name'] });
  console.log(`Empresas encontradas para ajuste: ${companies.length}`);

  for (const company of companies) {
    const fallbackCategory = await ensureDefaultAccountCategory(company.id);

    const accounts = await Account.findAll({
      where: { company_id: company.id }
    });

    for (const account of accounts) {
      if (account.account_category_id) {
        continue;
      }

      const desiredName = account.name && account.name.trim()
        ? account.name.trim()
        : fallbackCategory.name;

      const [category] = await AccountCategory.findOrCreate({
        where: {
          company_id: company.id,
          name: desiredName
        },
        defaults: {
          company_id: company.id,
          name: desiredName,
          color: '#94a3b8'
        }
      });

      await account.update({
        account_category_id: category.id,
        name: category.name
      });
    }
  }
}

async function migrate() {
  try {
    console.log('--- MIGRACAO SEGURA DO BANCO ---');
    console.log(`Dialeto ativo: ${sequelize.getDialect()}`);

    await sequelize.authenticate();

    const queryInterface = sequelize.getQueryInterface();
    const { Sequelize } = sequelize;

    const accountsExists = await tableExists(queryInterface, 'accounts');
    if (!accountsExists) {
      throw new Error('Tabela `accounts` nao encontrada. Rode primeiro o fluxo que cria a tabela base da aplicacao.');
    }

    await ensureAccountCategoriesTable(queryInterface, Sequelize);
    await ensureAccountCategoryIdColumn(queryInterface, Sequelize);
    await backfillAccountCategories();

    console.log('Migracao segura concluida com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('Erro na migracao segura:', error);
    process.exit(1);
  }
}

migrate();
