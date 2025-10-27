const { Student, Teacher, Course, Grade, Attendance, Class, User } = require('../models');
const { catchAsync } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

exports.getDashboardStats = catchAsync(async (req, res) => {
  const totalStudents = await Student.count();
  const totalTeachers = await Teacher.count();
  const totalCourses = await Course.count();
  const totalClasses = await Class.count();

  const grades = await Grade.findAll({
    attributes: ['score']
  });

  const averageGrade = grades.length > 0
    ? parseFloat((grades.reduce((sum, g) => sum + parseFloat(g.score || 0), 0) / grades.length / 10).toFixed(1))
    : 0;

  const topStudents = await Student.findAll({
    include: [{
      model: Grade,
      as: 'grades',
      attributes: ['score']
    }],
    limit: 5,
    order: [[{ model: Grade, as: 'grades' }, 'score', 'DESC']]
  });

  const topTeachers = await Teacher.findAll({
    include: [{
      model: Course,
      as: 'courses',
      attributes: ['id', 'name']
    }],
    limit: 5
  });

  res.json({
    success: true,
    data: {
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalClasses,
        averageGrade,
        topStudents: topStudents.map(s => ({
          id: s.id,
          name: `${s.first_name} ${s.last_name}`,
          averageGrade: s.grades && s.grades.length > 0
            ? parseFloat((s.grades.reduce((sum, g) => sum + parseFloat(g.score || 0), 0) / s.grades.length / 10).toFixed(1))
            : 0
        })),
        topTeachers: topTeachers.map(t => ({
          id: t.id,
          name: `${t.first_name} ${t.last_name}`,
          coursesCount: t.courses ? t.courses.length : 0
        }))
      },
      charts: {
        performanceData: await getPerformanceData(),
        subjectData: await getSubjectData(),
        gradeDistribution: await getGradeDistribution()
      },
      recentActivities: await getRecentActivities()
    }
  });
});

const getPerformanceData = async () => {
  const last6Months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const grades = await Grade.findAll({
      where: {
        created_at: {
          [Op.gte]: month,
          [Op.lt]: nextMonth
        }
      }
    });

    const avg = grades.length > 0
      ? parseFloat((grades.reduce((sum, g) => sum + parseFloat(g.score || 0), 0) / grades.length / 10).toFixed(1))
      : 0;

    last6Months.push({
      month: month.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
      value: avg
    });
  }

  return last6Months;
};

const getSubjectData = async () => {
  const courses = await Course.findAll({
    include: [{
      model: Grade,
      as: 'grades',
      attributes: ['score']
    }],
    limit: 6
  });

  return courses.map(course => ({
    subject: course.name,
    value: course.grades && course.grades.length > 0
      ? parseFloat((course.grades.reduce((sum, g) => sum + parseFloat(g.score || 0), 0) / course.grades.length / 10).toFixed(1))
      : 0
  }));
};

const getGradeDistribution = async () => {
  const grades = await Grade.findAll({
    attributes: ['score']
  });

  const distribution = {
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0
  };

  grades.forEach(grade => {
    const score = parseFloat(grade.score || 0) / 10;
    if (score >= 8.5) distribution.excellent++;
    else if (score >= 7) distribution.good++;
    else if (score >= 5.5) distribution.average++;
    else distribution.poor++;
  });

  return [
    { name: 'Xuất Sắc (≥8.5)', value: distribution.excellent },
    { name: 'Giỏi (7-8.5)', value: distribution.good },
    { name: 'Khá (5.5-7)', value: distribution.average },
    { name: 'Yếu (<5.5)', value: distribution.poor }
  ];
};

const getRecentActivities = async () => {
  const recentGrades = await Grade.findAll({
    include: [
      { model: Student, as: 'student', attributes: ['first_name', 'last_name'] },
      { model: Course, as: 'course', attributes: ['name'] }
    ],
    order: [['created_at', 'DESC']],
    limit: 5
  });

  const recentAttendance = await Attendance.findAll({
    include: [
      { model: Student, as: 'student', attributes: ['first_name', 'last_name'] },
      { model: Course, as: 'course', attributes: ['name'] }
    ],
    order: [['created_at', 'DESC']],
    limit: 5
  });

  const activities = [];

  recentGrades.forEach(grade => {
    activities.push({
      type: 'grade',
      description: `Điểm ${grade.course?.name || 'N/A'} cho ${grade.student?.first_name || ''} ${grade.student?.last_name || ''}: ${parseFloat(grade.score || 0) / 10}/10`,
      timestamp: grade.created_at
    });
  });

  recentAttendance.forEach(att => {
    activities.push({
      type: 'attendance',
      description: `Điểm danh ${att.course?.name || 'N/A'} - ${att.student?.first_name || ''} ${att.student?.last_name || ''}: ${att.status}`,
      timestamp: att.created_at
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
};
