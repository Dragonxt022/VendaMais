var express = require('express');
var router = express.Router();
const DashboardController = require('../controllers/user/DashboardController');
const auth = require('../middleware/auth');

/* GET user dashboard. */
router.get('/', auth, async function(req, res, next) {
  try {
    const data = await DashboardController.index(req, res);
    res.render('user/dashboard', { 
      layout: 'user/layouts/user',
      title: data.title, 
      ...data 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
