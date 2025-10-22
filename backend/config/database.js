/**
 * Database Configuration - Sequelize ORM
 * =======================================
 * Configure PostgreSQL connection for AI School Dashboard
 * 
 * Week 3-4: ACTIVATED ✅
 * - Sequelize instance creation
 * - Connection pooling
 * - Environment-based configuration
 * 
 * Usage:
 * const { sequelize } = require('./config/database');
 */

// Load .env file based on NODE_ENV
// Priority: .env.{NODE_ENV} -> .env
const fs = require('fs');
const path = require('path');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
const envPath = path.join(__dirname, '..', envFile);
const defaultEnvPath = path.join(__dirname, '..', '.env');

// Try to load environment-specific file first, fallback to .env
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(defaultEnvPath)) {
  require('dotenv').config({ path: defaultEnvPath });
} else {
  require('dotenv').config(); // Fallback to default .env in root
}

const { Sequelize } = require('sequelize');

/**
 * Database connection configuration
 * Load from environment variables (.env file)
 */
const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'school_dashboard',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log, // Enable SQL query logging in development
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'school_dashboard_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
},
  
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Disable logging in production
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For services like Heroku
      }
    }
  }
};

/**
 * Get current environment configuration
 */
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

/**
 * Initialize Sequelize instance
 */
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  currentConfig
);

/**
 * Test database connection on startup
 */
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err.message));

module.exports = {
  config: currentConfig,
  sequelize,
  Sequelize
};