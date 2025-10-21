// studentService.js - Service for handling all student-related API calls
import api from './api.js';

const BASE_URL = '/students';

const studentService = {
  // Get all students with pagination, search and filters
  getStudents: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add search param
    if (params.search) queryParams.append('search', params.search);
    
    // Add filter params
    if (params.classId) queryParams.append('classId', params.classId);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.status) queryParams.append('status', params.status);
    if (params.grade) queryParams.append('grade', params.grade);
    
    // Add sorting params
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    return api.get(url);
  },

  // Get single student by ID
  getStudentById: (studentId) => {
    return api.get(`${BASE_URL}/${studentId}`);
  },

  // Create new student
  createStudent: (studentData) => {
    return api.post(BASE_URL, studentData);
  },

  // Update existing student
  updateStudent: (studentId, studentData) => {
    return api.put(`${BASE_URL}/${studentId}`, studentData);
  },

  // Delete student
  deleteStudent: (studentId) => {
    return api.delete(`${BASE_URL}/${studentId}`);
  },

  // Bulk delete students
  bulkDelete: (studentIds) => {
    return api.post(`${BASE_URL}/bulk-delete`, { ids: studentIds });
  },

  // Import students from file
  importStudents: (formData) => {
    return api.post(`${BASE_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Export students to file
  exportStudents: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.format) queryParams.append('format', params.format);
    if (params.classId) queryParams.append('classId', params.classId);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/export?${queryString}` : `${BASE_URL}/export`;
    
    return api.get(url, {
      responseType: 'blob', // Important for file download
    });
  },

  // Get student's grades
  getStudentGrades: (studentId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.term) queryParams.append('term', params.term);
    if (params.year) queryParams.append('year', params.year);
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/${studentId}/grades?${queryString}` 
      : `${BASE_URL}/${studentId}/grades`;
    
    return api.get(url);
  },

  // Get student's attendance
  getStudentAttendance: (studentId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/${studentId}/attendance?${queryString}` 
      : `${BASE_URL}/${studentId}/attendance`;
    
    return api.get(url);
  },

  // Get student's courses
  getStudentCourses: (studentId) => {
    return api.get(`${BASE_URL}/${studentId}/courses`);
  },

  // Get student's activities/timeline
  getStudentActivities: (studentId, limit = 10) => {
    return api.get(`${BASE_URL}/${studentId}/activities?limit=${limit}`);
  },

  // Update student avatar
  updateStudentAvatar: (studentId, formData) => {
    return api.post(`${BASE_URL}/${studentId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get student statistics
  getStudentStats: (studentId) => {
    return api.get(`${BASE_URL}/${studentId}/stats`);
  },

  // Get class students
  getClassStudents: (classId) => {
    return api.get(`${BASE_URL}/class/${classId}`);
  },

  // Transfer student to another class
  transferStudent: (studentId, newClassId) => {
    return api.post(`${BASE_URL}/${studentId}/transfer`, { 
      newClassId 
    });
  },

  // Get student's parent/guardian info
  getStudentParent: (studentId) => {
    return api.get(`${BASE_URL}/${studentId}/parent`);
  },

  // Update student's parent/guardian info
  updateStudentParent: (studentId, parentData) => {
    return api.put(`${BASE_URL}/${studentId}/parent`, parentData);
  },

  // Send email to student
  sendEmailToStudent: (studentId, emailData) => {
    return api.post(`${BASE_URL}/${studentId}/send-email`, emailData);
  },

  // Send SMS to student
  sendSmsToStudent: (studentId, smsData) => {
    return api.post(`${BASE_URL}/${studentId}/send-sms`, smsData);
  },

  // Get student report card
  getStudentReportCard: (studentId, term, year) => {
    return api.get(`${BASE_URL}/${studentId}/report-card`, {
      params: { term, year }
    });
  },

  // Generate student ID card
  generateIdCard: (studentId) => {
    return api.get(`${BASE_URL}/${studentId}/id-card`, {
      responseType: 'blob'
    });
  },

  // Check student email availability
  checkEmailAvailability: (email, excludeId = null) => {
    const params = excludeId ? { excludeId } : {};
    return api.post(`${BASE_URL}/check-email`, { email }, { params });
  },

  // Check student ID availability
  checkStudentIdAvailability: (studentId, excludeId = null) => {
    const params = excludeId ? { excludeId } : {};
    return api.post(`${BASE_URL}/check-student-id`, { studentId }, { params });
  },

  // Get dashboard statistics
  getDashboardStats: () => {
    return api.get(`${BASE_URL}/dashboard-stats`);
  },

  // Search students (quick search)
  searchStudents: (query) => {
    return api.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  },

  // Get recent students
  getRecentStudents: (limit = 5) => {
    return api.get(`${BASE_URL}/recent?limit=${limit}`);
  },

  // Get students by status
  getStudentsByStatus: (status) => {
    return api.get(`${BASE_URL}/by-status/${status}`);
  },

  // Archive student
  archiveStudent: (studentId) => {
    return api.post(`${BASE_URL}/${studentId}/archive`);
  },

  // Restore archived student
  restoreStudent: (studentId) => {
    return api.post(`${BASE_URL}/${studentId}/restore`);
  },

  // Get archived students
  getArchivedStudents: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/archived?${queryString}` : `${BASE_URL}/archived`;
    
    return api.get(url);
  }
};

export default studentService;
