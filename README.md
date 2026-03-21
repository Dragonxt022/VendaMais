# VendaMais

Aplicacao web de gestao comercial com Node.js, Express, EJS, Sequelize e banco configurado por ambiente.

## Visao Geral

- O codigo da aplicacao fica em `src/`.
- Desenvolvimento usa SQLite por padrao.
- Producao usa MySQL.
- A configuracao de ambiente usa apenas `.env` e `.env.example`.

## Estrutura

```text
vendamais/
├── src/
│   ├── bin/
│   ├── controllers/
│   ├── database/
│   │   ├── init/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── development.sqlite
│   │   └── test.sqlite
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── views/
│   ├── app.js
│   └── server.js
├── scripts/
├── tests/
├── docker-compose.yml
└── ecosystem.config.js
```

## Configuracao

1. Instale as dependencias:

```powershell
npm install
```

2. Crie o arquivo de ambiente:

```powershell
copy .env.example .env
```

3. Escolha o banco pelo `.env`.

Desenvolvimento com SQLite:

```env
NODE_ENV=development
PORT=3000
DB_DIALECT=sqlite
DB_STORAGE=src/database/development.sqlite
```

Producao com MySQL:

```env
NODE_ENV=production
PORT=3000
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vendamais
DB_USER=root
DB_PASSWORD=rootpassword
```

## Banco de Dados

### Desenvolvimento

No desenvolvimento, nao precisa subir MySQL. O app usa o arquivo SQLite configurado em `DB_STORAGE`.

Resetar banco local:

```powershell
npm run db:reset
```

### Producao

Na producao, configure `NODE_ENV=production` e `DB_DIALECT=mysql`.

Se quiser usar o MySQL do `docker-compose` localmente:

```powershell
docker-compose up -d
```

O container usa os arquivos de inicializacao em `src/database/init`.

As migracoes historicas ficam em `src/database/migrations`.

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

A porta da aplicacao e controlada por `PORT` no `.env`.

## Uploads e Arquivos Publicos

- Os arquivos estaticos ficam em `src/public`.
- Os uploads ficam em `src/public/uploads`.
- Os icones fixos da interface ficam em `src/public/uploads/icon`.

## Comandos Uteis

- `npm run dev`: servidor em watch + Tailwind em watch
- `npm start`: sobe a aplicacao usando `src/server.js`
- `npm run tailwind:build`: recompila o CSS em `src/public/stylesheets/style.css`
- `npm run db:reset`: recria o banco com dados iniciais
- `npm run db:seed`: executa os seeders em `src/database/seeders`
- `npm test`: roda a suite de testes

## Observacoes

- Desenvolvimento usa SQLite por padrao.
- Producao usa MySQL.
- O reset do banco nao remove os icones de `src/public/uploads/icon`.

## Contribuicao

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licenca

Este projeto esta licenciado sob a GPL-3.0. Veja [LICENSE](LICENSE).
