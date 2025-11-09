// Error handling utilities for frontend

class AppError extends Error {
  constructor(message, statusCode, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Error types
class NetworkError extends AppError {
  constructor(message = 'Network error', details = {}) {
    super(message, 0, details); // 0 for network errors
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', fields = {}) {
    super(message, 400, { fields });
    this.fields = fields;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ServerError extends AppError {
  constructor(message = 'Server error', details = {}) {
    super(message, 500, details);
  }
}

// Error handler utility
class ErrorHandler {
  constructor() {
    this.errorCallbacks = new Map();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event.reason);
    });

    // Network errors
    window.addEventListener('offline', () => {
      this.handleOffline();
    });
  }

  handleGlobalError(error) {
    console.error('Global error:', error);
    this.notifyCallbacks('global', error);
    
    // Log to external service if in production
    if (process.env.NODE_ENV === 'production') {
      this.logError(error);
    }
  }

  handleUnhandledRejection(reason) {
    console.error('Unhandled promise rejection:', reason);
    const error = reason instanceof Error ? reason : new Error(reason);
    this.notifyCallbacks('unhandledRejection', error);
    
    if (process.env.NODE_ENV === 'production') {
      this.logError(error);
    }
  }

  handleOffline() {
    const error = new NetworkError('You are offline');
    this.notifyCallbacks('offline', error);
  }

  // Handle API errors
  handleApiError(error, customHandlers = {}) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          const validationError = new ValidationError(
            data.message || 'Bad request',
            data.details || data.fields || {}
          );
          return this.handleError(validationError, customHandlers);
          
        case 401:
          const authError = new AuthenticationError(data.message);
          return this.handleError(authError, customHandlers);
          
        case 403:
          const forbiddenError = new AuthorizationError(data.message);
          return this.handleError(forbiddenError, customHandlers);
          
        case 404:
          const notFoundError = new NotFoundError(data.message);
          return this.handleError(notFoundError, customHandlers);
          
        case 429:
          const rateLimitError = new AppError(
            data.message || 'Too many requests',
            429
          );
          return this.handleError(rateLimitError, customHandlers);
          
        case 500:
        case 502:
        case 503:
          const serverError = new ServerError(
            data.message || 'Server error',
            data
          );
          return this.handleError(serverError, customHandlers);
          
        default:
          const genericError = new AppError(
            data.message || 'An error occurred',
            status
          );
          return this.handleError(genericError, customHandlers);
      }
    } else if (error.request) {
      // The request was made but no response was received
      const networkError = new NetworkError(
        'No response from server',
        { originalError: error.message }
      );
      return this.handleError(networkError, customHandlers);
    } else {
      // Something happened in setting up the request
      const setupError = new NetworkError(
        'Request setup failed',
        { originalError: error.message }
      );
      return this.handleError(setupError, customHandlers);
    }
  }

  // Handle errors with custom logic
  handleError(error, customHandlers = {}) {
    // Check for custom handlers
    if (customHandlers[error.statusCode]) {
      return customHandlers[error.statusCode](error);
    }

    // Default error handling
    this.showErrorNotification(error);
    
    // Notify callbacks
    this.notifyCallbacks('api', error);
    
    // Log error
    if (process.env.NODE_ENV === 'production') {
      this.logError(error);
    }
    
    return error;
  }

  // Show error notification to user
  showErrorNotification(error) {
    let message = error.message;
    let type = 'error';
    
    // Customize messages based on error type
    if (error instanceof NetworkError) {
      message = 'Network connection error. Please check your internet connection.';
      type = 'warning';
    } else if (error instanceof AuthenticationError) {
      message = 'Please login to continue.';
      type = 'info';
    } else if (error instanceof AuthorizationError) {
      message = 'You don\'t have permission to perform this action.';
      type = 'warning';
    } else if (error instanceof ValidationError) {
      message = 'Please check your input and try again.';
      type = 'warning';
    } else if (error instanceof ServerError) {
      message = 'Server error. Please try again later.';
      type = 'error';
    }

    // Use toast notification if available
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      console.error('Error notification:', message);
    }
  }

  // Log error to external service
  async logError(error) {
    try {
      // In a real application, you would send this to your logging service
      const errorData = {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        timestamp: error.timestamp,
        details: error.details,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('userId'),
      };

      console.log('Logging error:', errorData);
      
      // Example: Send to logging endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData),
      // });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  // Register error callbacks
  onError(type, callback) {
    if (!this.errorCallbacks.has(type)) {
      this.errorCallbacks.set(type, []);
    }
    this.errorCallbacks.get(type).push(callback);
  }

  // Notify callbacks
  notifyCallbacks(type, error) {
    const callbacks = this.errorCallbacks.get(type) || [];
    callbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }

  // Retry mechanism
  async retry(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }

  // Circuit breaker pattern
  createCircuitBreaker(fn, options = {}) {
    const {
      failureThreshold = 5,
      resetTimeout = 60000, // 1 minute
      monitoringPeriod = 10000, // 10 seconds
    } = options;

    let failures = 0;
    let lastFailureTime = null;
    let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN

    return async (...args) => {
      if (state === 'OPEN') {
        if (Date.now() - lastFailureTime > resetTimeout) {
          state = 'HALF_OPEN';
        } else {
          throw new NetworkError('Circuit breaker is open');
        }
      }

      try {
        const result = await fn(...args);
        if (state === 'HALF_OPEN') {
          state = 'CLOSED';
          failures = 0;
        }
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();

        if (failures >= failureThreshold) {
          state = 'OPEN';
        }

        throw error;
      }
    };
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export utilities
export {
  AppError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  errorHandler,
};

// Default export
export default errorHandler;