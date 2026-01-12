const request = require('supertest');
const app = require('../../app');

describe('Auth Routes', () => {
  it('GET /login should respond with 200 OK', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Login');
  });

  it('GET /register should respond with 200 OK', async () => {
    const res = await request(app).get('/register');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Criar Conta');
  });
});
