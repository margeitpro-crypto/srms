const winston = require('winston');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'white',
  silly: 'rainbow'
};

// Add colors to winston
winston.addColors(logColors);

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (stack) {
      log += `\nStack: ${stack}`;
    }

    if (Object.keys(meta).length > 0) {
      log += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} ${level}: ${message}`;

    if (stack) {
      log += `\n${stack}`;
    }

    if (Object.keys(meta).length > 0 && process.env.NODE_ENV === 'development') {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

// Create winston logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'srms-backend'
  },
  transports: [
    // Error log file - only errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    }),

    // Combined log file - all levels
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    }),

    // HTTP requests log
    new winston.transports.File({
      filename: path.join(logDir, 'requests.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880,
      maxFiles: 3
    })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 5242880,
      maxFiles: 3
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Create custom logging methods
const customLogger = {
  // Basic log levels
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },

  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },

  info: (message, meta = {}) => {
    logger.info(message, meta);
  },

  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },

  // HTTP request logging
  http: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || '',
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      userId: req.user ? req.user.id : undefined,
      timestamp: new Date().toISOString()
    };

    logger.http('HTTP Request', logData);
  },

  // Database operation logging
  database: (operation, table, data = {}) => {
    logger.info('Database Operation', {
      operation,
      table,
      ...data,
      timestamp: new Date().toISOString()
    });
  },

  // Authentication logging
  auth: (action, userId, details = {}) => {
    logger.info('Authentication Event', {
      action,
      userId,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  // Security logging
  security: (event, details = {}) => {
    logger.warn('Security Event', {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  // API endpoint logging
  api: (endpoint, method, statusCode, responseTime, userId = null) => {
    const level = statusCode >= 400 ? 'warn' : 'info';
    logger[level]('API Call', {
      endpoint,
      method,
      statusCode,
      responseTime: `${responseTime}ms`,
      userId,
      timestamp: new Date().toISOString()
    });
  },

  // Email logging
  email: (action, recipient, subject, status, error = null) => {
    const level = status === 'success' ? 'info' : 'error';
    logger[level]('Email Event', {
      action,
      recipient,
      subject,
      status,
      error: error ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  },

  // File operation logging
  file: (operation, filename, size = null, error = null) => {
    const level = error ? 'error' : 'info';
    logger[level]('File Operation', {
      operation,
      filename,
      size: size ? `${size} bytes` : undefined,
      error: error ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  },

  // Performance logging
  performance: (operation, duration, details = {}) => {
    const level = duration > 5000 ? 'warn' : 'info'; // Warn if operation takes more than 5 seconds
    logger[level]('Performance Metric', {
      operation,
      duration: `${duration}ms`,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  // System event logging
  system: (event, details = {}) => {
    logger.info('System Event', {
      event,
      ...details,
      pid: process.pid,
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  },

  // Audit logging for important actions
  audit: (action, userId, resource, details = {}) => {
    logger.info('Audit Log', {
      action,
      userId,
      resource,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
};

// Create middleware for HTTP request logging
customLogger.middleware = () => {
  return (req, res, next) => {
    const start = Date.now();

    // Log the incoming request
    customLogger.http(req, res, null);

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const responseTime = Date.now() - start;
      customLogger.api(req.originalUrl || req.url, req.method, res.statusCode, responseTime, req.user?.id);
      originalEnd.call(this, chunk, encoding);
    };

    next();
  };
};

// Graceful shutdown handling
process.on('SIGINT', () => {
  customLogger.system('Application shutdown initiated (SIGINT)');
  logger.end();
});

process.on('SIGTERM', () => {
  customLogger.system('Application shutdown initiated (SIGTERM)');
  logger.end();
});

module.exports = customLogger;
