// teacherService.js - Service for handling all teacher-related API calls
import api from './api.js';

const BASE_URL = '/teachers';

const teacherService = {
  // Get all teachers with pagination, search and filters
  getTeachers: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add search param
    if (params.search) queryParams.append('search', params.search);
    
    // Add filter params
    if (params.department) queryParams.append('department', params.department);
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.status) queryParams.append('status', params.status);
    if (params.qualification) queryParams.append('qualification', params.qualification);
    if (params.employmentType) queryParams.append('employmentType', params.employmentType);
    
    // Add sorting params
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    return api.get(url);
  },

  // Get single teacher by ID
  getTeacherById: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}`);
  },

  // Create new teacher
  createTeacher: (teacherData) => {
    return api.post(BASE_URL, teacherData);
  },

  // Update existing teacher
  updateTeacher: (teacherId, teacherData) => {
    return api.put(`${BASE_URL}/${teacherId}`, teacherData);
  },

  // Delete teacher
  deleteTeacher: (teacherId) => {
    return api.delete(`${BASE_URL}/${teacherId}`);
  },

  // Bulk delete teachers
  bulkDelete: (teacherIds) => {
    return api.post(`${BASE_URL}/bulk-delete`, { ids: teacherIds });
  },

  // Import teachers from file
  importTeachers: (formData) => {
    return api.post(`${BASE_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Export teachers to file
  exportTeachers: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.format) queryParams.append('format', params.format);
    if (params.department) queryParams.append('department', params.department);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/export?${queryString}` : `${BASE_URL}/export`;
    
    return api.get(url, {
      responseType: 'blob', // Important for file download
    });
  },

  // Get teacher's classes
  getTeacherClasses: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/classes`);
  },

  // Assign class to teacher
  assignClass: (teacherId, classId) => {
    return api.post(`${BASE_URL}/${teacherId}/assign-class`, { classId });
  },

  // Remove class from teacher
  removeClassAssignment: (teacherId, classId) => {
    return api.delete(`${BASE_URL}/${teacherId}/classes/${classId}`);
  },

  // Get teacher's schedule
  getTeacherSchedule: (teacherId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.week) queryParams.append('week', params.week);
    if (params.month) queryParams.append('month', params.month);
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/${teacherId}/schedule?${queryString}` 
      : `${BASE_URL}/${teacherId}/schedule`;
    
    return api.get(url);
  },

  // Get teacher's students
  getTeacherStudents: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/students`);
  },

  // Get teacher's performance metrics
  getTeacherPerformance: (teacherId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/${teacherId}/performance?${queryString}` 
      : `${BASE_URL}/${teacherId}/performance`;
    
    return api.get(url);
  },

  // Get teacher's attendance
  getTeacherAttendance: (teacherId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.month) queryParams.append('month', params.month);
    if (params.year) queryParams.append('year', params.year);
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/${teacherId}/attendance?${queryString}` 
      : `${BASE_URL}/${teacherId}/attendance`;
    
    return api.get(url);
  },

  // Mark teacher attendance
  markTeacherAttendance: (teacherId, attendanceData) => {
    return api.post(`${BASE_URL}/${teacherId}/attendance`, attendanceData);
  },

  // Get teacher's leave history
  getTeacherLeaves: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/leaves`);
  },

  // Apply for leave
  applyLeave: (teacherId, leaveData) => {
    return api.post(`${BASE_URL}/${teacherId}/leaves`, leaveData);
  },

  // Update teacher avatar
  updateTeacherAvatar: (teacherId, formData) => {
    return api.post(`${BASE_URL}/${teacherId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get teacher statistics
  getTeacherStats: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/stats`);
  },

  // Get departments list
  getDepartments: () => {
    return api.get(`${BASE_URL}/departments`);
  },

  // Get subjects list
  getSubjects: () => {
    return api.get(`${BASE_URL}/subjects`);
  },

  // Get qualifications list
  getQualifications: () => {
    return api.get(`${BASE_URL}/qualifications`);
  },

  // Send email to teacher
  sendEmailToTeacher: (teacherId, emailData) => {
    return api.post(`${BASE_URL}/${teacherId}/send-email`, emailData);
  },

  // Send SMS to teacher
  sendSmsToTeacher: (teacherId, smsData) => {
    return api.post(`${BASE_URL}/${teacherId}/send-sms`, smsData);
  },

  // Get teacher's salary history
  getTeacherSalary: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/salary`);
  },

  // Update teacher's salary
  updateTeacherSalary: (teacherId, salaryData) => {
    return api.post(`${BASE_URL}/${teacherId}/salary`, salaryData);
  },

  // Get teacher's training/certifications
  getTeacherTraining: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/training`);
  },

  // Add teacher training/certification
  addTeacherTraining: (teacherId, trainingData) => {
    return api.post(`${BASE_URL}/${teacherId}/training`, trainingData);
  },

  // Get teacher's awards and achievements
  getTeacherAchievements: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/achievements`);
  },

  // Add teacher achievement
  addTeacherAchievement: (teacherId, achievementData) => {
    return api.post(`${BASE_URL}/${teacherId}/achievements`, achievementData);
  },

  // Generate teacher ID card
  generateIdCard: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/id-card`, {
      responseType: 'blob'
    });
  },

  // Check teacher email availability
  checkEmailAvailability: (email, excludeId = null) => {
    const params = excludeId ? { excludeId } : {};
    return api.post(`${BASE_URL}/check-email`, { email }, { params });
  },

  // Check teacher ID availability
  checkTeacherIdAvailability: (teacherId, excludeId = null) => {
    const params = excludeId ? { excludeId } : {};
    return api.post(`${BASE_URL}/check-teacher-id`, { teacherId }, { params });
  },

  // Get dashboard statistics
  getDashboardStats: () => {
    return api.get(`${BASE_URL}/dashboard-stats`);
  },

  // Search teachers (quick search)
  searchTeachers: (query) => {
    return api.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  },

  // Get recent teachers
  getRecentTeachers: (limit = 5) => {
    return api.get(`${BASE_URL}/recent?limit=${limit}`);
  },

  // Get teachers by department
  getTeachersByDepartment: (department) => {
    return api.get(`${BASE_URL}/by-department/${encodeURIComponent(department)}`);
  },

  // Get teachers by subject
  getTeachersBySubject: (subject) => {
    return api.get(`${BASE_URL}/by-subject/${encodeURIComponent(subject)}`);
  },

  // Get teachers by status
  getTeachersByStatus: (status) => {
    return api.get(`${BASE_URL}/by-status/${status}`);
  },

  // Archive teacher
  archiveTeacher: (teacherId) => {
    return api.post(`${BASE_URL}/${teacherId}/archive`);
  },

  // Restore archived teacher
  restoreTeacher: (teacherId) => {
    return api.post(`${BASE_URL}/${teacherId}/restore`);
  },

  // Get archived teachers
  getArchivedTeachers: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/archived?${queryString}` : `${BASE_URL}/archived`;
    
    return api.get(url);
  },

  // Evaluate teacher
  evaluateTeacher: (teacherId, evaluationData) => {
    return api.post(`${BASE_URL}/${teacherId}/evaluate`, evaluationData);
  },

  // Get teacher evaluations
  getTeacherEvaluations: (teacherId) => {
    return api.get(`${BASE_URL}/${teacherId}/evaluations`);
  },

  // Get substitute teacher suggestions
  getSuggestedSubstitutes: (teacherId, date) => {
    return api.get(`${BASE_URL}/${teacherId}/substitute-suggestions?date=${date}`);
  },

  // Assign substitute teacher
  assignSubstitute: (teacherId, substituteData) => {
    return api.post(`${BASE_URL}/${teacherId}/assign-substitute`, substituteData);
  }
};

export default teacherService;
