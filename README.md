# VendaMais

Aplicacao web de gestao comercial com Node.js, Express, EJS, Sequelize e MySQL.

## Visao Geral

- O codigo da aplicacao fica em `src/`.
- A estrutura publica e de banco tambem foi internalizada em `src`.
- A configuracao de ambiente usa apenas `.env` e `.env.example`.
- O ambiente ativo e controlado por `NODE_ENV` dentro do `.env`.

## Estrutura

```text
vendamais/
├── src/
│   ├── bin/
│   ├── controllers/
│   ├── database/
│   │   ├── init/
│   │   └── migrations/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   │   ├── images/
│   │   ├── javascripts/
│   │   ├── stylesheets/
│   │   └── uploads/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── views/
│   ├── app.js
│   └── server.js
├── scripts/
├── seeders/
├── tests/
├── docker-compose.yml
└── ecosystem.config.js
```

## Pre-requisitos

- Node.js 18+
- Docker Desktop
- PM2 opcional para executar em background

## Configuracao

1. Instale as dependencias:

```powershell
npm install
```

2. Crie o arquivo de ambiente:

```powershell
copy .env.example .env
```

3. Ajuste o `.env` conforme o ambiente desejado:

```env
NODE_ENV=development
SECRET=uma_chave_secreta_e_segura_aqui
SESSION_DURATION_HOURS=8

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vendamais
DB_USER=root
DB_PASSWORD=rootpassword
```

Se quiser rodar em producao, altere o `NODE_ENV` e os dados de conexao no proprio `.env`.

## Banco de Dados

Suba o MySQL com Docker:

```powershell
docker-compose up -d
```

O container usa os arquivos de inicializacao em `src/database/init`.

As migracoes historicas ficam em `src/database/migrations`.

Resete o banco e recrie os dados base:

```powershell
npm run db:reset
```

Usuarios iniciais criados no reset:

- `admin@vendamais.com / admin123`
- `gerente@teste.com / teste123`

Seeder opcional de produtos:

```powershell
npm run db:seed
```

## Executando a Aplicacao

Desenvolvimento:

```powershell
npm run dev
```

Build do CSS:

```powershell
npm run tailwind:build
```

Execucao normal:

```powershell
npm start
```

Execucao com PM2:

```powershell
npm run pm2:start
```

## Arquivos Publicos

- Os arquivos estaticos ficam em `src/public`.
- Os uploads ficam em `src/public/uploads`.
- Os icones fixos da interface ficam em `src/public/uploads/icon`.
- Avatares e imagens de produtos usam `src/public/uploads/avatars` e `src/public/uploads/products`.

Quando for preciso limpar uploads temporarios, remova apenas `avatars` e `products`. Os itens de `icon` devem ser preservados.

## Comandos Uteis

- `npm run dev`: servidor em watch + Tailwind em watch
- `npm start`: sobe a aplicacao usando `src/server.js`
- `npm run tailwind:build`: recompila o CSS em `src/public/stylesheets/style.css`
- `npm run db:reset`: recria o banco com dados iniciais
- `npm run db:seed`: popula produtos de teste
- `npm test`: roda a suite de testes

## Observacoes

- O projeto depende de um MySQL acessivel nas configuracoes do `.env`.
- O reset do banco nao remove os icones de `src/public/uploads/icon`.
- A raiz agora fica reservada para arquivos de orquestracao e suporte do projeto.

## Contribuicao

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licenca

Este projeto esta licenciado sob a GPL-3.0. Veja [LICENSE](LICENSE).
