# VendaMais

VendaMais é uma aplicação web voltada para **gestão comercial**, focada no setor gastronômico e licenciada sob a **GPL-3.0**. 🎉

O projeto utiliza um **Ambiente Híbrido** de desenvolvimento: o banco de dados roda em Docker, enquanto a aplicação Node.js roda diretamente no host Windows/Linux para maior agilidade, gerenciada pelo **PM2**.

---

## 📸 Demonstração do Sistema

<div align="center">
  <img src="imagem_projeto/01.png" alt="Dashboard Principal" width="850px">
  <p><i>Painel Geral de Indicadores</i></p>
  <br>
  <img src="imagem_projeto/02.png" alt="Gestão de Produtos" width="400px">
  <img src="imagem_projeto/03.png" alt="Controle de Estoque" width="400px">
</div>

---

## 🚀 Instalação e Execução (Ambiente Híbrido)

### 1. Pré-requisitos
- **Docker Desktop** (para o Banco de Dados)
- **Node.js 18+**
- **PM2** (`npm install -g pm2`)

### 2. Configuração Inicial
```powershell
# Clone o repositório
git clone https://github.com/Dragonxt022/vendamais.git
cd vendamais

# Configure as variáveis de ambiente (use localhost para o DB_HOST)
copy .env.example .env

# Instale as dependências
npm install
```

### 3. Subir o Banco de Dados (Docker)
Certifique-se de que o Docker Desktop está aberto e rodando.
```powershell
docker-compose up -d
```
*Isso iniciará o MySQL (porta 3306) e o phpMyAdmin (porta 8080).*

### 4. Preparar o Banco e Assets
```powershell
# Resetar e criar tabelas com dados iniciais
npm run db:reset

# Se quiser gerar 1000 produtos de teste
npm run db:seed

# Compilar o CSS (Tailwind)
npm run tailwind:build
```

### 5. Iniciar a Aplicação (PM2)
```powershell
npm run pm2:start
```

---

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor watch + Tailwind watch |
| `npm run tailwind:build` | Compila o CSS final |
| `npm run db:reset` | **Limpa o banco** e recria usuários base |
| `npm run db:seed` | Gera 1000 produtos de teste |
| `pm2 logs vendamais` | Visualiza os logs em tempo real |
| `pm2 monit` | Painel de monitoramento do PM2 |
| `docker-compose down` | Para o banco de dados |

---

## 📁 Estrutura do Projeto

```
vendamais/
├── controllers/    # Lógica por contexto (Admin, User, Site)
├── models/         # Modelos Sequelize (MySQL)
├── routes/         # Definição de rotas
├── views/          # Telas EJS com Tailwind CSS
├── public/         # Arquivos estáticos e CSS compilado
├── database/       # Scripts e inicialização do BD
├── scripts/        # Utilitários (reset, seed, sync)
├── ecosystem.config.js # Configuração do PM2
└── docker-compose.yml  # Configuração do MySQL/phpMyAdmin
```

---

## 🔐 Configuração do .env (Sugestão)
```env
# Banco de Dados
DB_HOST=localhost
DB_NAME=vendamais
DB_USER=root
DB_PASSWORD=rootpassword
DB_PORT=3306
DB_DIALECT=mysql
```

---

## ✅ Status do Projeto
- [x] Docker configurado para MySQL/phpMyAdmin
- [x] Node.js rodando fora do Docker com PM2
- [x] Scripts de Reset e Seed automatizados
- [x] Layout Responsivo com Tailwind CSS
- [x] Validações de Produto e Categoria corrigidas

---

## 🤝 Contribuição
Consulte o [Guia de Contribuição](CONTRIBUTING.md) e sinta-se à vontade para abrir Issues ou Pull Requests.

## 📄 Licença
Este projeto está licenciado sob a **GPL-3.0**. Veja o arquivo [LICENSE](LICENSE).

---
🟢 **Ambiente Híbrido Configurado e Pronto para Uso!**