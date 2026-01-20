const { validationResult } = require('express-validator');

/**
 * Middleware central para tratamento de erros de validação
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @param {Function} next - Next function do Express
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Formatar erros para uma resposta mais amigável
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    // Verificar se é requisição AJAX ou API
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: formattedErrors,
        message: 'Por favor, corrija os erros e tente novamente'
      });
    }
    
    // Para requisições normais (formulários), adicionar flash message
    if (req.session) {
      req.session.notification = {
        type: 'error',
        title: 'Erro de Validação',
        message: 'Por favor, corrija os erros e tente novamente',
        details: formattedErrors
      };
    }
    
    return res.status(400).json({
      error: 'Dados inválidos',
      details: formattedErrors,
      redirect: req.originalUrl
    });
  }
  
  next();
};

/**
 * Middleware para validação específica com tratamento de erro customizado
 * @param {Array} validations - Array de validações do express-validator
 * @param {Function} customHandler - Função customizada para tratamento de erros (opcional)
 * @returns {Function} Middleware do Express
 */
const validate = (validations, customHandler = null) => {
  return async (req, res, next) => {
    // Executar todas as validações
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Verificar erros
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      if (customHandler) {
        return customHandler(req, res, errors);
      }
      
      return handleValidationErrors(req, res, next);
    }
    
    next();
  };
};

/**
 * Middleware para validar e sanitizar dados de forma segura
 * @param {Array} validations - Array de validações
 * @param {Object} options - Opções de validação
 * @returns {Function} Middleware do Express
 */
const validateAndSanitize = (validations, options = {}) => {
  const {
    stripWhitespace = true,
    trimStrings = true,
    convertToLowerCase = false,
    customSanitizers = []
  } = options;
  
  return async (req, res, next) => {
    // Executar validações
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Verificar erros
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return handleValidationErrors(req, res, next);
    }
    
    // Sanitização dos dados
    if (stripWhitespace || trimStrings || convertToLowerCase || customSanitizers.length > 0) {
      sanitizeRequestBody(req.body, {
        stripWhitespace,
        trimStrings,
        convertToLowerCase,
        customSanitizers
      });
    }
    
    next();
  };
};

/**
 * Função auxiliar para sanitizar o body da requisição
 * @param {Object} body - Body da requisição
 * @param {Object} options - Opções de sanitização
 */
const sanitizeRequestBody = (body, options) => {
  const { stripWhitespace, trimStrings, convertToLowerCase, customSanitizers } = options;
  
  const sanitizeValue = (value) => {
    if (typeof value !== 'string') {
      return value;
    }
    
    let sanitized = value;
    
    if (trimStrings) {
      sanitized = sanitized.trim();
    }
    
    if (stripWhitespace) {
      sanitized = sanitized.replace(/\s+/g, ' ');
    }
    
    if (convertToLowerCase) {
      sanitized = sanitized.toLowerCase();
    }
    
    // Aplicar sanitizadores customizados
    for (const sanitizer of customSanitizers) {
      sanitized = sanitizer(sanitized);
    }
    
    return sanitized;
  };
  
  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return sanitizeValue(obj);
  };
  
  sanitizeObject(body);
};

/**
 * Middleware para validação condicional
 * @param {Function} condition - Função que determina se a validação deve ser executada
 * @param {Array} validations - Array de validações
 * @returns {Function} Middleware do Express
 */
const validateIf = (condition, validations) => {
  return async (req, res, next) => {
    if (condition(req)) {
      return validate(validations)(req, res, next);
    }
    next();
  };
};

/**
 * Middleware para validação de arquivos upload
 * @param {Object} options - Opções de validação de arquivo
 * @returns {Function} Middleware do Express
 */
const validateFileUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    required = false
  } = options;
  
  return (req, res, next) => {
    if (!req.file && required) {
      return res.status(400).json({
        error: 'Arquivo é obrigatório'
      });
    }
    
    if (req.file) {
      // Validar tamanho
      if (req.file.size > maxSize) {
        return res.status(400).json({
          error: `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`
        });
      }
      
      // Validar tipo
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: `Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
        });
      }
    }
    
    next();
  };
};

module.exports = {
  handleValidationErrors,
  validate,
  validateAndSanitize,
  validateIf,
  validateFileUpload,
  sanitizeRequestBody
};