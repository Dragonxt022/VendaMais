# Docker Setup para Vendamais

Este projeto está configurado para rodar em containers Docker com MySQL, phpMyAdmin e PM2.

## Serviços Configurados

- **app**: Aplicação Node.js na porta 3000
- **mysql**: Banco de dados MySQL 8.0 na porta 3306
- **phpmyadmin**: Painel administrativo MySQL na porta 8080

## Como Usar

1. **Iniciar todos os serviços:**
   ```bash
   docker-compose up -d
   ```

2. **Verificar status:**
   ```bash
   docker-compose ps
   ```

3. **Ver logs da aplicação:**
   ```bash
   docker-compose logs app
   ```

4. **Parar serviços:**
   ```bash
   docker-compose down
   ```

## Acessos

- **Aplicação**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
  - Usuário: root
  - Senha: rootpassword

## Configurações de Banco

- **Host**: mysql
- **Database**: vendamais
- **User**: root
- **Password**: rootpassword
- **Port**: 3306

## Volumes

- `mysql_data`: Dados persistentes do MySQL
- `./public/uploads`: Arquivos de upload da aplicação

## Rede

Todos os serviços estão na rede `vendamais-network` para comunicação interna.