const { Company } = require('../../models');
const { createUploadMiddleware } = require('../../middleware/uploadMiddleware');
const imageService = require('../../services/imageService');

async function runLogoUpload(req, res) {
  const uploadMiddleware = createUploadMiddleware({
    destination: 'src/public/uploads',
    subDirectory: 'logos',
    fieldName: 'logo'
  });

  await new Promise((resolve, reject) => {
    uploadMiddleware(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  async listCompanies(req, res) {
    try {
      const companies = await Company.findAll({ order: [['createdAt', 'DESC']] });
      return { companies };
    } catch (err) {
      throw err;
    }
  },

  async showCreatePage(req, res) {
    return {
      company: {
        name: '',
        cnpj: '',
        plan: 'basic',
        status: 'active',
        logo_url: null
      },
      formMode: 'create',
      submitLabel: 'Criar empresa',
      pageTitle: 'Nova Empresa'
    };
  },

  async showEditPage(req, res) {
    const { id } = req.params;
    const company = await Company.findByPk(id);

    if (!company) {
      throw new Error('Empresa nao encontrada');
    }

    return {
      company,
      formMode: 'edit',
      submitLabel: 'Salvar alteracoes',
      pageTitle: 'Editar Empresa'
    };
  },

  async createCompany(req, res) {
    try {
      await runLogoUpload(req, res);

      const { name, cnpj, plan, status } = req.body;

      let logoUrl = null;
      if (req.file) {
        const imageData = imageService.processUploadedImage(req.file);
        logoUrl = imageData.relativePath;
      }

      const company = await Company.create({
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

  async updateCompany(req, res) {
    try {
      await runLogoUpload(req, res);

      const { id } = req.params;
      const { name, cnpj, plan, status, removeLogo } = req.body;

      const company = await Company.findByPk(id);
      if (!company) {
        throw new Error('Empresa nao encontrada');
      }

      let logoUrl = company.logo_url;

      if (req.file) {
        if (company.logo_url) {
          imageService.deleteImage(company.logo_url);
        }

        const imageData = imageService.processUploadedImage(req.file);
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

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const company = await Company.findByPk(id);
      if (!company) {
        throw new Error('Empresa nao encontrada');
      }

      company.status = company.status === 'active' ? 'inactive' : 'active';
      await company.save();
      return { company };
    } catch (err) {
      throw err;
    }
  }
};
