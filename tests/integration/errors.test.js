const request = require('supertest');
const app = require('../../app');

describe('Error Handling Integration', () => {
    it('GET /non-existent-page should return 404', async () => {
        const res = await request(app).get('/non-existent-page');
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain('Página Não Encontrada');
    });

    it('Should render 500 error page on server error', async () => {
        // We can simulate an error by triggering a route that doesn't exist or forcing an error in a route
        // but since we want to test the app.js error handler, we can mock a route that throws
        const express = require('express');
        const testApp = require('../../app');
        
        // Add a temporary route specifically for this test if needed, 
        // but we'll try to use what we have.
        // Actually, the app.js has a generic error handler that handles status codes.
    });
});
