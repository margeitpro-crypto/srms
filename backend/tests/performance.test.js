const request = require('supertest');
const app = require('../src/app');

describe('Performance Tests', () => {
  describe('Response Time', () => {
    test('API endpoints should respond within 500ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/health');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500);
    });

    test('Database queries should be optimized', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/students?page=1&limit=50');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Load Testing', () => {
    test('should handle concurrent requests', async () => {
      const concurrentRequests = 10;
      const promises = [];
      
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(request(app).get('/health'));
      }
      
      const responses = await Promise.all(promises);
      const successfulResponses = responses.filter(r => r.status === 200);
      
      expect(successfulResponses.length).toBe(concurrentRequests);
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 errors gracefully', async () => {
      const response = await request(app).get('/api/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.message).toContain('does not exist');
    });

    test('should not expose sensitive error details in production', async () => {
      process.env.NODE_ENV = 'production';
      
      const response = await request(app).get('/api/error-test');
      
      expect(response.body.stack).toBeUndefined();
      expect(response.body.message).not.toContain('at ');
      
      // Reset environment
      process.env.NODE_ENV = 'test';
    });
  });
});