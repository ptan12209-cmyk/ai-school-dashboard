/**
 * aiService.js - AI API Service
 * ==============================
 * Service for AI-powered features (chatbot, predictions, etc.)
 */

import api from './api.js';

/**
 * Send message to AI chatbot
 * @param {String} message - User message
 * @param {Array} conversationHistory - Previous conversation
 * @returns {Promise} API response with AI reply
 */
export const sendChatMessage = async (message, conversationHistory = []) => {
  const response = await api.post('/ai/chat', {
    message,
    conversationHistory
  });
  return response.data;
};

/**
 * Predict student grade
 * @param {String} studentId - Student ID
 * @param {String} courseId - Course ID
 * @returns {Promise} API response with prediction
 */
export const predictGrade = async (studentId, courseId) => {
  const response = await api.post('/ai/predict-grade', {
    studentId,
    courseId
  });
  return response.data;
};

/**
 * Detect at-risk students
 * @param {String} studentId - Student ID (optional)
 * @param {String} classId - Class ID (optional)
 * @returns {Promise} API response with risk assessment
 */
export const detectRisk = async (studentId = null, classId = null) => {
  const response = await api.post('/ai/detect-risk', {
    studentId,
    classId
  });
  return response.data;
};

/**
 * Generate AI report
 * @param {String} studentId - Student ID
 * @param {String} reportType - Type of report (summary, detailed, etc.)
 * @param {String} period - Time period for report
 * @returns {Promise} API response with generated report
 */
export const generateReport = async (studentId, reportType = 'summary', period = null) => {
  const response = await api.post('/ai/generate-report', {
    studentId,
    reportType,
    period
  });
  return response.data;
};

/**
 * Get AI service status
 * @returns {Promise} API response with AI feature status
 */
export const getAIStatus = async () => {
  const response = await api.get('/ai/status');
  return response.data;
};

export default {
  sendChatMessage,
  predictGrade,
  detectRisk,
  generateReport,
  getAIStatus
};
