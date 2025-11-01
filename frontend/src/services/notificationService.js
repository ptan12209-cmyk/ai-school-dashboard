/**
 * notificationService.js - Notification API Service
 * ==================================================
 * Service for notification management operations
 */

import api from './api.js';

/**
 * Get all notifications for current user
 * @param {Object} params - Query parameters (page, limit, is_read, type)
 * @returns {Promise} API response with notifications
 */
export const getAllNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

/**
 * Get unread notification count
 * @returns {Promise} API response with count
 */
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread/count');
  return response.data;
};

/**
 * Mark notification as read
 * @param {String} id - Notification ID
 * @returns {Promise} API response
 */
export const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise} API response
 */
export const markAllAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

/**
 * Delete notification
 * @param {String} id - Notification ID
 * @returns {Promise} API response
 */
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

/**
 * Delete all notifications
 * @returns {Promise} API response
 */
export const deleteAllNotifications = async () => {
  const response = await api.delete('/notifications');
  return response.data;
};

/**
 * Create notification (admin only)
 * @param {Object} notificationData - Notification data
 * @returns {Promise} API response
 */
export const createNotification = async (notificationData) => {
  const response = await api.post('/notifications', notificationData);
  return response.data;
};

export default {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification
};
