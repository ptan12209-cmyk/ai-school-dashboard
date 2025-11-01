const Notification = require('../models/Notification'); // Giả định đường dẫn đến model

/**
 * Tạo một thông báo mới
 * @param {Object} notificationData - Dữ liệu cho thông báo mới
 * @returns {Promise<Document>} Tài liệu thông báo mới
 */
const createNotification = async (notificationData) => {
  try {
    const newNotification = new Notification(notificationData);
    await newNotification.save();
    return newNotification;
  } catch (error) {
    throw new Error(`Lỗi khi tạo thông báo: ${error.message}`);
  }
};

/**
 * Lấy tất cả thông báo (có thể thêm bộ lọc, ví dụ: theo userId)
 * @param {Object} filter - Bộ lọc cho truy vấn
 * @returns {Promise<Document[]>} Danh sách thông báo
 */
const getAllNotifications = async (filter = {}) => {
  try {
    const notifications = await Notification.find(filter);
    return notifications;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách thông báo: ${error.message}`);
  }
};

/**
 * Lấy một thông báo bằng ID
 * @param {String} notificationId - ID của thông báo
 * @returns {Promise<Document>} Tài liệu thông báo
 */
const getNotificationById = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }
    return notification;
  } catch (error) {
    throw new Error(`Lỗi khi tìm thông báo bằng ID: ${error.message}`);
  }
};

/**
 * Đánh dấu một thông báo là đã đọc
 * @param {String} notificationId - ID của thông báo
 * @returns {Promise<Document>} Thông báo đã được cập nhật
 */
const markAsRead = async (notificationId) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!updatedNotification) {
      throw new Error('Không tìm thấy thông báo');
    }
    return updatedNotification;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật thông báo: ${error.message}`);
  }
};

/**
 * Xóa một thông báo bằng ID
 * @param {String} notificationId - ID của thông báo cần xóa
 * @returns {Promise<Document>} Tài liệu thông báo đã bị xóa
 */
const deleteNotification = async (notificationId) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    if (!deletedNotification) {
      throw new Error('Không tìm thấy thông báo');
    }
    return deletedNotification;
  } catch (error) {
    throw new Error(`Lỗi khi xóa thông báo: ${error.message}`);
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
};
