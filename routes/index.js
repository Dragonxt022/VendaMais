var express = require('express');
var router = express.Router();
const SiteController = require('../controllers/site/SiteController');
const AuthController = require('../controllers/site/AuthController');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const data = await SiteController.index(req, res);
    res.render('site/pages/home', { 
      layout: 'site/layouts/site', 
      ...data 
    });
  } catch (err) {
    next(err);
  }
});

// Authentication Routes
router.get('/login', async function(req, res, next) {
  try {
    const data = await AuthController.showLogin(req, res);
    res.render('site/pages/login', { layout: 'site/layouts/site', ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async function(req, res, next) {
  try {
    const { sessionUser, redirectPath } = await AuthController.login(req, res);
    req.session.user = sessionUser;
    res.redirect(redirectPath);
  } catch (err) {
    res.render('site/pages/login', { 
      layout: 'site/layouts/site', 
      title: 'Login - VendaMais',
      error: err.message 
    });
  }
});

router.get('/register', async function(req, res, next) {
  try {
    const data = await AuthController.showRegister(req, res);
    res.render('site/pages/register', { layout: 'site/layouts/site', ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    await AuthController.register(req, res);
    res.redirect('/login');
  } catch (err) {
    const data = await AuthController.showRegister(req, res);
    res.render('site/pages/register', { 
      layout: 'site/layouts/site', 
      ...data,
      error: err.message 
    });
  }
});

router.get('/logout', async function(req, res, next) {
  try {
    const { redirectPath } = await AuthController.logout(req, res);
    res.redirect(redirectPath);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
