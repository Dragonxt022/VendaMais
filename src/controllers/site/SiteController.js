class SiteController {
    async index(req, res) {
        try {
            // Lógica para a landing page do SaaS
            return {
                title: 'VendaMais - Aumente suas vendas',
                features: [
                    'Gestão Completa',
                    'Automação de Vendas',
                    'Relatórios em Tempo Real'
                ]
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SiteController();
