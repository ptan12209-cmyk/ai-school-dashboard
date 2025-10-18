/**
 * Models Index - Sequelize Model Loader
 * ======================================
 * Loads all models and defines associations
 * 
 * ACTIVATED - Week 3-4 Day 2
 */

const { sequelize, Sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Teacher = require('./Teacher');
const Student = require('./Student');

// Note: Class, Course, Grade, Attendance will be added later (Day 5)
// For now, we'll just set up User-Teacher-Student associations

/**
 * ============================================
 * DEFINE MODEL ASSOCIATIONS
 * ============================================
 */

// ─────────────────────────────────────────────
// 1. User ↔ Teacher (One-to-One)
// ─────────────────────────────────────────────
User.hasOne(Teacher, {
  foreignKey: 'user_id',
  as: 'teacherProfile',
  onDelete: 'CASCADE'
});

Teacher.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// ─────────────────────────────────────────────
// 2. User ↔ Student (One-to-One)
// ─────────────────────────────────────────────
User.hasOne(Student, {
  foreignKey: 'user_id',
  as: 'studentProfile',
  onDelete: 'CASCADE'
});

Student.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

/**
 * TODO: Day 5 - Add remaining associations when Class, Course, Grade, Attendance models are created
 * 
 * // Class ↔ Students (One-to-Many)
 * Class.hasMany(Student, {
 *   foreignKey: 'class_id',
 *   as: 'students'
 * });
 * Student.belongsTo(Class, {
 *   foreignKey: 'class_id',
 *   as: 'class'
 * });
 * 
 * // Teacher ↔ Classes (One-to-Many)
 * Teacher.hasMany(Class, {
 *   foreignKey: 'teacher_id',
 *   as: 'classes'
 * });
 * Class.belongsTo(Teacher, {
 *   foreignKey: 'teacher_id',
 *   as: 'homeroomTeacher'
 * });
 * 
 * // Class ↔ Courses (One-to-Many)
 * Class.hasMany(Course, {
 *   foreignKey: 'class_id',
 *   as: 'courses'
 * });
 * Course.belongsTo(Class, {
 *   foreignKey: 'class_id',
 *   as: 'class'
 * });
 * 
 * // Teacher ↔ Courses (One-to-Many)
 * Teacher.hasMany(Course, {
 *   foreignKey: 'teacher_id',
 *   as: 'courses'
 * });
 * Course.belongsTo(Teacher, {
 *   foreignKey: 'teacher_id',
 *   as: 'teacher'
 * });
 * 
 * // Student ↔ Grades (One-to-Many)
 * Student.hasMany(Grade, {
 *   foreignKey: 'student_id',
 *   as: 'grades'
 * });
 * Grade.belongsTo(Student, {
 *   foreignKey: 'student_id',
 *   as: 'student'
 * });
 * 
 * // Course ↔ Grades (One-to-Many)
 * Course.hasMany(Grade, {
 *   foreignKey: 'course_id',
 *   as: 'grades'
 * });
 * Grade.belongsTo(Course, {
 *   foreignKey: 'course_id',
 *   as: 'course'
 * });
 * 
 * // Student ↔ Attendance (One-to-Many)
 * Student.hasMany(Attendance, {
 *   foreignKey: 'student_id',
 *   as: 'attendance'
 * });
 * Attendance.belongsTo(Student, {
 *   foreignKey: 'student_id',
 *   as: 'student'
 * });
 * 
 * // Course ↔ Attendance (One-to-Many, optional)
 * Course.hasMany(Attendance, {
 *   foreignKey: 'course_id',
 *   as: 'attendance'
 * });
 * Attendance.belongsTo(Course, {
 *   foreignKey: 'course_id',
 *   as: 'course'
 * });
 */

/**
 * ============================================
 * EXPORT ALL MODELS
 * ============================================
 */
module.exports = {
  sequelize,
  Sequelize,
  
  // Models (currently available)
  User,
  Teacher,
  Student
  
  // TODO: Day 5 - Export remaining models
  // Class,
  // Course,
  // Grade,
  // Attendance
};