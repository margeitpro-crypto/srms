const logger = require('../services/logger.service');
const { AppError } = require('../utils/errors');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  try {
    if (logger && typeof logger.error === 'function') {
      logger.error('Application error', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Logger error function not available:', {
        message: err.message,
        url: req.url,
        method: req.method,
      });
    }
  } catch (loggerError) {
    console.error('Failed to log error:', loggerError.message);
    console.error('Original error:', err.message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Unique constraint violation';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2025') {
    const message = 'Record not found';
    error = new AppError(message, 404);
  }

  if (err.code === 'P2003') {
    const message = 'Foreign key constraint failed';
    error = new AppError(message, 400);
  }

  // Rate limit error
  if (err.statusCode === 429) {
    const message = 'Too many requests, please try again later';
    error = new AppError(message, 429);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = new AppError(message, 400);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files';
    error = new AppError(message, 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = new AppError(message, 400);
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async handler wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validate request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

// Rate limiting error handler
const rateLimitHandler = (req, res, next) => {
  const error = new AppError('Too many requests from this IP, please try again later', 429);
  next(error);
};

// Database connection error handler
const handleDatabaseError = (err, req, res, next) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    try {
      if (logger && typeof logger.error === 'function') {
        logger.error('Database connection error:', err);
      } else {
        console.error('Database connection error:', err.message);
      }
    } catch (loggerError) {
      console.error('Failed to log database error:', loggerError.message);
    }
    const error = new AppError('Database connection failed', 503);
    return next(error);
  }
  next(err);
};

// Timeout handler
const handleTimeout = (req, res, next) => {
  const timeout = parseInt(process.env.REQUEST_TIMEOUT) || 30000; // 30 seconds default
  
  req.setTimeout(timeout, () => {
    try {
      if (logger && typeof logger.error === 'function') {
        logger.error(`Request timeout: ${req.method} ${req.url}`);
      } else {
        console.error(`Request timeout: ${req.method} ${req.url}`);
      }
    } catch (loggerError) {
      console.error('Failed to log timeout error:', loggerError.message);
    }
    const error = new AppError('Request timeout', 408);
    next(error);
  });
  
  next();
};

// Error recovery suggestions
const getErrorSuggestions = (error) => {
  const suggestions = {
    400: 'Check your request data and try again',
    401: 'Please login or provide valid authentication',
    403: 'You don\'t have permission to access this resource',
    404: 'The requested resource was not found',
    429: 'Please wait a moment before making another request',
    500: 'Something went wrong on our end. Please try again later',
    502: 'The server is temporarily unavailable',
    503: 'The service is temporarily unavailable',
  };
  
  return suggestions[error.statusCode] || 'An unexpected error occurred';
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  validateRequest,
  rateLimitHandler,
  handleDatabaseError,
  handleTimeout,
  getErrorSuggestions,
};