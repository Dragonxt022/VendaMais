const { Product, Account, AccountCategory, Sequelize } = require('../../models');
const { ensureDefaultAccountCategory } = require('../../services/accountCategoryService');

class DashboardController {
  async index(req, res) {
    try {
      const { company_id } = req.user;
      await ensureDefaultAccountCategory(company_id);
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const dueLimit = new Date(today);
      dueLimit.setDate(dueLimit.getDate() + 7);
      const dueLimitStr = dueLimit.toISOString().slice(0, 10);

      const activeProducts = await Product.count({
        where: { company_id }
      });

      const lowStockProducts = await Product.count({
        where: {
          company_id,
          manage_stock: true,
          stock_quantity: { [Sequelize.Op.lte]: Sequelize.col('min_stock') }
        }
      });

      const inventoryValueResult = await Product.findOne({
        attributes: [
          [Sequelize.literal('SUM(cost * stock_quantity)'), 'totalValue']
        ],
        where: { company_id },
        raw: true
      });

      const inventoryValue = inventoryValueResult && inventoryValueResult.totalValue
        ? parseFloat(inventoryValueResult.totalValue)
        : 0;

      const totalItems = await Product.sum('stock_quantity', {
        where: { company_id }
      }) || 0;

      const upcomingAccounts = await Account.findAll({
        where: {
          company_id,
          due_date: {
            [Sequelize.Op.between]: [todayStr, dueLimitStr]
          }
        },
        include: [{
          model: AccountCategory,
          attributes: ['id', 'name', 'color']
        }],
        order: [['due_date', 'ASC']],
        limit: 5
      });

      const lowStockItems = await Product.findAll({
        where: {
          company_id,
          manage_stock: true,
          stock_quantity: { [Sequelize.Op.lte]: Sequelize.col('min_stock') }
        },
        order: [['stock_quantity', 'ASC']],
        limit: 5
      });

      return {
        title: 'Meu Painel - VendaMais',
        stats: {
          activeProducts,
          lowStockProducts,
          inventoryValue,
          totalItems,
          upcomingAccounts: upcomingAccounts.length
        },
        quickLinks: [
          { label: 'Nova conta', href: '/app/accounts/new' },
          { label: 'Categorias de contas', href: '/app/accounts/categories' },
          { label: 'Novo produto', href: '/app/products' },
          { label: 'Categorias', href: '/app/categories' }
        ],
        notices: {
          upcomingAccounts,
          lowStockItems
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DashboardController();
