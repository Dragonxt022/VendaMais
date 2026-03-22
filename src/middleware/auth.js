module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;

    if (process.env.DEBUG_AUTH === 'true') {
      console.log(`[Auth] Usuario logado: ${req.user.email} | Role: ${req.user.role}`);
    }

    if (req.originalUrl.startsWith('/admin') && req.user.role !== 'admin') {
      if (process.env.DEBUG_AUTH === 'true') {
        console.warn(`[Auth] Acesso negado ao admin para: ${req.user.email}`);
      }

      const err = new Error('Acesso restrito a administradores');
      err.status = 403;
      return next(err);
    }

    return next();
  }

  if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
    return res.status(401).json({ error: 'Sessao expirada' });
  }

  return res.redirect('/login');
};
