const request = require('supertest');
const app = require('../src/app');

describe('Security Tests', () => {
  describe('Input Validation', () => {
    test('should prevent SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: maliciousInput,
          password: 'password123'
        });
      
      expect(response.status).not.toBe(500);
    });

    test('should sanitize XSS attempts', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const response = await request(app)
        .post('/api/users')
        .send({
          name: xssPayload,
          email: 'test@example.com'
        });
      
      expect(response.body.data).not.toContain('<script>');
    });
  });

  describe('Rate Limiting', () => {
    test('should limit repeated requests', async () => {
      const promises = [];
      for (let i = 0; i < 15; i++) {
        promises.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'wrong' })
        );
      }
      
      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('JWT Security', () => {
    test('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid_token');
      
      expect(response.status).toBe(401);
    });

    test('should reject expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(401);
    });
  });
});

describe('Data Validation', () => {
  test('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: '123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('should enforce field length limits', async () => {
    const longString = 'a'.repeat(1000);
    const response = await request(app)
      .post('/api/schools')
      .send({
        name: longString,
        address: 'Valid Address'
      });
    
    expect(response.status).toBe(400);
  });
});