module.exports = (req, res, next) => {
    // Exemplo de middleware de autenticação
  if (req.session && req.session.user) {
    req.user = req.session.user;
    
    // Log de debug temporário para você ver no terminal do VS Code
    console.log(`[Auth] Usuário logado: ${req.user.email} | Role: ${req.user.role}`);

    // Se a rota for /admin, só permite se for admin
    if (req.originalUrl.startsWith('/admin') && req.user.role !== 'admin') {
        console.warn(`[Auth] Acesso NEGADO ao Admin para: ${req.user.email}`);
        const err = new Error('Acesso restrito a administradores');
        err.status = 403;
        return next(err);
    }
    
    return next();
  }
  
  // Se não estiver logado
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ error: 'Sessão expirada' });
  }
  
  res.redirect('/login');
};
