/**
 * Exportação centralizada de todas as validações
 * Organiza os validadores por domínio para fácil importação
 */

// Validadores de Produtos
const {
  createProductValidation,
  updateProductValidation,
  listProductsValidation,
  bulkAdjustValidation,
  bulkDeleteValidation,
  searchValidation,
  idValidation
} = require('./productValidators');

// Validadores de Estoque
const {
  recordMovementValidation,
  stockHistoryValidation,
  validateStockManagement,
  validateBulkStockAdjustment
} = require('./stockValidators');

// Validadores de Entidades (Categorias, Fornecedores)
const {
  categoryValidation,
  accountCategoryValidation,
  supplierValidation
} = require('./entityValidators');
const {
  normalizeCurrencyInput,
  formatCurrency
} = require('./currency');

// Middleware de Validação
const {
  handleValidationErrors,
  validate,
  validateAndSanitize,
  validateIf,
  validateFileUpload,
  sanitizeRequestBody
} = require('../middleware/validation');

// Combinações de validação comuns
const productRoutes = {
  create: [createProductValidation, handleValidationErrors],
  update: [updateProductValidation, handleValidationErrors],
  list: [listProductsValidation, handleValidationErrors],
  bulkAdjust: [bulkAdjustValidation, validateBulkStockAdjustment, handleValidationErrors],
  bulkDelete: [bulkDeleteValidation, handleValidationErrors],
  search: [searchValidation, handleValidationErrors],
  toggleFavorite: [idValidation, handleValidationErrors],
  duplicate: [idValidation, handleValidationErrors]
};

const stockRoutes = {
  recordMovement: [recordMovementValidation, validateStockManagement, handleValidationErrors],
  history: [stockHistoryValidation, handleValidationErrors]
};

const entityRoutes = {
  category: [categoryValidation, handleValidationErrors],
  accountCategory: [accountCategoryValidation, handleValidationErrors],
  supplier: [supplierValidation, handleValidationErrors]
};

module.exports = {
  // Validadores individuais
  productValidators: {
    createProductValidation,
    updateProductValidation,
    listProductsValidation,
    bulkAdjustValidation,
    bulkDeleteValidation,
    searchValidation,
    idValidation
  },
  
  stockValidators: {
    recordMovementValidation,
    stockHistoryValidation,
    validateStockManagement,
    validateBulkStockAdjustment
  },
  
  entityValidators: {
    categoryValidation,
    accountCategoryValidation,
    supplierValidation
  },
  
  // Middleware
  validationMiddleware: {
    handleValidationErrors,
    validate,
    validateAndSanitize,
    validateIf,
    validateFileUpload,
    sanitizeRequestBody
  },
  
  // Combinações prontas para uso
  routes: {
    product: productRoutes,
    stock: stockRoutes,
    entity: entityRoutes
  },
  
  // Exportações diretas para conveniência
  createProductValidation,
  updateProductValidation,
  listProductsValidation,
  bulkAdjustValidation,
  bulkDeleteValidation,
  searchValidation,
  idValidation,
  recordMovementValidation,
  stockHistoryValidation,
  validateStockManagement,
  validateBulkStockAdjustment,
  categoryValidation,
  accountCategoryValidation,
  supplierValidation,
  normalizeCurrencyInput,
  formatCurrency,
  handleValidationErrors,
  validate,
  validateAndSanitize,
  validateIf,
  validateFileUpload,
  sanitizeRequestBody
};
