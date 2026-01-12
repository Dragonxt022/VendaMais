const { StockMovement, Product, sequelize } = require('../../models');

module.exports = {
  // List history for a product
  async history(req, res) {
    try {
      const { product_id } = req.params;
      const { company_id } = req.user;

      const movements = await StockMovement.findAll({
        where: { product_id },
        include: [{
          model: Product,
          where: { company_id } // Ensure isolation
        }],
        order: [['createdAt', 'DESC']]
      });

      return { movements };
    } catch (err) {
      throw err;
    }
  },

  // Record a new movement
  async recordMovement(req, res) {
    const t = await sequelize.transaction();
    try {
      const { product_id, type, quantity, reason } = req.body;
      const { company_id, id: user_id } = req.user;

      const product = await Product.findOne({
        where: { id: product_id, company_id }
      });

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const movement = await StockMovement.create({
        product_id,
        type,
        quantity,
        reason,
        user_id
      }, { transaction: t });

      // Update actual product stock
      if (type === 'in') {
        product.stock_quantity += parseInt(quantity);
      } else if (type === 'out') {
        product.stock_quantity -= parseInt(quantity);
      } else if (type === 'adjustment') {
        product.stock_quantity = parseInt(quantity);
      }

      await product.save({ transaction: t });
      await t.commit();

      return { movement, product };
    } catch (err) {
      console.error('Error in recordMovement:', err);
      await t.rollback();
      throw err;
    }
  }
};
