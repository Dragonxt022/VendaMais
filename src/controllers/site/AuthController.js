const { User, Company, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');

async function getInitialSetupState() {
  const userCount = await User.count();
  return userCount === 0;
}

module.exports = {
  async needsInitialSetup() {
    return getInitialSetupState();
  },

  async showLogin(req, res) {
    return {
      title: 'Login - VendaMais'
    };
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('E-mail ou senha invalidos');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id
    };

    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';

    return { sessionUser, redirectPath };
  },

  async showRegister(req, res) {
    const isFirstUser = await getInitialSetupState();

    return {
      title: isFirstUser ? 'Criar Administrador Inicial - VendaMais' : 'Criar Conta - VendaMais',
      isFirstUser
    };
  },

  async showInitialAdminSetup(req, res) {
    return {
      title: 'Configuracao Inicial - VendaMais',
      isFirstUser: true
    };
  },

  async register(req, res) {
    const { name, email, password, company_name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Este e-mail ja esta em uso');
    }

    const isFirstUser = await getInitialSetupState();
    const transaction = await sequelize.transaction();

    try {
      const trialExpiresAt = new Date();
      trialExpiresAt.setDate(trialExpiresAt.getDate() + 3);

      const tempCnpj = 'TRIAL-' + Math.random().toString(36).slice(2, 11).toUpperCase();

      const company = await Company.create({
        name: company_name,
        cnpj: tempCnpj,
        plan: 'basic',
        status: 'active',
        trial_expires_at: trialExpiresAt
      }, { transaction });

      const password_hash = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email,
        password_hash,
        company_id: company.id,
        role: isFirstUser ? 'admin' : 'gerente'
      }, { transaction });

      await transaction.commit();
      return { success: true, isFirstUser };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async logout(req, res) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        resolve({ success: true, redirectPath: '/login' });
      });
    });
  }
};
