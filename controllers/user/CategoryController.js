const { Category } = require('../../models');

module.exports = {
  async index(req, res) {
    try {
      const { company_id } = req.user;
      const categories = await Category.findAll({
        where: { company_id },
        order: [['name', 'ASC']]
      });
      return { categories };
    } catch (err) {
      throw err;
    }
  },

  async store(req, res) {
    try {
      const { name, description, color } = req.body;
      const { company_id } = req.user;

      const category = await Category.create({
        name,
        description,
        color,
        company_id
      });
      return { success: true, category };
    } catch (err) {
      throw err;
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, color } = req.body;
      const { company_id } = req.user;

      const category = await Category.findOne({ where: { id, company_id } });
      if (!category) throw new Error('Categoria não encontrada');

      await category.update({ name, description, color });
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const { company_id } = req.user;

      const category = await Category.findOne({ where: { id, company_id } });
      if (!category) throw new Error('Categoria não encontrada');

      await category.destroy();
      return { success: true };
    } catch (err) {
      throw err;
    }
  }
};
