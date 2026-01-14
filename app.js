
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
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

app.use(session({
  key: 'vendamais.sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 dia
  }
}));

// Disponibiliza o usuário para todas as views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
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
