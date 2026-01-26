const { Company } = require('../../models');
const { createUploadMiddleware } = require('../../middleware/uploadMiddleware');
const imageService = require('../../services/imageService');

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
      const uploadMiddleware = createUploadMiddleware({
        destination: 'public/uploads',
        subDirectory: 'logos',
        fieldName: 'logo'
      });

      // Execute upload middleware
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const { name, cnpj, plan, status } = req.body;
      
      let logoUrl = null;
      if (req.file) {
        const imageData = imageService.processUploadedImage(req.file, 'logos');
        logoUrl = imageData.relativePath;
      }
      
      const company = await Company.create({ name, cnpj, plan, status, logo_url: logoUrl });
      return { company };
    } catch (err) {
      throw err;
    }
  },

  // Update a company
  async updateCompany(req, res) {
    try {
      const uploadMiddleware = createUploadMiddleware({
        destination: 'public/uploads',
        subDirectory: 'logos',
        fieldName: 'logo'
      });

      // Execute upload middleware
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const { id } = req.params;
      const { name, cnpj, plan, status, removeLogo } = req.body;

      const company = await Company.findByPk(id);
      if (!company) {
        throw new Error('Company not found');
      }

      let logoUrl = company.logo_url;

      // Handle logo upload or removal
      if (req.file) {
        // Delete old logo if exists
        if (company.logo_url) {
          imageService.deleteImage(company.logo_url);
        }
        const imageData = imageService.processUploadedImage(req.file, 'logos');
        logoUrl = imageData.relativePath;
      } else if (removeLogo === 'true' && company.logo_url) {
        imageService.deleteImage(company.logo_url);
        logoUrl = null;
      }

      await company.update({
        name,
        cnpj,
        plan,
        status,
        logo_url: logoUrl
      });

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
