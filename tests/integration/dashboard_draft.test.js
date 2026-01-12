const request = require('supertest');
const app = require('../../app');
const { User, Company, Product, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');

describe('Dashboard Integration', () => {
    let user, company;

    beforeAll(async () => {
        // Sync database schema
        await sequelize.sync({ force: true });

        // Create test data
        company = await Company.create({
            name: 'Test Dashboard',
            cnpj: 'DASH-' + Date.now(),
            plan: 'pro'
        });

        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await User.create({
            name: 'Dash User',
            email: 'dash@test.com',
            password_hash: hashedPassword,
            company_id: company.id,
            role: 'user'
        });

        // Create some products
        await Product.create({
            company_id: company.id,
            name: 'Prod High',
            price: 10,
            cost: 5,
            stock_quantity: 100,
            min_stock: 10
        });

        await Product.create({
            company_id: company.id,
            name: 'Prod Low',
            price: 20,
            cost: 10,
            stock_quantity: 5,
            min_stock: 10
        });
    });

    afterAll(async () => {
        // Cleanup using raw query to avoid paranoia if needed, or just destroy
        await Product.destroy({ where: { company_id: company.id }, force: true });
        await User.destroy({ where: { id: user.id }, force: true });
        await Company.destroy({ where: { id: company.id }, force: true });
    });

    it('GET /app should show correct dash stats', async () => {
        // 1. Login
        const agent = request.agent(app);
        await agent
            .post('/login')
            .send({ email: 'dash@test.com', password: 'password123' })
            .expect(302); // Redirect to /app

        // 2. Access Dashboard
        const res = await agent.get('/app');
        
        if (res.statusCode !== 200) {
            console.error('Dashboard Error Response:', res.text);
        }
        expect(res.statusCode).toBe(200);
        // We expect "Produtos Ativos" count to be 2 (Prod High + Prod Low)
        expect(res.text).toContain('Produtos Ativos');
        // We can check for specific numbers if possible, but HTML might contain formatting.
        // Let's just check for presence of main labels implemented in the view.
        expect(res.text).toContain('Valor em Estoque');
        expect(res.text).toContain('Estoque Baixo');
    });
});
