const logger = require('./src/services/logger.service');

console.log('Logger object:', logger);
console.log('Logger.logger:', logger.logger);
console.log('Logger.logger.error:', logger.logger?.error);

// Test the logger
try {
  logger.logger.error('Test error message', { test: 'data' });
  console.log('Logger test successful');
} catch (error) {
  console.error('Logger test failed:', error.message);
}