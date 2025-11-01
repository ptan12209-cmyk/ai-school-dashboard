/**
 * assignmentService.js - Assignment API Service
 * ==============================================
 * Service for assignment management CRUD operations
 */

import api from './api.js';

/**
 * Get all assignments with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with assignments data
 */
export const getAllAssignments = async (params = {}) => {
  const response = await api.get('/assignments', { params });
  return response.data;
};

/**
 * Get assignment by ID
 * @param {String} id - Assignment ID
 * @returns {Promise} API response with assignment data
 */
export const getAssignmentById = async (id) => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

/**
 * Create new assignment
 * @param {Object} assignmentData - Assignment data
 * @returns {Promise} API response with created assignment
 */
export const createAssignment = async (assignmentData) => {
  const response = await api.post('/assignments', assignmentData);
  return response.data;
};

/**
 * Update assignment
 * @param {String} id - Assignment ID
 * @param {Object} assignmentData - Updated assignment data
 * @returns {Promise} API response with updated assignment
 */
export const updateAssignment = async (id, assignmentData) => {
  const response = await api.put(`/assignments/${id}`, assignmentData);
  return response.data;
};

/**
 * Delete assignment
 * @param {String} id - Assignment ID
 * @returns {Promise} API response
 */
export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};

/**
 * Submit assignment
 * @param {String} assignmentId - Assignment ID
 * @param {Object} submissionData - Submission data
 * @returns {Promise} API response
 */
export const submitAssignment = async (assignmentId, submissionData) => {
  const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
  return response.data;
};

/**
 * Grade submission
 * @param {String} submissionId - Submission ID
 * @param {Object} gradeData - Grade data
 * @returns {Promise} API response
 */
export const gradeSubmission = async (submissionId, gradeData) => {
  const response = await api.put(`/assignments/submissions/${submissionId}/grade`, gradeData);
  return response.data;
};

/**
 * Get student submissions
 * @param {String} studentId - Student ID
 * @returns {Promise} API response with submissions
 */
export const getStudentSubmissions = async (studentId) => {
  const response = await api.get(`/assignments/student/${studentId}/submissions`);
  return response.data;
};

export default {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getStudentSubmissions
};
