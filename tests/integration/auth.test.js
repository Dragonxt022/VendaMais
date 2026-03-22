const request = require('supertest');
const app = require('../../src/app');
const { User, Company, sequelize } = require('../../src/models');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('GET /login should redirect to initial setup when no users exist', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/setup/primeiro-admin');
  });

  it('GET /register should redirect to initial setup when no users exist', async () => {
    const res = await request(app).get('/register');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/setup/primeiro-admin');
  });

  it('GET /setup/primeiro-admin should explain the first admin flow', async () => {
    const res = await request(app).get('/setup/primeiro-admin');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('primeiro administrador');
    expect(res.text).toContain('administrador principal do sistema');
  });

  it('POST /setup/primeiro-admin should create the first user as admin', async () => {
    const res = await request(app)
      .post('/setup/primeiro-admin')
      .send({
        name: 'Admin Inicial',
        email: 'admin@local.test',
        password: '123456',
        company_name: 'Empresa Inicial'
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login');

    const user = await User.findOne({ where: { email: 'admin@local.test' } });
    const company = await Company.findOne({ where: { name: 'Empresa Inicial' } });

    expect(user).not.toBeNull();
    expect(company).not.toBeNull();
    expect(user.role).toBe('admin');
    expect(user.company_id).toBe(company.id);
  });

  it('POST /register should create later users as gerente', async () => {
    await request(app)
      .post('/setup/primeiro-admin')
      .send({
        name: 'Admin Inicial',
        email: 'admin@local.test',
        password: '123456',
        company_name: 'Empresa Inicial'
      });

    const res = await request(app)
      .post('/register')
      .send({
        name: 'Segundo Usuario',
        email: 'gerente@local.test',
        password: '123456',
        company_name: 'Empresa Dois'
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login');

    const user = await User.findOne({ where: { email: 'gerente@local.test' } });
    expect(user.role).toBe('gerente');
  });
});
