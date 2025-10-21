/**
 * Dashboard Service
 * ================
 * Service for dashboard-related API calls
 */

import api from './api.js';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance summary
  getAttendanceSummary: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/attendance?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get grade summary
  getGradeSummary: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/grades?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get student performance
  getStudentPerformance: async (studentId) => {
    try {
      const response = await api.get(`/dashboard/students/${studentId}/performance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get teacher performance
  getTeacherPerformance: async (teacherId) => {
    try {
      const response = await api.get(`/dashboard/teachers/${teacherId}/performance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get class performance
  getClassPerformance: async (classId) => {
    try {
      const response = await api.get(`/dashboard/classes/${classId}/performance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get AI predictions
  getAIPredictions: async () => {
    try {
      const response = await api.get('/dashboard/ai-predictions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/dashboard/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/dashboard/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get quick stats
  getQuickStats: async () => {
    try {
      const response = await api.get('/dashboard/quick-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
