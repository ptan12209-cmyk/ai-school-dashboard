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
      // We don't need to wait for the response, the client-side will log out immediately.
      api.post('/auth/logout');
      return true;
    } catch (error) {
      // Even if the API call fails, the client-side logout will proceed.
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
  }
};

export default authService;