/**
 * Validation Middleware
 * =====================
 * Express-validator middleware for request validation
 * 
 * Week 3-4 Day 3
 */

const { validationResult } = require('express-validator');

/**
 * Validate Middleware
 * ===================
 * Checks validation results and returns errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

module.exports = { validate };