const { Product, Sequelize } = require('../../models');

class DashboardController {
    async index(req, res) {
        try {
            const { company_id } = req.user;

            // Total active products count
            const activeProducts = await Product.count({
                where: { company_id }
            });

            // Products with low stock (stock <= min_stock)
            const lowStockProducts = await Product.count({
                where: {
                    company_id,
                    stock_quantity: { [Sequelize.Op.lte]: Sequelize.col('min_stock') }
                }
            });

            // Total inventory value (cost * quantity)
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

            return {
                title: 'Meu Painel - VendaMais',
                stats: {
                    activeProducts,
                    lowStockProducts,
                    inventoryValue,
                    totalItems
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DashboardController();
