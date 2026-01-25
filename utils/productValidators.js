const { body, param, query } = require('express-validator');

/**
 * Validações para criação de produtos
 */
const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome do produto é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU deve ter entre 1 e 50 caracteres')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('SKU deve conter apenas letras, números, hífens e underscores'),
  
  body('ean')
    .optional()
    .trim()
    .isLength({ min: 8, max: 13 })
    .withMessage('EAN deve ter entre 8 e 13 caracteres')
    .isNumeric()
    .withMessage('EAN deve conter apenas números'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  
  body('price')
    .notEmpty()
    .withMessage('Preço é obrigatório')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Preço deve ser um número positivo (máximo: 999999.99)'),
  
  body('cost')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Custo deve ser um número positivo (máximo: 999999.99)')
    .custom((value, { req }) => {
      if (value && req.body.price && parseFloat(value) > parseFloat(req.body.price)) {
        throw new Error('Custo não pode ser maior que o preço de venda');
      }
      return true;
    }),
  
  body('initial_stock')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 999999 })
    .withMessage('Estoque inicial deve ser um número inteiro não negativo (máximo: 999999)'),
  
  body('min_stock')
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage('Estoque mínimo deve ser um número inteiro não negativo (máximo: 999999)'),
  
  body('manage_stock')
    .optional()
    .custom(value => value === 'on' || value === 'true' || value === true || value === 'false' || value === false)
    .withMessage('Gerenciar estoque deve ser verdadeiro ou falso'),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID da categoria deve ser um número inteiro positivo'),
  
  body('supplier_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID do fornecedor deve ser um número inteiro positivo')
];

/**
 * Validações para atualização de produtos
 */
const updateProductValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID do produto deve ser um número inteiro positivo'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nome do produto não pode estar vazio')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU deve ter entre 1 e 50 caracteres')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('SKU deve conter apenas letras, números, hífens e underscores'),
  
  body('ean')
    .optional()
    .trim()
    .isLength({ min: 8, max: 13 })
    .withMessage('EAN deve ter entre 8 e 13 caracteres')
    .isNumeric()
    .withMessage('EAN deve conter apenas números'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Preço deve ser um número positivo (máximo: 999999.99)'),
  
  body('cost')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Custo deve ser um número positivo (máximo: 999999.99)')
    .custom((value, { req }) => {
      const price = parseFloat(req.body.price);
      const cost = parseFloat(value);
      if (price && cost > price) {
        throw new Error('Custo não pode ser maior que o preço de venda');
      }
      return true;
    }),
  
  body('min_stock')
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage('Estoque mínimo deve ser um número inteiro não negativo (máximo: 999999)'),
  
  body('manage_stock')
    .optional()
    .custom(value => value === 'on' || value === 'true' || value === true || value === 'false' || value === false)
    .withMessage('Gerenciar estoque deve ser verdadeiro ou falso'),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID da categoria deve ser um número inteiro positivo'),
  
  body('supplier_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID do fornecedor deve ser um número inteiro positivo')
];

/**
 * Validações para listagem de produtos
 */
const listProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número inteiro entre 1 e 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Busca deve ter entre 1 e 100 caracteres'),
  
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID da categoria deve ser um número inteiro positivo'),
  
  query('sort')
    .optional()
    .isIn(['favorite', 'name', 'price', 'stock', 'created'])
    .withMessage('Ordenação deve ser: favorite, name, price, stock ou created')
];

/**
 * Validações para ajuste em massa de produtos
 */
const bulkAdjustValidation = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs deve ser um array com pelo menos um elemento'),
  
  body('ids.*')
    .isInt({ min: 1 })
    .withMessage('Cada ID deve ser um número inteiro positivo'),
  
  body('type')
    .isIn(['price', 'cost', 'stock'])
    .withMessage('Tipo deve ser: price, cost ou stock'),
  
  body('mode')
    .isIn(['fixed', 'percentage'])
    .withMessage('Modo deve ser: fixed ou percentage'),
  
  body('value')
    .isFloat({ min: -999999, max: 999999 })
    .withMessage('Valor deve estar entre -999999 e 999999')
    .custom((value, { req }) => {
      if (req.body.mode === 'percentage' && (value < -100 || value > 100)) {
        throw new Error('Valor percentual deve estar entre -100 e 100');
      }
      if (req.body.type === 'stock' && req.body.mode === 'percentage') {
        throw new Error('Ajuste de estoque não pode ser percentual');
      }
      return true;
    })
];

/**
 * Validações para exclusão em massa
 */
const bulkDeleteValidation = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs deve ser um array com pelo menos um elemento'),
  
  body('ids.*')
    .isInt({ min: 1 })
    .withMessage('Cada ID deve ser um número inteiro positivo')
];

/**
 * Validações para busca de produtos
 */
const searchValidation = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Busca deve ter entre 2 e 50 caracteres')
];

/**
 * Validações para parâmetro ID
 */
const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID deve ser um número inteiro positivo')
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  listProductsValidation,
  bulkAdjustValidation,
  bulkDeleteValidation,
  searchValidation,
  idValidation
};