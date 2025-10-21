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
// const dashboardRoutes = require('./routes/dashboard.routes');
// const aiRoutes = require('./routes/ai.routes');

// TODO: Week 3-4 - Import middleware
const errorHandler = require('./middleware/errorHandler');

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
    // Get allowed origins from environment or use defaults
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:3001'];
    
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`⚠️  Blocked request from unauthorized origin: ${origin}`);
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
  max: rateLimitConfig.max || 100, // Max 100 requests per window
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

/**
 * 404 Handler - Route not found
 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

/**
 * Global Error Handler
 * TODO: Week 3-4 - Use custom error handler middleware
 */
app.use((err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: This origin is not allowed to access this resource',
      origin: req.get('origin')
    });
  }
  
  // Default error response
  res.status(err.statusCode || 500).json({  // ✅ ĐÚNG: err.statusCode là number
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err 
    })
  });
});
/**
 * Export Express app
 * Server will be started in server.js
 */
module.exports = app;






