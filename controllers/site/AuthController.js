const { User, Company } = require('../../models');
const bcrypt = require('bcryptjs');

module.exports = {
  // GET login page data
  async showLogin(req, res) {
    return {
      title: 'Login - VendaMais'
    };
  },

  // POST login action - returns session data and redirect path
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('E-mail ou senha inválidos');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id
    };

    const redirectPath = user.role === 'admin' ? '/admin' : '/app';
    
    return { sessionUser, redirectPath };
  },

  // GET register page data
  async showRegister(req, res) {
    return {
      title: 'Criar Conta - VendaMais'
    };
  },

  // POST register action - Creates Company AND User with 3-day trial
  async register(req, res) {
    const { name, email, password, company_name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Este e-mail já está em uso');
    }

    const { sequelize } = require('../../models');
    const t = await sequelize.transaction();

    try {
      // 1. Create the Company with a 3-day trial
      const trialExpiresAt = new Date();
      trialExpiresAt.setDate(trialExpiresAt.getDate() + 3);

      // Generate a placeholder CNPJ since it's required and unique in the model
      const tempCnpj = 'TRIAL-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      const company = await Company.create({
        name: company_name,
        cnpj: tempCnpj,
        plan: 'basic',
        status: 'active',
        trial_expires_at: trialExpiresAt
      }, { transaction: t });

      // 2. Create the User associated with the new company
      const password_hash = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email,
        password_hash,
        company_id: company.id,
        role: 'user'
      }, { transaction: t });

      await t.commit();
      return { success: true };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  // Logout action - destroys session
  async logout(req, res) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        resolve({ success: true, redirectPath: '/login' });
      });
    });
  }
};
