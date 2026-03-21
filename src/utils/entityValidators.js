const { body } = require('express-validator');

/**
 * Validações para criação/atualização de categorias
 */
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome da categoria é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('color')
    .optional()
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Cor deve ser um código hexadecimal válido (#RRGGBB ou #RGB)')
];

/**
 * Validações para criação/atualização de fornecedores
 */
const supplierValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome do fornecedor é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email deve ser um endereço válido')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-\(\)]+$/)
    .withMessage('Telefone deve conter apenas números, espaços, hífens e parênteses')
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefone deve ter entre 8 e 20 caracteres'),
  
  body('cnpj')
    .optional()
    .trim()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Endereço deve ter no máximo 500 caracteres'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  
  body('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Estado deve ter entre 2 e 50 caracteres'),
  
  body('zip_code')
    .optional()
    .trim()
    .matches(/^\d{5}-\d{3}$/)
    .withMessage('CEP deve estar no formato XXXXX-XXX')
];

module.exports = {
  categoryValidation,
  supplierValidation
};