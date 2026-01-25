
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

const { sequelize } = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration (temporariamente desabilitado)
const sessionDuration = (process.env.SESSION_DURATION_HOURS || 8) * 60 * 60 * 1000;
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions',
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutos
  expiration: sessionDuration
});

app.use(session({
  key: 'vendamais.sid',
  secret: 'venda_mais_secret_key_fixed_123', // Chave fixa para depuração
  store: sessionStore,
  resave: true,                
  saveUninitialized: true,     
  proxy: true,                 
  cookie: {
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,             
    sameSite: 'lax'            
  }
}));

// Middleware de Debug de Sessão
app.use((req, res, next) => {
  console.log(`[DEBUG SESSION] Path: ${req.path} | ID: ${req.sessionID} | User na Sessão: ${req.session.user ? req.session.user.email : 'Vazio'}`);
  next();
});

// Sincroniza a tabela de sessões (em produção, use migrations)
sessionStore.sync();

const { defineAbilitiesFor } = require('./utils/ability');
// Disponibiliza o usuário para todas as views
app.use((req, res, next) => {
  const user = (req.session && req.session.user) ? req.session.user : null;
  res.locals.user = user;
  
  try {
    req.ability = defineAbilitiesFor(user);
    res.locals.ability = req.ability;
  } catch (err) {
    console.error('Erro ao definir permissões CASL:', err);
    req.ability = defineAbilitiesFor(null);
    res.locals.ability = req.ability;
  }
  
  // Handle notifications (toast)
  if (req.session && req.session.notification) {
    res.locals.notification = req.session.notification;
    delete req.session.notification; 
  } else {
    res.locals.notification = null;
  }
  
  next();
});

// Rotas
app.use('/', indexRouter);
app.use('/app', usersRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  
  // Define o título baseado no status
  const titles = {
    401: 'Acesso Não Autorizado',
    404: 'Página Não Encontrada',
    500: 'Erro Interno',
    502: 'Erro de Gateway'
  };

  const template = [401, 404, 500, 502].includes(status) ? `errors/${status}` : 'error';
  
  res.render(template, { 
    title: titles[status] || 'Erro',
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
