var express = require('express');
var router = express.Router();
const AdminController = require('../controllers/admin/AdminController');
const CompanyController = require('../controllers/admin/CompanyController');
const auth = require('../middleware/auth');
const GlobalCatalogController = require('../controllers/admin/GlobalCatalogController');

router.get('/dashboard', auth, async function(req, res, next) {
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

router.get('/companies/new', auth, async function(req, res, next) {
  try {
    const data = await CompanyController.showCreatePage(req, res);
    res.render('admin/companies/form', {
      layout: 'admin/layouts/admin',
      title: data.pageTitle,
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.post('/companies', auth, async function(req, res, next) {
  try {
    await CompanyController.createCompany(req, res);
    res.redirect('/admin/companies');
  } catch (err) {
    next(err);
  }
});

router.get('/companies/:id/edit', auth, async function(req, res, next) {
  try {
    const data = await CompanyController.showEditPage(req, res);
    res.render('admin/companies/form', {
      layout: 'admin/layouts/admin',
      title: data.pageTitle,
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.post('/companies/:id', auth, async function(req, res, next) {
  try {
    await CompanyController.updateCompany(req, res);
    res.redirect('/admin/companies');
  } catch (err) {
    next(err);
  }
});

router.post('/companies/:id/toggle', auth, async function(req, res, next) {
  try {
    await CompanyController.toggleStatus(req, res);
    res.redirect('/admin/companies');
  } catch (err) {
    next(err);
  }
});

router.get('/global-catalog', auth, async function(req, res, next) {
  try {
    const data = await GlobalCatalogController.index(req, res);
    res.render('admin/global_catalog/index', {
      layout: 'admin/layouts/admin',
      title: 'Catalogo Global',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.get('/global-catalog/:ean', auth, async function(req, res, next) {
  try {
    const product = await GlobalCatalogController.details(req, res);
    res.render('admin/global_catalog/details', {
      layout: 'admin/layouts/admin',
      title: `Produto: ${product.nome_produto}`,
      product
    });
  } catch (err) {
    next(err);
  }
});

router.post('/global-catalog/:ean/status', auth, GlobalCatalogController.updateStatus);
router.post('/global-catalog/:ean/update', auth, GlobalCatalogController.update);

module.exports = router;
