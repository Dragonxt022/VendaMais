var express = require('express');
var router = express.Router();
const AdminController = require('../controllers/admin/AdminController');
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

module.exports = router;
