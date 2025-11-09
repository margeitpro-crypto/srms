const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const { specs, swaggerUiOptions } = require("./config/swagger");
const {
  logger,
  performanceMonitor,
  errorLogger,
} = require("./services/logger.service");
const cacheService = require("./services/cache.service");
const {
  errorHandler,
  notFound,
  handleTimeout,
  handleDatabaseError,
} = require("./middleware/errorHandler");

const app = express();

// Trust proxy for deployment behind reverse proxies
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// Timeout handler
app.use(handleTimeout);

// Database error handler
app.use(handleDatabaseError);

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "https://your-domain.com"
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:3001",
        ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Performance monitoring
app.use(performanceMonitor);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// API Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/students", require("./routes/student.routes"));
app.use("/api/schools", require("./routes/school.routes"));
app.use("/api/subjects", require("./routes/subject.routes"));
app.use("/api/marks", require("./routes/marks.routes"));
app.use("/api/reports", require("./routes/reports.routes"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Nepal National School Result Management System API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      students: "/api/students",
      schools: "/api/schools",
      subjects: "/api/subjects",
      marks: "/api/marks",
      reports: "/api/reports",
    },
  });
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// Global error handler
app.use(errorLogger);

// 404 handler (must be last)
app.use(notFound);

// Error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Exit gracefully
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Received SIGINT. Gracefully shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Gracefully shutting down...");
  process.exit(0);
});

module.exports = app;
