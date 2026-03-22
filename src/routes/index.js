var express = require('express');
var router = express.Router();
const SiteController = require('../controllers/site/SiteController');
const AuthController = require('../controllers/site/AuthController');

function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    const userRole = req.session.user.role;

    let redirectPath = '/site';

    switch (userRole) {
      case 'admin':
        redirectPath = '/admin/dashboard';
        break;
      case 'gerente':
      case 'vendedor':
      case 'estoquista':
        redirectPath = '/app/dashboard';
        break;
      default:
        redirectPath = '/site';
    }

    return res.redirect(redirectPath);
  }

  next();
}

async function redirectToInitialSetupIfNeeded(req, res, next) {
  try {
    const needsInitialSetup = await AuthController.needsInitialSetup();

    if (needsInitialSetup && req.path !== '/setup/primeiro-admin') {
      return res.redirect('/setup/primeiro-admin');
    }

    next();
  } catch (err) {
    next(err);
  }
}

router.get('/', redirectToInitialSetupIfNeeded, async function(req, res, next) {
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

router.get('/setup/primeiro-admin', redirectIfAuthenticated, function(req, res, next) {
  AuthController.showInitialAdminSetup(req, res)
    .then(data => {
      res.render('site/pages/initial_admin_setup', { layout: 'site/layouts/site', ...data });
    })
    .catch(err => {
      next(err);
    });
});

router.post('/setup/primeiro-admin', async function(req, res, next) {
  try {
    await AuthController.register(req, res);
    res.redirect('/login');
  } catch (err) {
    const data = await AuthController.showInitialAdminSetup(req, res);
    res.render('site/pages/initial_admin_setup', {
      layout: 'site/layouts/site',
      ...data,
      error: err.message
    });
  }
});

router.get('/login', redirectIfAuthenticated, redirectToInitialSetupIfNeeded, function(req, res, next) {
  AuthController.showLogin(req, res)
    .then(data => {
      res.render('site/pages/login', { layout: 'site/layouts/site', ...data });
    })
    .catch(err => {
      next(err);
    });
});

router.post('/login', async function(req, res, next) {
  try {
    const { sessionUser, redirectPath } = await AuthController.login(req, res);
    req.session.user = sessionUser;
    req.session.save(() => {
      res.redirect(redirectPath);
    });
  } catch (err) {
    res.render('site/pages/login', {
      layout: 'site/layouts/site',
      title: 'Login - VendaMais',
      error: err.message
    });
  }
});

router.get('/register', redirectIfAuthenticated, async function(req, res, next) {
  try {
    if (await AuthController.needsInitialSetup()) {
      return res.redirect('/setup/primeiro-admin');
    }

    const data = await AuthController.showRegister(req, res);
    res.render('site/pages/register', { layout: 'site/layouts/site', ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    if (await AuthController.needsInitialSetup()) {
      return res.redirect('/setup/primeiro-admin');
    }

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
