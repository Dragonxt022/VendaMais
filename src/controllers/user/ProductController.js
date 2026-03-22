const { Product, Category, Supplier, Sequelize } = require('../../models');
const { Op } = Sequelize;
const imageService = require('../../services/imageService');
const { normalizeCurrencyInput } = require('../../utils');

module.exports = {
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
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
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
          currentPage: parseInt(page, 10),
          currentLimit: parseInt(limit, 10)
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

  async createProduct(req, res) {
    try {
      const { company_id } = req.user;
      const {
        name,
        sku,
        description,
        price,
        cost,
        min_stock,
        initial_stock,
        category_id,
        supplier_id,
        manage_stock
      } = req.body;

      let imageUrl = null;
      if (req.file) {
        const imageData = imageService.processUploadedImage(req.file, 'products');
        imageUrl = imageData.relativePath;
      }

      const product = await Product.create({
        company_id,
        name,
        sku,
        description,
        price: normalizeCurrencyInput(price),
        cost: normalizeCurrencyInput(cost),
        stock_quantity: initial_stock || 0,
        min_stock: min_stock || 0,
        manage_stock: manage_stock === 'on' || manage_stock === true,
        category_id: category_id || null,
        supplier_id: supplier_id || null,
        image_url: imageUrl
      });

      return { product };
    } catch (err) {
      throw err;
    }
  },

  async updateProduct(req, res) {
    try {
      const { company_id } = req.user;
      const { id } = req.params;
      const {
        name,
        sku,
        description,
        price,
        cost,
        min_stock,
        category_id,
        supplier_id,
        manage_stock,
        removeImage
      } = req.body;

      const product = await Product.findOne({ where: { id, company_id } });
      if (!product) {
        throw new Error('Produto nao encontrado');
      }

      let imageUrl = product.image_url;

      if (req.file) {
        if (product.image_url) {
          imageService.deleteImage(product.image_url);
        }

        const imageData = imageService.processUploadedImage(req.file, 'products');
        imageUrl = imageData.relativePath;
      } else if (removeImage === 'true' && product.image_url) {
        imageService.deleteImage(product.image_url);
        imageUrl = null;
      }

      await product.update({
        name,
        sku,
        description,
        price: normalizeCurrencyInput(price),
        cost: normalizeCurrencyInput(cost),
        min_stock: min_stock || 0,
        manage_stock: manage_stock === 'on' || manage_stock === true,
        category_id: category_id || null,
        supplier_id: supplier_id || null,
        image_url: imageUrl
      });

      return { product };
    } catch (err) {
      throw err;
    }
  },

  async toggleFavorite(req, res) {
    try {
      const { company_id } = req.user;
      const { id } = req.params;

      const product = await Product.findOne({ where: { id, company_id } });
      if (!product) {
        throw new Error('Produto nao encontrado');
      }

      await product.update({ is_favorite: !product.is_favorite });
      return { success: true, is_favorite: product.is_favorite };
    } catch (err) {
      throw err;
    }
  },

  async duplicateProduct(req, res) {
    try {
      const { company_id } = req.user;
      const { id } = req.params;

      const original = await Product.findOne({ where: { id, company_id } });
      if (!original) {
        throw new Error('Produto original nao encontrado');
      }

      const data = original.toJSON();
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.deletedAt;

      data.name = `${data.name} (Copia)`;
      if (data.sku) {
        data.sku = `${data.sku}-COPY`;
      }

      const copy = await Product.create(data);
      return { success: true, product: copy };
    } catch (err) {
      throw err;
    }
  },

  async bulkDelete(req, res) {
    try {
      const { company_id } = req.user;
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids)) {
        throw new Error('IDs invalidos');
      }

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

  async bulkAdjust(req, res) {
    try {
      const { company_id } = req.user;
      const { ids, type, value, mode } = req.body;

      if (!ids || !Array.isArray(ids)) {
        throw new Error('IDs invalidos');
      }

      const products = await Product.findAll({ where: { id: ids, company_id } });
      const val = normalizeCurrencyInput(value);
      const updatedProducts = [];
      const skippedProducts = [];

      for (const product of products) {
        const updateData = {};
        let shouldUpdate = false;

        if (type === 'price') {
          const newPrice = mode === 'fixed' ? val : Number(product.price) * (1 + val / 100);
          updateData.price = Math.max(0, newPrice);
          shouldUpdate = true;
        } else if (type === 'cost') {
          const newCost = mode === 'fixed' ? val : Number(product.cost || 0) * (1 + val / 100);
          updateData.cost = Math.max(0, newCost);
          shouldUpdate = true;
        } else if (type === 'stock') {
          if (product.manage_stock) {
            const newStock = mode === 'fixed' ? val : Number(product.stock_quantity || 0) + val;
            updateData.stock_quantity = Math.max(0, Math.round(newStock));
            shouldUpdate = true;
          } else {
            skippedProducts.push({
              id: product.id,
              name: product.name,
              reason: 'Produto nao possui gerenciamento de estoque habilitado'
            });
            continue;
          }
        }

        if (shouldUpdate) {
          await product.update(updateData);
          updatedProducts.push({
            id: product.id,
            name: product.name,
            updated: updateData
          });
        }
      }

      const result = {
        success: true,
        updated: updatedProducts.length,
        skipped: skippedProducts.length
      };

      if (skippedProducts.length > 0) {
        result.warning = `${skippedProducts.length} produtos nao foram atualizados por nao possuirem gerenciamento de estoque`;
        result.skippedProducts = skippedProducts;
      }

      return result;
    } catch (err) {
      throw err;
    }
  },

  async search(req, res) {
    try {
      const { company_id } = req.user;
      const { q } = req.query;

      if (!q || q.length < 2) {
        return res.json([]);
      }

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
