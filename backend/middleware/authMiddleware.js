const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/auth');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      });
    }
    
    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Find user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
    }
    
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
    }
    
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. Access denied.',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, jwtConfig.secret);
        const user = await User.findByPk(decoded.id);
        
        if (user && user.is_active) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }
      }
    }
    
    // Continue regardless of whether user was found
    next();
  } catch (error) {
    // If token is invalid, continue without user
    next();
  }
};

module.exports = {
  verifyToken,
  checkRole,
  optionalAuth
};