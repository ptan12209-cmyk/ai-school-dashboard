const Class = require('../models/Class'); // Giả định đường dẫn đến model

/**
 * Tạo một lớp học mới
 * @param {Object} classData - Dữ liệu cho lớp học mới
 * @returns {Promise<Document>} Tài liệu lớp học mới
 */
const createClass = async (classData) => {
  try {
    const newClass = new Class(classData);
    await newClass.save();
    return newClass;
  } catch (error) {
    throw new Error(`Lỗi khi tạo lớp học: ${error.message}`);
  }
};

/**
 * Lấy tất cả các lớp học
 * @returns {Promise<Document[]>} Danh sách tất cả các lớp học
 */
const getAllClasses = async () => {
  try {
    // Populate để lấy thông tin chi tiết của giáo viên và học sinh
    const classes = await Class.find().populate('teacherId').populate('studentIds');
    return classes;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách lớp học: ${error.message}`);
  }
};

/**
 * Lấy một lớp học bằng ID
 * @param {String} classId - ID của lớp học
 * @returns {Promise<Document>} Tài liệu lớp học
 */
const getClassById = async (classId) => {
  try {
    const singleClass = await Class.findById(classId).populate('teacherId').populate('studentIds');
    if (!singleClass) {
      throw new Error('Không tìm thấy lớp học');
    }
    return singleClass;
  } catch (error) {
    throw new Error(`Lỗi khi tìm lớp học bằng ID: ${error.message}`);
  }
};

/**
 * Cập nhật một lớp học bằng ID
 * @param {String} classId - ID của lớp học cần cập nhật
 * @param {Object} updateData - Dữ liệu cần cập nhật
 * @returns {Promise<Document>} Tài liệu lớp học đã được cập nhật
 */
const updateClass = async (classId, updateData) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(classId, updateData, { new: true, runValidators: true });
    if (!updatedClass) {
      throw new Error('Không tìm thấy lớp học');
    }
    return updatedClass;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật lớp học: ${error.message}`);
  }
};

/**
 * Xóa một lớp học bằng ID
 * @param {String} classId - ID của lớp học cần xóa
 * @returns {Promise<Document>} Tài liệu lớp học đã bị xóa
 */
const deleteClass = async (classId) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass) {
      throw new Error('Không tìm thấy lớp học');
    }
    return deletedClass;
  } catch (error) {
    throw new Error(`Lỗi khi xóa lớp học: ${error.message}`);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
