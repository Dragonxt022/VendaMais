var express = require('express');
var router = express.Router();
const DashboardController = require('../controllers/user/DashboardController');
const ProductController = require('../controllers/user/ProductController');
const StockController = require('../controllers/user/StockController');
const CategoryController = require('../controllers/user/CategoryController');
const SupplierController = require('../controllers/user/SupplierController');
const ProfileController = require('../controllers/user/ProfileController');
const auth = require('../middleware/auth');
const license = require('../middleware/license');
const multer = require('multer');
const path = require('path');
const { createUploadMiddleware } = require('../middleware/uploadMiddleware');

// Product upload configuration
const productUpload = createUploadMiddleware({
  destination: 'public/uploads',
  subDirectory: 'products',
  fieldName: 'image'
});


// Importar validações
const {
  routes: {
    product: productValidations,
    stock: stockValidations,
    entity: entityValidations
  }
} = require('../utils');

// Configure Multer for avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/* GET user dashboard. */
router.get('/', auth, license, async function(req, res, next) {
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

/* GET products list. */
router.get('/products', auth, license, async function(req, res, next) {
  try {
    const data = await ProductController.listProducts(req, res);
    res.render('user/products/index', {
      layout: 'user/layouts/user',
      title: 'Meus Produtos',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

/* POST create product. */
/* POST create product. */
router.post('/products', auth, productUpload, ...productValidations.create, async function(req, res, next) {
  try {
    const result = await ProductController.createProduct(req, res);
    
    // Se for AJAX/Fetch, retornar JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, ...result });
    }
    
    res.redirect('/app/products');
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    
    // Se houver erro e uma imagem foi enviada, deletar a imagem
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.log('[CLEANUP] Imagem removida após erro:', req.file.path);
        }
      } catch (cleanupErr) {
        console.error('[CLEANUP] Erro ao remover imagem:', cleanupErr);
      }
    }
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: err.message || 'Erro interno ao criar produto' });
    }
    next(err);
  }
});

router.post('/products/:id/update', auth, productUpload, ...productValidations.update, async function(req, res, next) {
  try {
    const result = await ProductController.updateProduct(req, res);
    
    // Se for AJAX/Fetch, retornar JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, ...result });
    }
    
    res.redirect('/app/products');
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    
    // Se houver erro e uma imagem foi enviada, deletar a imagem
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
        console.log('[CLEANUP] Imagem removida após erro:', req.file.path);
      } catch (cleanupErr) {
        console.error('[CLEANUP] Erro ao remover imagem:', cleanupErr);
      }
    }
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: err.message || 'Erro interno ao atualizar produto' });
    }
    next(err);
  }
});

/* POST toggle favorite. */
router.post('/products/:id/favorite', auth, ...productValidations.toggleFavorite, async function(req, res, next) {
  try {
    const result = await ProductController.toggleFavorite(req, res);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST duplicate product. */
router.post('/products/:id/duplicate', auth, ...productValidations.duplicate, async function(req, res, next) {
  try {
    const result = await ProductController.duplicateProduct(req, res);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const GlobalCatalogController = require('../controllers/user/GlobalCatalogController');
/* POST bulk actions. */
router.post('/products/bulk-delete', auth, ...productValidations.bulkDelete, async function(req, res, next) {
  try {
    const result = await ProductController.bulkDelete(req, res);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products/bulk-adjust', auth, ...productValidations.bulkAdjust, async function(req, res, next) {
  try {
    const result = await ProductController.bulkAdjust(req, res);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET search products (predictive). */
router.get('/products/search', auth, ...productValidations.search, async function(req, res, next) {
  try {
    await ProductController.search(req, res);
  } catch (err) {
    next(err);
  }
});

/* GET Global Catalog search. */
router.get('/global-catalog/:ean', auth, async function(req, res, next) {
  try {
    await GlobalCatalogController.searchByEan(req, res);
  } catch (err) {
    next(err);
  }
});

/* POST record stock movement. */
router.post('/stock/move', auth, license, ...stockValidations.recordMovement, async function(req, res, next) {
  try {
    await StockController.recordMovement(req, res);
    res.redirect('/app/products'); // Redirect back to products list
  } catch (err) {
    next(err);
  }
});

/* GET product history. */
router.get('/products/:product_id/history', auth, license, ...stockValidations.history, async function(req, res, next) {
  try {
    const data = await StockController.history(req, res);
    res.render('user/products/history', {
      layout: 'user/layouts/user',
      title: 'Histórico de Estoque',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

/* Categories Routes */
router.get('/categories', auth, license, async function(req, res, next) {
  try {
    const data = await CategoryController.index(req, res);
    res.render('user/categories/index', {
      layout: 'user/layouts/user',
      title: 'Categorias',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.post('/categories', auth, ...entityValidations.category, async function(req, res, next) {
  try {
    const result = await CategoryController.store(req, res);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json(result);
    }
    res.redirect('/app/categories');
  } catch (err) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: err.message });
    }
    next(err);
  }
});

/* Suppliers Routes */
router.get('/suppliers', auth, license, async function(req, res, next) {
  try {
    const data = await SupplierController.index(req, res);
    res.render('user/suppliers/index', {
      layout: 'user/layouts/user',
      title: 'Fornecedores',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.post('/suppliers', auth, ...entityValidations.supplier, async function(req, res, next) {
  try {
    const result = await SupplierController.store(req, res);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json(result);
    }
    res.redirect('/app/suppliers');
  } catch (err) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: err.message });
    }
    next(err);
  }
});

/* Profile Routes */
router.get('/profile', auth, async function(req, res, next) {
  try {
    const data = await ProfileController.index(req, res);
    res.render('user/profile', {
      layout: 'user/layouts/user',
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.post('/profile', auth, upload.single('avatar'), async function(req, res, next) {
  try {
    await ProfileController.update(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
