#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Inicia o servidor Express
const server = spawn('node', [path.join(__dirname, 'bin/www')], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (error) => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Servidor encerrado com código ${code}`);
  process.exit(code);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando servidor...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, encerrando servidor...');
  server.kill('SIGINT');
});