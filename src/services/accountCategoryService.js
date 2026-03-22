const { AccountCategory } = require('../models');

const DEFAULT_CATEGORY = {
  name: 'Outro',
  description: 'Categoria padrao para contas sem classificacao especifica.',
  color: '#94a3b8'
};

async function ensureDefaultAccountCategory(companyId) {
  const [category] = await AccountCategory.findOrCreate({
    where: {
      company_id: companyId,
      name: DEFAULT_CATEGORY.name
    },
    defaults: {
      company_id: companyId,
      ...DEFAULT_CATEGORY
    }
  });

  return category;
}

async function getAccountCategories(companyId) {
  await ensureDefaultAccountCategory(companyId);

  return AccountCategory.findAll({
    where: { company_id: companyId },
    order: [['name', 'ASC']]
  });
}

async function resolveCategoryForAccount(account, companyId) {
  if (account.account_category_id) {
    return account.account_category_id;
  }

  const fallbackName = account.name && account.name.trim() ? account.name.trim() : DEFAULT_CATEGORY.name;

  const [category] = await AccountCategory.findOrCreate({
    where: {
      company_id: companyId,
      name: fallbackName
    },
    defaults: {
      company_id: companyId,
      name: fallbackName,
      color: DEFAULT_CATEGORY.color
    }
  });

  await account.update({
    account_category_id: category.id,
    name: category.name
  });

  return category.id;
}

module.exports = {
  DEFAULT_CATEGORY,
  ensureDefaultAccountCategory,
  getAccountCategories,
  resolveCategoryForAccount
};
