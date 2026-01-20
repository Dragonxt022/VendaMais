const { body, param } = require('express-validator');

/**
 * Validações para registro de movimentação de estoque
 */
const recordMovementValidation = [
  body('product_id')
    .isInt({ min: 1 })
    .withMessage('ID do produto deve ser um número inteiro positivo'),
  
  body('type')
    .isIn(['in', 'out', 'adjustment'])
    .withMessage('Tipo deve ser: in (entrada), out (saída) ou adjustment (ajuste)'),
  
  body('quantity')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Quantidade deve ser um número inteiro positivo (máximo: 999999)')
    .custom((value, { req }) => {
      if (req.body.type === 'adjustment') {
        // Para ajuste, quantidade pode ser o valor final do estoque
        return true;
      }
      return true;
    }),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Motivo deve ter entre 1 e 200 caracteres'),
  
  body('stock_lot_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID do lote deve ser um número inteiro positivo')
];

/**
 * Validações para histórico de estoque
 */
const stockHistoryValidation = [
  param('product_id')
    .isInt({ min: 1 })
    .withMessage('ID do produto deve ser um número inteiro positivo')
];

/**
 * Validação customizada para verificar se produto gerencia estoque
 */
const validateStockManagement = async (req, res, next) => {
  try {
    const { Product } = require('../models');
    const { company_id } = req.user;
    
    // Para movimentação individual
    if (req.body.product_id) {
      const product = await Product.findOne({
        where: { 
          id: req.body.product_id, 
          company_id 
        }
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      if (!product.manage_stock) {
        return res.status(400).json({ 
          error: 'Este produto não possui gerenciamento de estoque habilitado' 
        });
      }
    }
    
    // Para ajuste em massa
    if (req.body.ids && Array.isArray(req.body.ids)) {
      const products = await Product.findAll({
        where: { 
          id: req.body.ids, 
          company_id 
        }
      });
      
      const nonManageableProducts = products.filter(p => !p.manage_stock);
      
      if (nonManageableProducts.length > 0) {
        const productNames = nonManageableProducts.map(p => p.name);
        return res.status(400).json({ 
          error: `Os seguintes produtos não possuem gerenciamento de estoque: ${productNames.join(', ')}` 
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Erro na validação de gerenciamento de estoque:', error);
    res.status(500).json({ error: 'Erro interno ao validar gerenciamento de estoque' });
  }
};

/**
 * Validação para ajuste em massa considerando apenas produtos gerenciáveis
 */
const validateBulkStockAdjustment = async (req, res, next) => {
  try {
    const { Product } = require('../models');
    const { company_id } = req.user;
    const { ids, type } = req.body;
    
    // Se não for ajuste de estoque, permite continuar
    if (type !== 'stock') {
      return next();
    }
    
    // Buscar produtos e filtrar apenas os gerenciáveis
    const products = await Product.findAll({
      where: { 
        id: ids, 
        company_id 
      }
    });
    
    const manageableProducts = products.filter(p => p.manage_stock);
    const nonManageableProducts = products.filter(p => !p.manage_stock);
    
    // Se houver produtos não gerenciáveis, avisa mas continua com os gerenciáveis
    if (nonManageableProducts.length > 0) {
      console.warn(`Ignorando ${nonManageableProducts.length} produtos não gerenciáveis no ajuste de estoque`);
      
      // Atualiza a lista de IDs para apenas os gerenciáveis
      req.body.ids = manageableProducts.map(p => p.id);
      req.body.filteredProducts = {
        manageable: manageableProducts,
        ignored: nonManageableProducts
      };
    }
    
    // Se não houver produtos gerenciáveis, retorna erro
    if (manageableProducts.length === 0) {
      return res.status(400).json({ 
        error: 'Nenhum dos produtos selecionados possui gerenciamento de estoque habilitado' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Erro na validação de ajuste em massa:', error);
    res.status(500).json({ error: 'Erro interno ao validar ajuste em massa' });
  }
};

module.exports = {
  recordMovementValidation,
  stockHistoryValidation,
  validateStockManagement,
  validateBulkStockAdjustment
};