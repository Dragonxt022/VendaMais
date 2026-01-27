var express = require('express');
var router = express.Router();
const SiteController = require('../controllers/site/SiteController');
const AuthController = require('../controllers/site/AuthController');

// Função utilitária para redirecionar usuários logados
function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    const userRole = req.session.user.role;
    
    // Definir redirecionamento baseado no papel do usuário
    let redirectPath = '/site'; // padrão
    
    switch(userRole) {
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
  
  next(); // Continuar para a página se não estiver logado
}

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
router.get('/login', redirectIfAuthenticated, function(req, res, next) {
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

router.get('/register', redirectIfAuthenticated, function(req, res, next) {
  AuthController.showRegister(req, res)
    .then(data => {
      res.render('site/pages/register', { layout: 'site/layouts/site', ...data });
    })
    .catch(err => {
      next(err);
    });
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
