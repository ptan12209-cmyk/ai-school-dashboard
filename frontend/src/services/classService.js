/**
 * classService.js - Class API Service
 * ====================================
 * Service for class management CRUD operations
 */

import api from './api.js';

/**
 * Get all classes with optional filters
 * @param {Object} params - Query parameters (page, limit, grade_level, school_year, etc.)
 * @returns {Promise} API response with classes data
 */
export const getAllClasses = async (params = {}) => {
  const response = await api.get('/classes', { params });
  return response.data;
};

/**
 * Get class by ID
 * @param {String} id - Class ID
 * @returns {Promise} API response with class data
 */
export const getClassById = async (id) => {
  const response = await api.get(`/classes/${id}`);
  return response.data;
};

/**
 * Create new class
 * @param {Object} classData - Class data
 * @returns {Promise} API response with created class
 */
export const createClass = async (classData) => {
  const response = await api.post('/classes', classData);
  return response.data;
};

/**
 * Update class
 * @param {String} id - Class ID
 * @param {Object} classData - Updated class data
 * @returns {Promise} API response with updated class
 */
export const updateClass = async (id, classData) => {
  const response = await api.put(`/classes/${id}`, classData);
  return response.data;
};

/**
 * Delete class
 * @param {String} id - Class ID
 * @returns {Promise} API response
 */
export const deleteClass = async (id) => {
  const response = await api.delete(`/classes/${id}`);
  return response.data;
};

/**
 * Get students in class
 * @param {String} classId - Class ID
 * @returns {Promise} API response with students
 */
export const getClassStudents = async (classId) => {
  const response = await api.get(`/classes/${classId}/students`);
  return response.data;
};

/**
 * Get courses for class
 * @param {String} classId - Class ID
 * @returns {Promise} API response with courses
 */
export const getClassCourses = async (classId) => {
  const response = await api.get(`/classes/${classId}/courses`);
  return response.data;
};

/**
 * Add student to class
 * @param {String} classId - Class ID
 * @param {String} studentId - Student ID
 * @returns {Promise} API response
 */
export const addStudentToClass = async (classId, studentId) => {
  const response = await api.post(`/classes/${classId}/students`, { studentId });
  return response.data;
};

/**
 * Remove student from class
 * @param {String} classId - Class ID
 * @param {String} studentId - Student ID
 * @returns {Promise} API response
 */
export const removeStudentFromClass = async (classId, studentId) => {
  const response = await api.delete(`/classes/${classId}/students/${studentId}`);
  return response.data;
};

export default {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
  getClassCourses,
  addStudentToClass,
  removeStudentFromClass
};
