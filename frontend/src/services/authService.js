/**
 * authService.js - Authentication Service
 * ========================================
 * API calls for authentication following PROJECT_STRUCTURE.md
 */

import api from './api.js';

/**
 * Auth Service
 * Handle all authentication related API calls
 */
const authService = {
  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise} Response with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user data and token
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise} Response
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      return true;
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      throw error;
    }
  },

  /**
   * Get current user
   * @returns {Promise} Response with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh token
   * @param {String} refreshToken - Refresh token
   * @returns {Promise} Response with new token
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { token } = response.data.data;
      
      // Update token
      localStorage.setItem('token', token);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} Response
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Forgot password
   * @param {String} email - User email
   * @returns {Promise} Response
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password
   * @param {Object} resetData - Token and new password
   * @returns {Promise} Response
   */
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify email
   * @param {String} token - Verification token
   * @returns {Promise} Response
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} True if authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Get user role
   * @returns {String} User role
   */
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  /**
   * Get user ID
   * @returns {String} User ID
   */
  getUserId: () => {
    return localStorage.getItem('userId');
  }
};

export default authService;
