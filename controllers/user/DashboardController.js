class DashboardController {
    async index(req, res) {
        try {
            // Lógica para o dashboard do cliente
            return {
                title: 'Meu Painel - VendaMais',
                stats: {
                    activeOrders: 5,
                    revenue: 1200.50
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DashboardController();
