const { GlobalProduct, GlobalProductHistory, User } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      const { status, search } = req.query;

      const where = {};
      
      if (status) {
        where.status = status;
      } else {
        // Default to pending if not specified, or show all? 
        // Let's default to showing valid + pending
        // where.status = { [Op.ne]: 'arquivado' };
      }

      if (search) {
        where[Op.or] = [
          { ean: { [Op.like]: `%${search}%` } },
          { nome_produto: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await GlobalProduct.findAndCountAll({
        where,
        limit,
        offset,
        order: [['data_ultima_verificacao', 'DESC'], ['created_at', 'DESC']]
      });

      return {
        products: rows,
        page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        search,
        status: status || ''
      };
    } catch (err) {
      console.error('Error in GlobalCatalogController.index:', err);
      throw err;
    }
  },

  async details(req, res) {
    try {
      const { ean } = req.params;
      const product = await GlobalProduct.findOne({
        where: { ean },
        include: [
          { model: GlobalProductHistory, include: [{ model: User, as: 'contributor' }] },
          { model: User, as: 'moderator' }
        ]
      });

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      return product;
    } catch (err) {
      console.error('Error in GlobalCatalogController.details:', err);
      throw err;
    }
  },

  async updateStatus(req, res) {
    // This is used for approve/reject logic
    try {
      const { ean } = req.params;
      const { status, motivo } = req.body;
      const userId = req.user.id;

      const product = await GlobalProduct.findByPk(ean);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Produto não encontrado' });
      }

      const oldStatus = product.status;
      product.status = status;
      product.moderado_por = userId;
      product.data_ultima_verificacao = new Date();
      
      if (status === 'validado') {
        product.nivel_confianca = 100;
      }

      await product.save();

      // Log history
      await GlobalProductHistory.create({
        ean: ean,
        usuario_id: userId,
        alteracao: { oldStatus, newStatus: status, motivo },
        motivo: `Moderação: ${status}`
      });

      return res.json({ success: true, message: 'Status atualizado com sucesso' });
    } catch (err) {
      console.error('Error in updateStatus:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { ean } = req.params;
      const data = req.body;
      const userId = req.user.id;

      const product = await GlobalProduct.findByPk(ean);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Produto não encontrado' });
      }

      const oldData = product.toJSON();
      
      // Update fields
      const fields = ['nome_produto', 'foto_url', 'categoria_sugerida', 'marca', 'modelo', 'ncm'];
      fields.forEach(f => {
        if (data[f] !== undefined) product[f] = data[f];
      });

      if (data.status) product.status = data.status;

      await product.save();

      await GlobalProductHistory.create({
        ean: ean,
        usuario_id: userId,
        alteracao: { old: oldData, new: product.toJSON() },
        motivo: 'Edição direta via Admin'
      });

      return res.redirect(`/admin/global-catalog/${ean}`);
    } catch (err) {
       console.error('Error in update:', err);
       // Handle error properly, maybe flash message
       return res.status(500).send('Erro ao atualizar');
    }
  }
};
