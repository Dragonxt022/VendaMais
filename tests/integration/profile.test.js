const request = require('supertest');
const app = require('../../app');
const { User, Company, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

describe('Profile Integration', () => {
    let user, company;

    beforeEach(async () => {
        // Clear tables instead of dropping them to avoid breaking session table
        await User.destroy({ where: {}, force: true });
        await Company.destroy({ where: {}, force: true });

        company = await Company.create({
            name: 'Profile Co',
            cnpj: 'PROF-' + Date.now(),
            plan: 'pro'
        });

        const hashedPassword = await bcrypt.hash('pass123', 10);
        user = await User.create({
            name: 'Profile User',
            email: 'profile@test.com',
            password_hash: hashedPassword,
            company_id: company.id,
            role: 'user'
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    async function getAuthAgent() {
        const agent = request.agent(app);
        await agent
            .post('/login')
            .send({ email: 'profile@test.com', password: 'pass123' })
            .expect(302);
        return agent;
    }

    it('GET /app/profile should render profile page', async () => {
        const agent = await getAuthAgent();
        const res = await agent.get('/app/profile');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Meu Perfil');
        expect(res.text).toContain('profile@test.com');
    });

    it('POST /app/profile should update user details', async () => {
        const agent = await getAuthAgent();
        const res = await agent
            .post('/app/profile')
            .field('name', 'Updated Name')
            .field('email', 'updated@test.com');
        
        expect(res.statusCode).toBe(302);
        
        const updatedUser = await User.findByPk(user.id);
        expect(updatedUser.name).toBe('Updated Name');
        expect(updatedUser.email).toBe('updated@test.com');
    });

    it('POST /app/profile should update avatar if provided', async () => {
        const agent = await getAuthAgent();
        // Create a dummy image file
        const dummyPath = path.join(__dirname, 'dummy.png');
        fs.writeFileSync(dummyPath, 'fake image data');

        const res = await agent
            .post('/app/profile')
            .field('name', 'Avatar User')
            .field('email', 'avatar@test.com')
            .attach('avatar', dummyPath);

        expect(res.statusCode).toBe(302);
        
        const updatedUser = await User.findByPk(user.id);
        expect(updatedUser.avatar).not.toBeNull();
        expect(updatedUser.avatar).toContain('avatar-');

        // Cleanup
        fs.unlinkSync(dummyPath);
    });

    it('POST /app/profile should fail with empty name', async () => {
        const agent = await getAuthAgent();
        const res = await agent
            .post('/app/profile')
            .field('name', '')
            .field('email', 'valid@test.com');
        
        // Should show error in toast or redirect with error
        // Controller throws Error('Nome e e-mail são obrigatórios')
        // In app.js it renders the page with error or redirects
        // Let's check the controller logic again for exact response
        expect(res.statusCode).toBe(200); // Renders the profile page again with error
        expect(res.text).toContain('Nome e e-mail são obrigatórios');
    });
});
