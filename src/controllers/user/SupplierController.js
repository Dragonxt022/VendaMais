const { Supplier } = require('../../models');

module.exports = {
  async index(req, res) {
    try {
      const { company_id } = req.user;
      const suppliers = await Supplier.findAll({
        where: { company_id },
        order: [['name', 'ASC']]
      });
      return { suppliers };
    } catch (err) {
      throw err;
    }
  },

  async store(req, res) {
    try {
      const { name, cnpj, email, phone } = req.body;
      const { company_id } = req.user;

      const supplier = await Supplier.create({
        name,
        cnpj,
        email,
        phone,
        company_id
      });
      return { success: true, supplier };
    } catch (err) {
      throw err;
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, cnpj, email, phone } = req.body;
      const { company_id } = req.user;

      const supplier = await Supplier.findOne({ where: { id, company_id } });
      if (!supplier) throw new Error('Fornecedor não encontrado');

      await supplier.update({ name, cnpj, email, phone });
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const { company_id } = req.user;

      const supplier = await Supplier.findOne({ where: { id, company_id } });
      if (!supplier) throw new Error('Fornecedor não encontrado');

      await supplier.destroy();
      return { success: true };
    } catch (err) {
      throw err;
    }
  }
};
