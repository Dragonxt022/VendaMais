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
          ncm: product.ncm
        }
      });
    } catch (err) {
      console.error('Error in searchByEan:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
