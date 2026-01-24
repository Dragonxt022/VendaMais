# Wiki VendaMais

Bem-vindo à documentação completa do projeto VendaMais!

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Guia de Instalação](#guia-de-instalação)
- [Desenvolvimento](#desenvolvimento)
- [Banco de Dados](#banco-de-dados)
- [API Reference](#api-reference)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [FAQ](#faq)

---

## 🎯 Visão Geral

### O que é o VendaMais?

VendaMais é um sistema de gestão comercial (ERP) focado no setor gastronômico, desenvolvido com arquitetura SaaS para atender restaurantes, bares, cafés e estabelecimentos similares.

### Objetivos Principais

- **Gestão Comercial**: Controlar vendas, estoque e finanças
- **Multi-tenant**: Atender múltiplos estabelecimentos com instância única
- **Escalabilidade**: Suportar从小 a grandes operações
- **Interface Moderna**: Experiência de usuário intuitiva e responsiva

### Público-Alvo

- Pequenos e médios estabelecimentos gastronômicos
- Empresas de food service
- Gerentes de restaurante
- Proprietários de negócio

---

## 🏗️ Arquitetura

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  EJS Templates  │  Tailwind CSS  │  JavaScript Vanilla     │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Express.js  │  Session Mgmt  │  Middleware  │  Controllers  │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Business Layer                            │
├─────────────────────────────────────────────────────────────┤
│  SaaS Contexts  │  Services  │  Validators  │  Utils         │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  Sequelize ORM  │  Models  │  SQLite/MySQL  │  Migrations    │
└─────────────────────────────────────────────────────────────┘
```

### Arquitetura SaaS Multi-Context

O sistema é dividido em três contextos principais:

#### 1. Contexto Admin
- **Painel Administrativo Global**
- **Gestão de Multi-tenants**
- **Configurações do Sistema**
- **Relatórios Consolidados**

#### 2. Contexto User
- **Painel do Cliente/Estabelecimento**
- **Gestão de Operações Diárias**
- **Relatórios Localizados**
- **Configurações do Tenant**

#### 3. Contexto Site
- **Landing Page Pública**
- **Marketing e Vendas**
- **Portal de Clientes**
- **Documentação**

### Padrões Arquiteturais

#### MVC (Model-View-Controller)
```javascript
// Model: Camada de dados
const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  stock: DataTypes.INTEGER
});

// Controller: Lógica de negócio
class ProductController {
  async create(req, res) {
    const product = await Product.create(req.body);
    res.render('admin/products/show', { product });
  }
}

// View: Apresentação
<%= product.name %> - R$ <%= product.price %>
```

#### Middleware Pipeline
```javascript
// Pipeline de autenticação
app.use('/admin', 
  requireAuth,           // Verifica sessão
  requireAdminRole,      // Verifica permissão
  validateTenant,        // Valida tenant
  adminRouter            // Roteamento
);
```

---

## 🚀 Guia de Instalação

### Pré-requisitos

#### Sistema Operacional
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 18.04+ / CentOS 7+
- ✅ Docker suportado em todos os SOs

#### Hardware Mínimo
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB livre
- **Network**: Conexão estável

#### Software Requerido
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **Node.js**: 18+ (apenas desenvolvimento local)

---

### Método 1: Docker (Recomendado)

#### Passo 1: Preparação do Ambiente

```bash
# Verificar instalação do Docker
docker --version
docker-compose --version

# Verificar se Docker está rodando
docker info
```

#### Passo 2: Clone e Configuração

```bash
# Clonar repositório
git clone https://github.com/SEU-USUARIO/vendamais.git
cd vendamais

# Configurar variáveis de ambiente
cp .env.example .env

# Editar configurações se necessário
nano .env  # Linux/macOS
notepad .env  # Windows
```

#### Passo 3: Inicialização

```bash
# Construir e iniciar containers
docker-compose up -d

# Verificar status
docker-compose ps

# Aguardar inicialização (30-60 segundos)
docker-compose logs -f app
```

#### Passo 4: Acesso

- **Aplicação**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **Usuário MySQL**: root
- **Senha MySQL**: rootpassword

---

### Método 2: Instalação Local

#### Windows

```powershell
# 1. Instalar Node.js
# Visite https://nodejs.org/ e instale a versão LTS

# 2. Instalar MySQL (opcional)
# Download: https://dev.mysql.com/downloads/mysql/

# 3. Clonar e configurar
git clone https://github.com/SEU-USUARIO/vendamais.git
cd vendamais
Copy-Item .env.example .env

# 4. Instalar dependências
npm install

# 5. Compilar CSS
npm run tailwind:build

# 6. Iniciar aplicação
npm start
```

#### Linux (Ubuntu/Debian)

```bash
# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar MySQL (opcional)
sudo apt update
sudo apt install mysql-server

# 3. Clonar e configurar
git clone https://github.com/SEU-USUARIO/vendamais.git
cd vendamais
cp .env.example .env

# 4. Instalar dependências
npm install

# 5. Compilar CSS
npm run tailwind:build

# 6. Iniciar aplicação
npm start
```

#### macOS

```bash
# 1. Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar Node.js
brew install node

# 3. Instalar MySQL (opcional)
brew install mysql

# 4. Clonar e configurar
git clone https://github.com/SEU-USUARIO/vendamais.git
cd vendamais
cp .env.example .env

# 5. Instalar dependências
npm install

# 6. Compilar CSS
npm run tailwind:build

# 7. Iniciar aplicação
npm start
```

---

## 💻 Desenvolvimento

### Ambiente de Desenvolvimento

#### Estrutura de Diretórios

```
vendamais/
├── src/
│   ├── controllers/          # Lógica de negócio
│   │   ├── admin/           # Controllers admin
│   │   ├── user/            # Controllers usuário
│   │   └── site/            # Controllers site
│   ├── middleware/          # Middlewares personalizados
│   ├── models/              # Modelos Sequelize
│   ├── routes/              # Definição de rotas
│   ├── services/            # Camada de serviços
│   ├── utils/               # Funções utilitárias
│   └── validators/          # Validações
├── views/                   # Templates EJS
│   ├── admin/              # Views admin
│   ├── user/               # Views usuário
│   ├── site/               # Views site
│   ├── partials/           # Componentes reutilizáveis
│   └── layouts/            # Layouts base
├── public/                  # Arquivos estáticos
│   ├── stylesheets/        # CSS compilado
│   ├── javascripts/        # Scripts frontend
│   └── uploads/           # Uploads de arquivo
├── config/                 # Arquivos de configuração
├── database/              # Arquivos do banco
├── tests/                 # Testes automatizados
└── docs/                  # Documentação
```

#### Configuração do Ambiente

```bash
# Instalar dependências de desenvolvimento
npm install --dev

# Configurar variáveis de desenvolvimento
cp .env.example .env.development

# Iniciar modo desenvolvimento
npm run dev

# Iniciar watch do Tailwind
npm run tailwind:watch
```

### Fluxo de Trabalho

#### 1. Desenvolvimento de Features

```bash
# Criar branch para nova feature
git checkout -b feature/nova-funcionalidade

# Desenvolver com hot-reload
npm run dev

# Testes automatizados
npm test

# Commit das mudanças
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Push e Pull Request
git push origin feature/nova-funcionalidade
```

#### 2. Padrões de Código

```javascript
// Controller Pattern
class ProductController {
  // Index - Listagem
  async index(req, res) {
    try {
      const products = await Product.findAll({
        where: { tenantId: req.tenant.id }
      });
      
      res.render('admin/products/index', { 
        products,
        title: 'Produtos'
      });
    } catch (error) {
      req.flash('error', 'Erro ao carregar produtos');
      res.redirect('/admin/products');
    }
  }

  // Create - Formulário
  create(req, res) {
    res.render('admin/products/create', {
      title: 'Novo Produto'
    });
  }

  // Store - Salvar
  async store(req, res) {
    try {
      const product = await Product.create({
        ...req.body,
        tenantId: req.tenant.id
      });
      
      req.flash('success', 'Produto criado com sucesso');
      res.redirect(`/admin/products/${product.id}`);
    } catch (error) {
      req.flash('error', 'Erro ao criar produto');
      res.redirect('/admin/products/create');
    }
  }
}
```

#### 3. Middleware Personalizado

```javascript
// middleware/auth.js
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'Faça login para continuar');
    return res.redirect('/login');
  }
  next();
};

// middleware/tenant.js
const requireTenant = async (req, res, next) => {
  const tenantId = req.session.tenantId;
  if (!tenantId) {
    return res.status(403).json({ error: 'Tenant não encontrado' });
  }
  
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) {
    return res.status(403).json({ error: 'Tenant inválido' });
  }
  
  req.tenant = tenant;
  next();
};
```

### Frontend Development

#### Tailwind CSS Workflow

```css
/* public/stylesheets/input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Componentes personalizados */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

#### Componentes EJS

```ejs
<!-- views/partials/header.ejs -->
<header class="bg-white shadow-sm border-b">
  <nav class="container mx-auto px-4 py-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img src="/images/logo.png" alt="VendaMais" class="h-8">
        <span class="text-xl font-bold text-gray-800">VendaMais</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <% if (user) { %>
          <span class="text-gray-600">Olá, <%= user.name %></span>
          <a href="/logout" class="btn-primary">Sair</a>
        <% } else { %>
          <a href="/login" class="btn-primary">Entrar</a>
        <% } %>
      </div>
    </div>
  </nav>
</header>
```

---

## 🗄️ Banco de Dados

### Arquitetura do Banco

#### Multi-Database Strategy

```javascript
// Desenvolvimento: SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/database.sqlite'
});

// Produção: MySQL
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
```

#### Schema Multi-Tenant

```sql
-- Tabela de Tenants
CREATE TABLE tenants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Usuários (Global)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'user') DEFAULT 'user',
  tenant_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Tabela de Produtos (Multi-tenant)
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  tenant_id INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Models Sequelize

#### Model Base

```javascript
// models/base.js
const { Model, DataTypes } = require('sequelize');

class BaseModel extends Model {
  static init(attributes, options = {}) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      ...attributes
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      ...options
    });
  }
}

module.exports = BaseModel;
```

#### Model de Produto

```javascript
// models/Product.js
const BaseModel = require('./base');

class Product extends BaseModel {
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 255]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      tenantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'tenant_id'
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'category_id'
      }
    }, {
      sequelize,
      tableName: 'products',
      scopes: {
        active: {
          where: { status: 'active' }
        },
        byTenant: (tenantId) => ({
          where: { tenantId }
        })
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    this.belongsTo(models.Tenant, {
      foreignKey: 'tenantId',
      as: 'tenant'
    });
    
    this.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems'
    });
  }
}

module.exports = Product;
```

### Migrations

#### Exemplo de Migration

```javascript
// migrations/001_create_tenants.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tenants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      domain: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tenants');
  }
};
```

### Seeders

#### Dados Iniciais

```javascript
// seeders/001_admin_user.js
const bcrypt = require('bcryptjs');
const { User, Tenant } = require('../models');

module.exports = {
  up: async () => {
    // Criar tenant principal
    const tenant = await Tenant.create({
      name: 'VendaMais Demo',
      slug: 'demo',
      status: 'active'
    });

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'Administrador',
      email: 'admin@vendamais.com',
      passwordHash: hashedPassword,
      role: 'super_admin',
      tenantId: tenant.id
    });
  },

  down: async () => {
    await User.destroy({ where: { email: 'admin@vendamais.com' } });
    await Tenant.destroy({ where: { slug: 'demo' } });
  }
};
```

---

## 📡 API Reference

### RESTful Endpoints

#### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### Produtos

```http
GET /api/products
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Produto Exemplo",
        "price": 29.90,
        "stock": 100,
        "status": "active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
}

POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Novo Produto",
  "description": "Descrição do produto",
  "price": 49.90,
  "stock": 50,
  "categoryId": 1
}
```

### WebSocket Events

#### Real-time Updates

```javascript
// Cliente WebSocket
const socket = io('http://localhost:3000');

// Escutar atualizações de estoque
socket.on('stock:updated', (data) => {
  console.log('Estoque atualizado:', data);
  // Atualizar UI em tempo real
});

// Escutar novos pedidos
socket.on('order:created', (order) => {
  console.log('Novo pedido:', order);
  // Notificar usuário
});
```

### Error Handling

#### Padrão de Resposta

```javascript
// Sucesso
{
  "success": true,
  "data": { /* dados */ },
  "message": "Operação realizada com sucesso"
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email é obrigatório"
      }
    ]
  }
}
```

---

## 🚀 Deploy

### Docker Production

#### Dockerfile Otimizado

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run tailwind:build

# Production stage
FROM node:18-alpine AS production

RUN apk add --no-cache dumb-init
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app ./config ./config
COPY --from=builder /app/models ./models
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/ecosystem.config.js ./

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

#### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_NAME=vendamais
      - DB_USER=vendamais
      - DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      - mysql
      - redis
    networks:
      - vendamais-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=vendamais
      - MYSQL_USER=vendamais
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./config/mysql.cnf:/etc/mysql/conf.d/mysql.cnf
    networks:
      - vendamais-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - vendamais-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - vendamais-network
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:

networks:
  vendamais-network:
    driver: bridge
```

### CI/CD Pipeline

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build CSS
        run: npm run tailwind:build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/vendamais
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🤝 Contribuição

### Guia de Contribuição

#### 1. Setup do Ambiente

```bash
# Fork do projeto
git clone https://github.com/SEU-USUARIO/vendamais.git
cd vendamais

# Configurar remote upstream
git remote add upstream https://github.com/USUARIO-ORIGINAL/vendamais.git

# Instalar dependências
npm install

# Configurar ambiente de desenvolvimento
cp .env.example .env.development
npm run dev
```

#### 2. Padrões de Commit

```bash
# Feature nova
git commit -m "feat: adiciona módulo de gestão de produtos"

# Bug fix
git commit -m "fix: corrige validação de formulário de login"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Refatoração
git commit -m "refactor: otimiza queries de banco de dados"
```

#### 3. Code Review

- ✅ Código segue padrões do projeto
- ✅ Testes incluídos (quando aplicável)
- ✅ Documentação atualizada
- ✅ Sem console.log() em produção
- ✅ Variáveis em português

#### 4. Pull Request Template

```markdown
## Descrição
Breve descrição da mudança implementada.

## Tipo de Mudança
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testes
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements
```

---

## ❓ FAQ

### Perguntas Frequentes

#### Q: Como trocar o banco de dados de SQLite para MySQL?

**R:** Siga estes passos:

1. **Instale MySQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt install mysql-server
   
   # macOS
   brew install mysql
   
   # Windows
   # Download do site oficial
   ```

2. **Configure o .env:**
   ```env
   NODE_ENV=production
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_NAME=vendamais
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_PORT=3306
   ```

3. **Crie o banco:**
   ```sql
   CREATE DATABASE vendamais;
   ```

4. **Rode as migrations:**
   ```bash
   npm run db:migrate
   ```

#### Q: Como adicionar um novo tenant?

**R:** Use o comando:

```bash
# Via console
node -e "
const { Tenant } = require('./models');
Tenant.create({ name: 'Novo Cliente', slug: 'novo-cliente' })
  .then(t => console.log('Tenant criado:', t.id))
  .catch(console.error);
"
```

#### Q: Como configurar HTTPS em produção?

**R:** Configure nginx com SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Q: Como fazer backup do banco de dados?

**R:** Scripts de backup:

```bash
# MySQL
docker exec mysql-container mysqldump -u root -p vendamais > backup.sql

# SQLite
cp database/database.sqlite backup/database_$(date +%Y%m%d).sqlite
```

#### Q: Como escalar horizontalmente?

**R:** Use docker-compose scale:

```bash
# Escalar app para 3 instâncias
docker-compose up -d --scale app=3

# Configurar load balancer (nginx)
upstream app_servers {
    server app_1:3000;
    server app_2:3000;
    server app_3:3000;
}
```

### Problemas Comuns

#### Docker Issues

**Problema:** "Port already in use"
```bash
# Solução
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Problema:** "Permission denied"
```bash
# Solução (Linux)
sudo usermod -aG docker $USER
# Logout e login novamente
```

#### Node.js Issues

**Problema:** "Module not found"
```bash
# Solução
rm -rf node_modules package-lock.json
npm install
```

**Problema:** "EACCES permission denied"
```bash
# Solução (Linux/macOS)
sudo chown -R $USER:$USER ./
chmod +x ./bin/www
```

#### Banco de Dados Issues

**Problema:** "Connection refused"
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Iniciar MySQL
sudo systemctl start mysql
```

---

## 📞 Suporte e Contato

### Canais de Suporte

- **GitHub Issues**: [Reportar Bugs](https://github.com/SEU-USUARIO/vendamais/issues)
- **GitHub Discussions**: [Dúvidas Gerais](https://github.com/SEU-USUARIO/vendamais/discussions)
- **Email**: suporte@vendamais.com
- **Discord**: [Servidor Comunitário](https://discord.gg/vendamais)

### Tempo de Resposta

- **Crítico**: 2-4 horas
- **Alto**: 24 horas
- **Médio**: 48 horas
- **Baixo**: 72 horas

### SLA (Service Level Agreement)

| Nível | Descrição | Tempo Resposta | Tempo Resolução |
|-------|-----------|----------------|-----------------|
| P1 | Sistema indisponível | 1 hora | 4 horas |
| P2 | Funcionalidade crítica afetada | 4 horas | 24 horas |
| P3 | Funcionalidade não crítica | 24 horas | 72 horas |
| P4 | Melhoria/Documentação | 48 horas | 7 dias |

---

## 📄 Licença

Este projeto está licenciado sob **GPL-3.0**.

### O que significa?

- ✅ Uso comercial permitido
- ✅ Modificação permitida
- ✅ Distribuição permitida
- � Uso privado permitido
- ⚠️ Mesma licença requerida
- ⚠️ Direitos autorais devem ser mantidos

### Direitos Autorais

© 2026 VendaMais. Todos os direitos reservados.

---

## 🗺️ Roadmap

### Versão 1.0 (Q1 2026)
- [x] Arquitetura base
- [x] Sistema multi-tenant
- [ ] Autenticação completa
- [ ] CRUD de produtos
- [ ] Gestão de estoque

### Versão 1.1 (Q2 2026)
- [ ] Sistema de pedidos
- [ ] Integração com pagamento
- [ ] Relatórios avançados
- [ ] API REST completa

### Versão 2.0 (Q3 2026)
- [ ] Aplicativo mobile
- [ ] Sistema de notificações
- [ ] Integração com delivery
- [ ] AI para previsão de demanda

### Versão 3.0 (Q4 2026)
- [ ] Marketplace de fornecedores
- [ ] Sistema de franquias
- [ ] Analytics avançado
- [ ] Blockchain para rastreabilidade

---

## 📊 Estatísticas do Projeto

### Métricas Atuais
- **Stars**: ⭐ (em breve)
- **Forks**: 🍴 (em breve)
- **Issues**: 🐛 (em breve)
- **Contribuidores**: 👥 (em breve)
- **Último Release**: 📦 (em breve)

### Tecnologias Utilizadas
- **Linguagens**: JavaScript, CSS, HTML
- **Frameworks**: Express.js, EJS, Tailwind CSS
- **Bancos**: SQLite, MySQL
- **Ferramentas**: Docker, Node.js, PM2

---

*Esta wiki está em constante atualização. Última modificação: 24/01/2026*