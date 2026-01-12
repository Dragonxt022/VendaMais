const { Company } = require('../models');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user.company_id) {
      return next();
    }

    const company = await Company.findByPk(req.user.company_id);

    if (!company) {
      return res.status(403).send('Empresa não encontrada.');
    }

    if (company.status !== 'active') {
      return res.status(403).send('Sua conta está inativa. Entre em contato com o suporte.');
    }

    if (company.trial_expires_at && new Date() > new Date(company.trial_expires_at)) {
      return res.status(403).render('site/pages/trial-expired', {
        layout: 'site/layouts/site',
        title: 'Teste Expirado - VendaMais',
        companyName: company.name
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
