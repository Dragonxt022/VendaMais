# 📋 Sistema de Validação - VendaMais

## 🎯 Visão Geral

Sistema completo de validação e sanitização de dados para a aplicação VendaMais, organizado na pasta `utils/` com validações específicas para cada domínio.

## 📁 Estrutura

```
utils/
├── index.js                    # Exportação centralizada
├── productValidators.js        # Validações de produtos
├── stockValidators.js          # Validações de estoque
└── entityValidators.js         # Validações de categorias/fornecedores

middleware/
└── validation.js               # Middleware de validação (movido para pasta correta)
```

## 🚀 Como Usar

### Importação Simples
```javascript
const { createProductValidation, handleValidationErrors } = require('../utils');
```

### Importação Completa
```javascript
const {
  productValidators,
  stockValidators
} = require('../utils');

// Para o middleware de validação
const { handleValidationErrors, validate } = require('../middleware/validation');
```

### Combinações Prontas
```javascript
const { routes } = require('../utils');

// Usar validações prontas para rotas
router.post('/products', auth, ...routes.product.create, controller.create);
```

## 🔧 Validações Disponíveis

### Produtos (`productValidators.js`)

- **`createProductValidation`** - Validação para criação de produtos
- **`updateProductValidation`** - Validação para atualização de produtos  
- **`listProductsValidation`** - Validação para listagem (paginação, filtros)
- **`bulkAdjustValidation`** - Validação para ajuste em massa
- **`bulkDeleteValidation`** - Validação para exclusão em massa
- **`searchValidation`** - Validação para busca autocomplete
- **`idValidation`** - Validação genérica de ID

### Estoque (`stockValidators.js`)

- **`recordMovementValidation`** - Validação para movimentações
- **`stockHistoryValidation`** - Validação para histórico
- **`validateStockManagement`** - Verifica se produto gerencia estoque
- **`validateBulkStockAdjustment`** - Validação especial para ajuste em massa

### Entidades (`entityValidators.js`)

- **`categoryValidation`** - Validação para categorias
- **`supplierValidation`** - Validação para fornecedores

### Middleware (`middleware/validation.js`)

- **`handleValidationErrors`** - Tratamento centralizado de erros
- **`validate`** - Middleware de validação customizável
- **`validateAndSanitize`** - Validação + sanitização
- **`validateIf`** - Validação condicional
- **`validateFileUpload`** - Validação de uploads

> **Nota:** O middleware está localizado em `middleware/validation.js` para seguir o padrão arquitetural da aplicação.

## 🐛 Correção Implementada

### Bug de Atualização em Massa

**Problema:** Produtos com `manage_stock = false` estavam tendo seu estoque atualizado indevidamente.

**Solução:** 
1. Validação no middleware `validateBulkStockAdjustment`
2. Verificação no `ProductController.bulkAdjust()`
3. Produtos não gerenciáveis são ignorados com aviso

**Exemplo de resposta:**
```json
{
  "success": true,
  "updated": 5,
  "skipped": 2,
  "warning": "2 produtos não foram atualizados por não possuírem gerenciamento de estoque",
  "skippedProducts": [...]
}
```

## 📋 Regras de Validação

### Produtos

- **Nome:** 2-200 caracteres, obrigatório
- **SKU:** 1-50 caracteres, alfanumérico
- **EAN:** 8-13 dígitos numéricos
- **Preço/Custo:** Decimal positivo, máximo 999999.99
- **Estoque:** Inteiro não negativo, máximo 999999
- **Custo ≤ Preço:** Validação cruzada

### Estoque

- **Tipo:** 'in', 'out', 'adjustment'
- **Quantidade:** Inteiro positivo
- **Verificação:** Produto deve gerenciar estoque
- **Estoque suficiente:** Para saídas

### Categorias

- **Nome:** 2-100 caracteres, obrigatório
- **Cor:** Hexadecimal (#RGB ou #RRGGBB)

### Fornecedores

- **Nome:** 2-200 caracteres, obrigatório
- **Email:** Formato válido
- **Telefone:** Formato internacional
- **CNPJ:** Formato XX.XXX.XXX/XXXX-XX

## 🔒 Segurança

- **Sanitização automática** de espaços e caracteres especiais
- **Proteção contra injeção** com validação rigorosa
- **Isolamento por empresa** em todas as validações
- **Tratamento de erros** sem expor informações sensíveis

## 📊 Respostas de Erro

### Formato Padrão
```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "field": "price",
      "message": "Preço deve ser um número positivo",
      "value": "-10"
    }
  ],
  "message": "Por favor, corrija os erros e tente novamente"
}
```

### Resposta AJAX
```json
{
  "error": "Dados inválidos",
  "details": [...],
  "redirect": "/app/products"
}
```

## 🎮 Exemplos de Uso

### Rota Completa com Validação
```javascript
const { routes } = require('../utils');

router.post('/products', 
  auth, 
  ...routes.product.create, 
  async (req, res) => {
    // Controller já recebe dados validados
    await ProductController.create(req, res);
  }
);
```

### Validação Customizada
```javascript
const { validate, body } = require('../utils');

router.post('/custom', 
  auth,
  validate([
    body('custom_field').isEmail().withMessage('Deve ser email')
  ]),
  controller.action
);
```

### Validação Condicional
```javascript
const { validateIf, body } = require('../utils');

router.post('/conditional',
  validateIf(
    req => req.user.role === 'admin',
    [body('admin_field').notEmpty()]
  ),
  controller.action
);
```

## 🧪 Testes

Execute os testes para verificar as validações:

```bash
npm test
```

Todos os testes devem passar, incluindo:
- Validação de produtos
- Movimentações de estoque  
- Ajustes em massa
- Busca e paginação

## 🔄 Manutenção

### Adicionar Nova Validação

1. Criar no arquivo específico do domínio
2. Exportar em `index.js`
3. Adicionar às combinações de rotas se necessário
4. Escrever testes

### Modificar Validação Existente

1. Atualizar regra no arquivo correspondente
2. Verificar impacto nos testes
3. Atualizar documentação se necessário

## 📈 Performance

- **Validações assíncronas** para melhor performance
- **Lazy loading** de validadores específicos
- **Cache** de regras compiladas
- **Mínimo overhead** nas requisições

---

**Status:** ✅ Implementado e testado  
**Versão:** 1.0.0  
**Compatibilidade:** Express 4.x + Sequelize 6.x