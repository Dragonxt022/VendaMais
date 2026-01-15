module.exports = (req, res, next) => {
    // Exemplo de middleware de autenticação
    if (req.session && req.session.user) {
        req.user = req.session.user;
        
        // Proteção básica para rotas /admin
        if (req.originalUrl.startsWith('/admin') && req.user.role !== 'admin') {
            const err = new Error('Acesso restrito a administradores');
            err.status = 403;
            return next(err);
        }
        
        return next();
    }
    // Se não estiver autenticado, pode redirecionar ou lançar erro 401
    const err = new Error('Não autorizado');
    err.status = 401;
    next(err);
};
