# VendaMais

VendaMais é uma aplicação web voltada para **gestão comercial**, com foco inicial em um **gerenciador de estoque profissional**, escalável e preparado para ambientes reais de produção.

O projeto está em fase inicial e atualmente possui apenas a **base da aplicação** configurada.

---

## 🧱 Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite (desenvolvimento)
- MySQL (produção)

### Frontend
- EJS (Server Side Rendering)
- Express EJS Layouts
- HTML5 / CSS3 (inicial)
- JavaScript Vanilla (inicial)

### Infraestrutura
- dotenv (variáveis de ambiente)
- express-session (sessões)
- express-mysql-session (sessão persistente em produção)
- morgan (logs)
- cookie-parser

---

## 📁 Estrutura Inicial do Projeto

```
vendamais/
├── bin/
│ └── www
├── config/
│ └── config.js (Sequelize)
├── models/
├── routes/
│ ├── index.js
│ └── users.js
├── views/
│ ├── layouts/
│ └── error.ejs
├── public/
├── app.js
├── .env
├── package.json
└── README.md 
``` 

---

## ⚙️ Configuração do Ambiente

### 1️⃣ Clonar o repositório
```bash
git clone <repositorio>
cd vendamais
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 4️⃣ Iniciar o servidor
```bash
npm run dev
```

### 5️⃣ Acessar a aplicação
```
http://localhost:3000
```

--- 

---

## 🔐 Gestão de Usuários (Planejamento)

A aplicação utilizará **controle de acesso baseado em papéis (RBAC)**.

### Tipos de Usuário
- Administrador
- Gerente
- Funcionário

### Permissões (exemplo)

| Módulo | Administrador | Gerente | Funcionário |
|------|--------------|--------|-------------|
| Usuários | ✔ | ✖ | ✖ |
| Estoque | ✔ | ✔ | ✔ (limitado) |
| Relatórios | ✔ | ✔ | ✖ |
| Configurações | ✔ | ✖ | ✖ |

---

## 📦 Gestão de Estoque (Módulo Inicial)

Este será o **primeiro módulo completo** da aplicação.

### Categorias
- Nome
- Foto

### Fornecedores
- Nome
- Contato
- Observações

### Produtos
Campos planejados:
- Foto
- Nome
- Valor de compra
- Valor de venda
- Quantidade
- Unidade de medida (QT / KG)
- Gramatura
- Quantidade mínima para alerta
- Código de barras
- SKU
- Categoria
- Fornecedor
- Produto gerenciável (sim/não)
- Controle de estoque (sim/não)

---

## 📊 Dashboard (Página Inicial)

A página inicial exibirá:
- Entrada de produtos
- Saída de produtos
- Estoque atual
- Produtos com estoque baixo
- Histórico de movimentações

---

## 🧠 Conceitos Profissionais Aplicados

- Separação de responsabilidades
- Controle de acesso por papel
- Histórico de movimentações de estoque
- Soft delete (planejado)
- Auditoria de ações críticas
- Preparação para escalabilidade

---

## ✅ Checklist — Próximos Passos

### Base
- [x] Express configurado
- [x] Sequelize configurado
- [x] SQLite no desenvolvimento
- [x] MySQL preparado para produção
- [x] Sessões configuradas
- [x] `.env` configurado

### Autenticação
- [ ] Model de Usuário
- [ ] Login
- [ ] Logout
- [ ] Middleware de rotas protegidas
- [ ] Controle de permissões

### Estoque
- [ ] Model Categoria
- [ ] Model Fornecedor
- [ ] Model Produto
- [ ] Movimentação de estoque
- [ ] Alerta de estoque baixo
- [ ] Dashboard inicial

### Frontend Administrativo
- [ ] Layout base do painel
- [ ] Menu dinâmico por permissão
- [ ] Telas de CRUD
- [ ] Validações de formulário

### Futuro
- [ ] Relatórios avançados
- [ ] Exportação PDF / Excel
- [ ] API pública
- [ ] Multi-empresa
- [ ] Logs de auditoria

---

## 🚀 Status do Projeto

🟡 **Em desenvolvimento — fase de base**

O foco atual é a construção de um **gerenciador de estoque robusto, confiável e profissional**.

---

## 📌 Observação Final

Este projeto é desenvolvido com foco em:
- Boas práticas
- Código limpo
- Evolução contínua
- Uso real em ambiente comercial
- Estamos usando arquitetura MVC para separar as responsabilidades da aplicação.
- Roteador renderiza a views e controller que irá processar as requisições, que passa por um middleware.
- As Utils irá conter funções com validações conversões e etc que serão usadas em todo o projeto.