const { Product, Category, Supplier, Sequelize } = require('../../models');
const { Op } = Sequelize;

module.exports = {
  // List all products for the company with pagination, search, and filtering
  async listProducts(req, res) {
    try {
      const { company_id } = req.user;
      const { 
        page = 1, 
        limit = 20, 
        search = '', 
        category_id = '', 
        sort = 'favorite' 
      } = req.query;

      const offset = (page - 1) * limit;
      
      const where = { company_id };
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { sku: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category_id && category_id !== '') {
        where.category_id = category_id;
      }

      // Ordering logic
      let order = [['createdAt', 'DESC']];
      if (sort === 'favorite') {
        order = [
          ['is_favorite', 'DESC'],
          ['name', 'ASC']
        ];
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        include: [
          { model: Category, attributes: ['id', 'name', 'color'] },
          { model: Supplier, attributes: ['id', 'name'] }
        ],
        order,
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });
      
      const categories = await Category.findAll({ where: { company_id } });
      const suppliers = await Supplier.findAll({ where: { company_id } });

      return { 
        products, 
        categories, 
        suppliers,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          currentLimit: parseInt(limit)
        },
        filters: {
          search,
          category_id,
          sort
        }
      };
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
  },

  // Toggle favorite status
  async toggleFavorite(req, res) {
    try {
      const { company_id } = req.user;
      const { id } = req.params;

      const product = await Product.findOne({ where: { id, company_id } });
      if (!product) throw new Error('Produto não encontrado');

      await product.update({ is_favorite: !product.is_favorite });

      return { success: true, is_favorite: product.is_favorite };
    } catch (err) {
      throw err;
    }
  },

  // Duplicate a product
  async duplicateProduct(req, res) {
    try {
      const { company_id } = req.user;
      const { id } = req.params;

      const original = await Product.findOne({ where: { id, company_id } });
      if (!original) throw new Error('Produto original não encontrado');

      const data = original.toJSON();
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.deletedAt;
      
      data.name = `${data.name} (Cópia)`;
      if (data.sku) data.sku = `${data.sku}-COPY`;

      const copy = await Product.create(data);

      return { success: true, product: copy };
    } catch (err) {
      throw err;
    }
  },

  // Bulk delete products
  async bulkDelete(req, res) {
    try {
      const { company_id } = req.user;
      const { ids } = req.body; // Array of IDs

      if (!ids || !Array.isArray(ids)) throw new Error('IDs inválidos');

      await Product.destroy({
        where: {
          id: ids,
          company_id
        }
      });

      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  // Bulk adjust products
  async bulkAdjust(req, res) {
    try {
      const { company_id } = req.user;
      const { ids, type, value, mode } = req.body;

      if (!ids || !Array.isArray(ids)) throw new Error('IDs inválidos');

      const products = await Product.findAll({ where: { id: ids, company_id } });
      const val = parseFloat(value);

      for (const product of products) {
        let updateData = {};
        if (type === 'price') {
          let newPrice = mode === 'fixed' ? val : product.price * (1 + val / 100);
          updateData.price = Math.max(0, newPrice);
        } else if (type === 'cost') {
          let newCost = mode === 'fixed' ? val : product.cost * (1 + val / 100);
          updateData.cost = Math.max(0, newCost);
        } else if (type === 'stock') {
          let newStock = mode === 'fixed' ? val : product.stock_quantity + val;
          updateData.stock_quantity = Math.max(0, newStock);
        }
        await product.update(updateData);
      }

      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  // Lightweight search for autocomplete
  async search(req, res) {
    try {
      const { company_id } = req.user;
      const { q } = req.query;

      if (!q || q.length < 2) return res.json([]);

      const products = await Product.findAll({
        where: {
          company_id,
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { sku: { [Op.like]: `%${q}%` } }
          ]
        },
        limit: 10,
        include: [{ model: Category, attributes: ['name', 'color'] }]
      });

      return res.json(products);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
