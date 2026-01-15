const request = require('supertest');
const app = require('../../app');
const { User, Company, Product, Category, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');

describe('Product Integration', () => {
    let user, company, category, products = [];

    beforeAll(async () => {
        // Sync database schema
        await sequelize.sync({ force: true });

        company = await Company.create({
            name: 'Stock Test Co',
            cnpj: 'PROD-' + Date.now(),
            plan: 'pro'
        });

        const hashedPassword = await bcrypt.hash('pass123', 10);
        user = await User.create({
            name: 'Stock User',
            email: 'stock@test.com',
            password_hash: hashedPassword,
            company_id: company.id,
            role: 'user'
        });

        category = await Category.create({
            company_id: company.id,
            name: 'Test Cat',
            color: '#FF5733'
        });

        // Create 25 products for pagination testing
        for (let i = 1; i <= 25; i++) {
            products.push(await Product.create({
                company_id: company.id,
                category_id: category.id,
                name: `Product ${i}`,
                sku: `SKU-${i}`,
                price: 10 + i,
                cost: 5 + i,
                stock_quantity: 100,
                min_stock: 10,
                manage_stock: true,
                is_favorite: i <= 5 // first 5 are favorites
            }));
        }
    });

    afterAll(async () => {
        await sequelize.close();
    });

    async function getAuthAgent() {
        const agent = request.agent(app);
        await agent
            .post('/login')
            .send({ email: 'stock@test.com', password: 'pass123' })
            .expect(302);
        return agent;
    }

    it('GET /app/products should list products with pagination', async () => {
        const agent = await getAuthAgent();
        const res = await agent.get('/app/products?page=1&limit=20');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Product 1');
        expect(res.text).toContain('Mostrando <span class="font-medium text-slate-900">20</span>');
    });

    it('GET /app/products should search products by name', async () => {
        const agent = await getAuthAgent();
        const res = await agent.get('/app/products?search=Product 10');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Product 10');
        expect(res.text).not.toContain('Product 11');
    });

    it('POST /app/products/:id/favorite should toggle favorite status', async () => {
        const agent = await getAuthAgent();
        const product = products[10]; // i=11, initially NOT favorite
        const res = await agent.post(`/app/products/${product.id}/favorite`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.is_favorite).toBe(true);

        const updated = await Product.findByPk(product.id);
        expect(updated.is_favorite).toBe(true);
    });

    it('POST /app/products/:id/duplicate should copy a product', async () => {
        const agent = await getAuthAgent();
        const product = products[0];
        const res = await agent.post(`/app/products/${product.id}/duplicate`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.product.name).toBe(`${product.name} (Cópia)`);

        const copies = await Product.findAll({ where: { name: `${product.name} (Cópia)` } });
        expect(copies.length).toBe(1);
    });

    it('POST /app/products/bulk-delete should remove multiple items', async () => {
        const agent = await getAuthAgent();
        const toDelete = [products[20].id, products[21].id];
        const res = await agent.post('/app/products/bulk-delete').send({ ids: toDelete });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const remaining = await Product.findAll({ where: { id: toDelete } });
        expect(remaining.length).toBe(0);
    });

    it('POST /app/products/bulk-adjust should update prices by percentage', async () => {
        const agent = await getAuthAgent();
        const ids = [products[15].id, products[16].id];
        const res = await agent.post('/app/products/bulk-adjust').send({
            ids,
            type: 'price',
            mode: 'percentage',
            value: 10 // +10%
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const updated = await Product.findByPk(ids[0]);
        // Initial price was 10 + 16 = 26. 26 + 10% = 28.6
        expect(Number(updated.price)).toBeCloseTo(28.6);
    });

    it('GET /app/products/search should return predictive results', async () => {
        const agent = await getAuthAgent();
        const res = await agent.get('/app/products/search?q=Product 1');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toContain('Product 1');
    });
});
