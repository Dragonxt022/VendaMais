const { GlobalProduct } = require('../../models');

module.exports = {
  async searchByEan(req, res) {
    try {
      const { ean } = req.params;
      
      if (!ean) {
        return res.status(400).json({ success: false, message: 'EAN é obrigatório' });
      }

      const product = await GlobalProduct.findOne({
        where: { ean }
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Produto não encontrado no catálogo global' });
      }

      return res.json({
        success: true,
        product: {
          ean: product.ean,
          name: product.nome_produto,
          image_url: product.foto_url,
          category_suggestion: product.categoria_sugerida,
          brand: product.marca,
          model: product.modelo,
          ncm: product.ncm,
          status: product.status,
          confidence: product.nivel_confianca
        }
      });
    } catch (err) {
      console.error('Error in searchByEan:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async contribute(req, res) {
    try {
      const { 
        ean, name, image_url, category, brand, model, ncm 
      } = req.body;
      const userId = req.user ? req.user.id : null; // Assuming auth middleware sets req.user

      if (!ean || !name) {
        return res.status(400).json({ success: false, message: 'EAN e Nome são obrigatórios' });
      }

      let product = await GlobalProduct.findOne({ where: { ean } });
      let isNew = false;
      let oldData = {};

      if (!product) {
        isNew = true;
        // Logic for new product: status pending, low confidence
        product = await GlobalProduct.create({
          ean,
          nome_produto: name,
          foto_url: image_url,
          categoria_sugerida: category,
          marca: brand,
          modelo: model,
          ncm: ncm,
          status: 'pendente',
          nivel_confianca: 10, // Starting confidence
          quantidade_fontes: 1,
          origem: 'usuário'
        });
      } else {
        oldData = product.toJSON();
        // Logic for existing product: update confidence, maybe update fields if trusted
        // For now, simpler logic: just increment sources
        product.quantidade_fontes += 1;
        // Simple decay/growth logic could go here
        if (product.nivel_confianca < 100) product.nivel_confianca += 5;
        await product.save();
      }

      // Add to History
      const { GlobalProductHistory } = require('../../models');
      await GlobalProductHistory.create({
        ean: ean,
        usuario_id: userId,
        alteracao: {
          new: req.body,
          old: oldData
        },
        motivo: isNew ? 'Primeiro cadastro' : 'Contribuição de usuário'
      });

      return res.json({
        success: true,
        message: 'Contribuição registrada com sucesso',
        data: product
      });

    } catch (err) {
      console.error('Error in contribute:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
