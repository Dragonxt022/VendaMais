const { Product, Category, Supplier } = require('../../models');

module.exports = {
  // List all products for the company
  async listProducts(req, res) {
    try {
      const { company_id } = req.user; // Assuming req.user is populated by auth middleware
      const products = await Product.findAll({
        where: { company_id },
        include: [
          { model: Category, attributes: ['name', 'color'] },
          { model: Supplier, attributes: ['name'] }
        ]
      });
      
      const categories = await Category.findAll({ where: { company_id } });
      const suppliers = await Supplier.findAll({ where: { company_id } });

      return { products, categories, suppliers };
    } catch (err) {
      console.error('Error in listProducts:', err);
      throw err;
    }
  },

  // Create a new product
  async createProduct(req, res) {
    try {
      const { company_id } = req.user;
      const { name, sku, description, price, cost, min_stock, initial_stock, category_id, supplier_id, manage_stock } = req.body;
      
      const product = await Product.create({
        company_id,
        name,
        sku,
        description,
        price,
        cost,
        stock_quantity: initial_stock || 0,
        min_stock: min_stock || 0,
        manage_stock: manage_stock === 'on' || manage_stock === true,
        category_id: category_id || null,
        supplier_id: supplier_id || null
      });
      
      return { product };
    } catch (err) {
      throw err;
    }
  },

  // Update a product
  async updateProduct(req, res) {
    try {
      const { company_id } = req.user;
      const { id } = req.params;
      const { name, sku, description, price, cost, min_stock, category_id, supplier_id, manage_stock } = req.body;

      const product = await Product.findOne({ where: { id, company_id } });
      if (!product) throw new Error('Produto não encontrado');

      await product.update({
        name,
        sku,
        description,
        price,
        cost,
        min_stock: min_stock || 0,
        manage_stock: manage_stock === 'on' || manage_stock === true,
        category_id: category_id || null,
        supplier_id: supplier_id || null
      });

      return { product };
    } catch (err) {
      throw err;
    }
  }
};
