const { StockMovement, Product, sequelize } = require('../../models');

module.exports = {
  // List history for a product
  async history(req, res) {
    try {
      const { product_id } = req.params;
      const { company_id } = req.user;

      // Verificar se o produto existe e pertence à empresa
      const product = await Product.findOne({
        where: { id: product_id, company_id }
      });

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const movements = await StockMovement.findAll({
        where: { product_id },
        include: [{
          model: Product,
          where: { company_id }, // Ensure isolation
          attributes: ['id', 'name', 'manage_stock']
        }],
        order: [['createdAt', 'DESC']],
        limit: 100 // Limitar para evitar sobrecarga
      });

      return { movements, product };
    } catch (err) {
      console.error('Error in stock history:', err);
      throw err;
    }
  },

  // Record a new movement
  async recordMovement(req, res) {
    const t = await sequelize.transaction();
    try {
      const { product_id, type, quantity, reason } = req.body;
      const { company_id, id: user_id } = req.user;

      // Buscar produto e verificar se pertence à empresa
      const product = await Product.findOne({
        where: { id: product_id, company_id }
      });

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      // Verificar se o produto gerencia estoque
      if (!product.manage_stock) {
        throw new Error('Este produto não possui gerenciamento de estoque habilitado');
      }

      // Validações específicas por tipo de movimento
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty < 0) {
        throw new Error('Quantidade deve ser um número inteiro não negativo');
      }

      // Verificar estoque suficiente para saídas
      if (type === 'out' && product.stock_quantity < qty) {
        throw new Error(`Estoque insuficiente. Disponível: ${product.stock_quantity}, Solicitado: ${qty}`);
      }

      // Criar movimentação
      const movement = await StockMovement.create({
        product_id,
        type,
        quantity: qty,
        reason: reason || null,
        user_id
      }, { transaction: t });

      // Atualizar estoque do produto
      let newStock = product.stock_quantity;
      if (type === 'in') {
        newStock += qty;
      } else if (type === 'out') {
        newStock -= qty;
      } else if (type === 'adjustment') {
        newStock = qty;
      }

      // Garantir que estoque não seja negativo
      if (newStock < 0) {
        throw new Error('Operação resultaria em estoque negativo');
      }

      await product.update({ stock_quantity: newStock }, { transaction: t });
      await t.commit();

      // Adicionar notificação de sucesso
      if (req.session) {
        req.session.notification = {
          type: 'success',
          title: 'Estoque Atualizado',
          message: `Movimentação registrada com sucesso. Novo estoque: ${newStock}`
        };
      }

      return { movement, product: { ...product.toJSON(), stock_quantity: newStock } };
    } catch (err) {
      console.error('Error in recordMovement:', err);
      await t.rollback();
      
      // Adicionar notificação de erro
      if (req.session) {
        req.session.notification = {
          type: 'error',
          title: 'Erro na Movimentação',
          message: err.message
        };
      }
      
      throw err;
    }
  }
};
