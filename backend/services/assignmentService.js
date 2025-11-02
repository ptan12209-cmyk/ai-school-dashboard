const Assignment = require('../models/Assignment'); // Giả định đường dẫn đến model

/**
 * Tạo một bài tập mới
 * @param {Object} assignmentData - Dữ liệu cho bài tập mới
 * @returns {Promise<Document>} Tài liệu bài tập mới
 */
const createAssignment = async (assignmentData) => {
  try {
    const newAssignment = new Assignment(assignmentData);
    await newAssignment.save();
    return newAssignment;
  } catch (error) {
    throw new Error(`Lỗi khi tạo bài tập: ${error.message}`);
  }
};

/**
 * Lấy tất cả bài tập
 * @returns {Promise<Document[]>} Danh sách tất cả bài tập
 */
const getAllAssignments = async () => {
  try {
    const assignments = await Assignment.find();
    return assignments;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách bài tập: ${error.message}`);
  }
};

/**
 * Lấy một bài tập bằng ID
 * @param {String} assignmentId - ID của bài tập
 * @returns {Promise<Document>} Tài liệu bài tập
 */
const getAssignmentById = async (assignmentId) => {
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error('Không tìm thấy bài tập');
    }
    return assignment;
  } catch (error) {
    throw new Error(`Lỗi khi tìm bài tập bằng ID: ${error.message}`);
  }
};

/**
 * Cập nhật một bài tập bằng ID
 * @param {String} assignmentId - ID của bài tập cần cập nhật
 * @param {Object} updateData - Dữ liệu cần cập nhật
 * @returns {Promise<Document>} Tài liệu bài tập đã được cập nhật
 */
const updateAssignment = async (assignmentId, updateData) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(assignmentId, updateData, { new: true, runValidators: true });
    if (!updatedAssignment) {
      throw new Error('Không tìm thấy bài tập');
    }
    return updatedAssignment;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật bài tập: ${error.message}`);
  }
};

/**
 * Xóa một bài tập bằng ID
 * @param {String} assignmentId - ID của bài tập cần xóa
 * @returns {Promise<Document>} Tài liệu bài tập đã bị xóa
 */
const deleteAssignment = async (assignmentId) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);
    if (!deletedAssignment) {
      throw new Error('Không tìm thấy bài tập');
    }
    return deletedAssignment;
  } catch (error) {
    throw new Error(`Lỗi khi xóa bài tập: ${error.message}`);
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
