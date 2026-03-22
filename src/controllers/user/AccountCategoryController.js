const { AccountCategory, Account } = require('../../models');
const { getAccountCategories } = require('../../services/accountCategoryService');

class AccountCategoryController {
  async index(req, res) {
    const { company_id } = req.user;
    const categories = await getAccountCategories(company_id);

    const counts = await Promise.all(
      categories.map(async (category) => ({
        id: category.id,
        total: await Account.count({
          where: {
            company_id,
            account_category_id: category.id
          }
        })
      }))
    );

    const countMap = counts.reduce((acc, item) => {
      acc[item.id] = item.total;
      return acc;
    }, {});

    return {
      title: 'Categorias de Contas - VendaMais',
      categories: categories.map((category) => ({
        ...category.toJSON(),
        accountsCount: countMap[category.id] || 0
      }))
    };
  }

  async store(req, res) {
    const { company_id } = req.user;
    const { name, description, color } = req.body;

    const category = await AccountCategory.create({
      company_id,
      name: name.trim(),
      description: description || null,
      color: color || '#94a3b8'
    });

    return { success: true, category };
  }
}

module.exports = new AccountCategoryController();
