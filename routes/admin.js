var express = require('express');
var router = express.Router();
const AdminController = require('../controllers/admin/AdminController');
const CompanyController = require('../controllers/admin/CompanyController');
const auth = require('../middleware/auth');

/* GET admin dashboard. */
router.get('/', auth, async function(req, res, next) {
  try {
    const data = await AdminController.index(req, res);
    res.render('admin/dashboard', { 
      layout: 'admin/layouts/admin',
      title: data.title, 
      ...data 
    });
  } catch (err) {
    next(err);
  }
});

/* GET companies list. */
router.get('/companies', auth, async function(req, res, next) {
  try {
    const data = await CompanyController.listCompanies(req, res);
    res.render('admin/companies/index', {
      layout: 'admin/layouts/admin',
      title: 'Gerenciar Empresas',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

/* POST create company. */
router.post('/companies', auth, async function(req, res, next) {
  try {
    await CompanyController.createCompany(req, res);
    res.redirect('/admin/companies');
  } catch (err) {
    next(err);
  }
});

/* POST toggle company status. */
router.post('/companies/:id/toggle', auth, async function(req, res, next) {
  try {
    await CompanyController.toggleStatus(req, res);
    res.redirect('/admin/companies');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
