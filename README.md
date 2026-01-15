# VendaMais

VendaMais é uma aplicação web voltada para **gestão comercial**, focada no setor gastronômico e licenciada sob a **GPL-3.0**. 🎉

O projeto está em fase inicial e atualmente possui apenas a **base da aplicação** configurada.

Consulte o nosso [Guia de Contribuição](CONTRIBUTING.md) para saber como colaborar seguindo nossos padrões de arquitetura e design. 🛠️

---

## Algumas imagens do Gerenciamento

![image](https://github.com/Dragonxt022/VendaMais/imagem_projeto/01.png)
![image](https://github.com/Dragonxt022/VendaMais/imagem_projeto/02.png)
![image](https://github.com/Dragonxt022/VendaMais/imagem_projeto/03.png)
![image](https://github.com/Dragonxt022/VendaMais/imagem_projeto/04.png)
![image](https://github.com/Dragonxt022/VendaMais/imagem_projeto/05.png)

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
- Tailwind CSS (Interface Padrão)
- JavaScript Vanilla

### Infraestrutura
- dotenv (variáveis de ambiente)
- express-session (sessões)
- express-mysql-session (sessão persistente em produção)
- morgan (logs)
- cookie-parser

---

## 📁 Estrutura da Arquitetura SaaS

A aplicação segue uma arquitetura modular dividida em três contextos principais:

```
vendamais/
├── controllers/
│   ├── admin/      # Lógica do painel administrativo
│   ├── site/       # Lógica do site institucional/landing page
│   └── user/       # Lógica do painel do cliente/usuário
├── middleware/     # Filtros de autenticação e validação
├── routes/         # Definição de rotas por contexto
├── views/
│   ├── admin/      # Telas administrativas
│   ├── site/       # Telas do site (Pages e Components)
│   ├── user/       # Telas do cliente
│   └── errors/     # Páginas de erro (401, 404, 500, 502)
├── public/
│   ├── stylesheets/ # Tailwind compilado (style.css) e config (input.css)
│   └── javascripts/
├── app.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design e UI

Utilizamos **Tailwind CSS** para garantir uma interface moderna, rápida e consistente. 
- **Estilo**: Glassmorphism, tipografia moderna (Outfit) e paleta vibrante.
- **Compilação**: `npm run tailwind:build` para gerar o CSS final.
- **Desenvolvimento**: `npm run tailwind:watch` para auto-rebuild durante a criação.

---

## 🔐 Gestão de Controle (Arquitetura SaaS)

- **Controllers**: Toda a lógica de negócio reside nos controllers. Eles processam os dados e os retornam para o roteador.
- **Roteadores**: Responsáveis por validar a requisição (via middlewares), chamar o controller e renderizar a view final com os dados recebidos.
- **Middleware**: Gerencia permissões de acesso (ex: garantir que apenas usuários logados acessem `/admin` ou `/users`).

---

## ✅ Checklist — Status Atual

### Base e Arquitetura
- [x] Express e Sequelize configurados
- [x] Arquitetura SaaS (Admin, User, Site) implementada
- [x] Controllers separados por contexto
- [x] Tailwind CSS integrado e configurado
- [x] Tratamento de erros global (401, 404, 500, 502)

### Próximos Passos

- [ ] Implementar sistema completo de Autenticação (Login/Registro)
- [ ] Desenvolver telas CRUD para o Módulo de Estoque
- [ ] Criar componentes reutilizáveis com Tailwind

---

## 🚀 Status do Projeto

🟢 **Arquitetura Base Concluída**

O projeto agora possui uma fundação sólida e escalável, pronta para o desenvolvimento acelerado dos módulos de negócio.

---

## 📌 Documentação de Fluxo

- **MVC**: Seguimos fielmente o padrão MVC para separação de responsabilidades.
- **Utils**: Pasta dedicada a funções de validação, conversão e auxiliares globais.
- **Scripts**: 
    - `npm start`: Inicia a aplicação.
    - `npm run tailwind:build`: Compila o CSS.
    - `npm run tailwind:watch`: Monitora alterações no CSS.
