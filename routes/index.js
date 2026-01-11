var express = require('express');
var router = express.Router();
const SiteController = require('../controllers/site/SiteController');

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

module.exports = router;
