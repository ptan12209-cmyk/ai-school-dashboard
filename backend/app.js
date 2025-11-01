/**
 * Express Application Configuration - FIXED VERSION
 * ===================================================
 * Main Express app setup and middleware configuration
 * 
 * ✅ FIXED: Improved CORS configuration with origin validation
 * ✅ FIXED: Rate limiting implemented
 * 
 * This file sets up the Express application but doesn't start the server.
 * Server startup is handled in server.js
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations
const { corsConfig, rateLimitConfig } = require('./config/auth');

// TODO: Week 3-4 - Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const classRoutes = require('./routes/class.routes');
const courseRoutes = require('./routes/course.routes');
const gradeRoutes = require('./routes/grade.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const notificationRoutes = require('./routes/notification.routes');
const assignmentRoutes = require('./routes/assignment.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');
// const aiRoutes = require('./routes/ai.routes');

// TODO: Week 3-4 - Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

/**
 * Initialize Express Application
 */
const app = express();

/**
 * ============================================
 * MIDDLEWARE CONFIGURATION
 * ============================================
 */

/**
 * 1. Security Middleware
 * ----------------------
 * Helmet helps secure Express apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * 2. CORS (Cross-Origin Resource Sharing)
 * ----------------------------------------
 * ✅ FIXED: Improved CORS with origin validation
 */
app.use(cors({
  origin: function (origin, callback) {
    // Development mode - allow all localhost origins
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Get allowed origins from environment or use defaults
    let allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:3001'];

    // ✅ FIX: Always include localhost in development
    if (isDevelopment) {
      allowedOrigins = [
        ...new Set([
          ...allowedOrigins,
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:5001'
        ])
      ];
    }

    // Allow no-origin in development/test
    if (!origin) {
      if (isDevelopment) {
        console.log('⚠️  DEV: Allowing request with no origin (Postman/curl)');
        return callback(null, true);
      } else {
        console.warn(`❌ PROD: Blocked request with no origin header`);
        return callback(new Error('Not allowed by CORS - origin required'), false);
      }
    }

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS: Allowing origin: ${origin}`);
      return callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Blocked unauthorized origin: ${origin}`);
      console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight for 24 hours
}));

/**
 * 3. Request Parsing
 * ------------------
 * Parse incoming JSON and URL-encoded payloads
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 4. Compression
 * --------------
 * Compress response bodies for better performance
 */
app.use(compression());

/**
 * 5. Logging
 * ----------
 * HTTP request logger (only in development)
 */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * 6. Rate Limiting
 * ----------------
 * ✅ FIXED: Rate limiting now implemented
 * Prevent abuse by limiting requests per IP
 */
const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs || 15 * 60 * 1000, // 15 minutes
  // More lenient in development, stricter in production
  max: process.env.NODE_ENV === 'production'
    ? (rateLimitConfig.max || 100)
    : 1000, // 1000 requests per window in development
  message: rateLimitConfig.message || 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers

  // Skip rate limit for health check and test environment
  skip: (req) => req.path === '/health' || process.env.NODE_ENV === 'test',

  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP. Please try again later.',
      retryAfter: Math.ceil(rateLimitConfig.windowMs / 1000)
    });
  }
});

// Apply rate limiter to all API routes (but not health check)
app.use('/api', limiter);

/**
 * ============================================
 * HEALTH CHECK ENDPOINT
 * ============================================
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI School Dashboard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI School Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

/**
 * ============================================
 * API ROUTES
 * ============================================
 * Mount all route handlers under /api prefix
 * 
 * TODO: Week 3-4 - Uncomment when routes are implemented
 */

// API version prefix
const API_PREFIX = '/api';

/**
 * Authentication routes (public)
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * POST /api/auth/refresh-token
 */
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/teachers`, teacherRoutes);
app.use(`${API_PREFIX}/students`, studentRoutes);

/**
 * Class routes (protected)
 */
app.use(`${API_PREFIX}/classes`, classRoutes);

/**
 * Course routes (protected)
 */
app.use(`${API_PREFIX}/courses`, courseRoutes);

/**
 * Grade routes (protected)
 */
app.use(`${API_PREFIX}/grades`, gradeRoutes);

/**
 * Attendance routes (protected)
 */
app.use(`${API_PREFIX}/attendance`, attendanceRoutes);

/**
 * Notification routes (protected)
 */
app.use(`${API_PREFIX}/notifications`, notificationRoutes);

/**
 * Assignment routes (protected)
 */
app.use(`${API_PREFIX}/assignments`, assignmentRoutes);

/**
 * Dashboard routes (protected)
 */
// app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);

/**
 * AI routes (protected)
 */
// app.use(`${API_PREFIX}/ai`, aiRoutes);

/**
 * ============================================
 * ERROR HANDLING
 * ============================================
 */

// Use the custom 404 handler
app.use(notFound);

// Use the global error handler
app.use(errorHandler);
/**
 * Export Express app
 * Server will be started in server.js
 */
module.exports = app;






