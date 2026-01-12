const { Company } = require('../../models');

module.exports = {
  // List all companies
  async listCompanies(req, res) {
    try {
      const companies = await Company.findAll();
      return { companies };
    } catch (err) {
      throw err;
    }
  },

  // Create a new company
  async createCompany(req, res) {
    try {
      const { name, cnpj, plan, status } = req.body;
      const company = await Company.create({ name, cnpj, plan, status });
      return { company };
    } catch (err) {
      throw err;
    }
  },

  // Toggle company status (active/inactive)
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const company = await Company.findByPk(id);
      if (!company) {
        throw new Error('Company not found');
      }
      company.status = company.status === 'active' ? 'inactive' : 'active';
      await company.save();
      return { company };
    } catch (err) {
      throw err;
    }
  },
};
