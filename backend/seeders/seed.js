/**
 * Seed Data Script - AI School Dashboard
 * =======================================
 * Tạo dữ liệu ảo cho demo/presentation
 *
 * Bao gồm:
 * - Users, Teachers, Students
 * - Classes, Courses
 * - Grades, Attendance
 * - Assignments, Questions, Submissions
 * - Notifications
 */

const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Course = require('../models/Course');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');

/**
 * Helper: Hash password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Helper: Random number in range
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Helper: Random element from array
 */
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

/**
 * Helper: Random date in range
 */
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * DANH SÁCH DỮ LIỆU MẪU
 */
const VIETNAMESE_NAMES = {
  firstNames: [
    'An', 'Bảo', 'Châu', 'Duy', 'Hà', 'Hải', 'Hùng', 'Khang', 'Linh', 'Long',
    'Mai', 'Minh', 'Nam', 'Ngọc', 'Phúc', 'Quân', 'Thảo', 'Trang', 'Tuấn', 'Vy',
    'Anh', 'Bình', 'Chi', 'Đức', 'Giang', 'Hạnh', 'Hiếu', 'Khánh', 'Lan', 'Lộc',
    'My', 'Nhung', 'Phương', 'Quỳnh', 'Tâm', 'Thư', 'Trinh', 'Tú', 'Vân', 'Yến'
  ],
  lastNames: [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh', 'Mai', 'Tô'
  ]
};

const SUBJECTS = [
  { name: 'Toán học', code: 'MATH', credits: 4 },
  { name: 'Vật lý', code: 'PHYS', credits: 3 },
  { name: 'Hóa học', code: 'CHEM', credits: 3 },
  { name: 'Sinh học', code: 'BIO', credits: 2 },
  { name: 'Ngữ văn', code: 'LIT', credits: 3 },
  { name: 'Tiếng Anh', code: 'ENG', credits: 3 },
  { name: 'Lịch sử', code: 'HIST', credits: 2 },
  { name: 'Địa lý', code: 'GEO', credits: 2 },
  { name: 'Tin học', code: 'IT', credits: 2 },
  { name: 'Giáo dục công dân', code: 'CIVIC', credits: 1 }
];

const CLASS_NAMES = [
  '10A1', '10A2', '10A3', '10A4',
  '11A1', '11A2', '11A3', '11A4',
  '12A1', '12A2', '12A3', '12A4'
];

/**
 * Generate random Vietnamese name
 */
const generateName = () => {
  const lastName = randomElement(VIETNAMESE_NAMES.lastNames);
  const firstName = randomElement(VIETNAMESE_NAMES.firstNames);
  return { firstName, lastName };
};

/**
 * Generate email from name
 */
const generateEmail = (firstName, lastName, role, index) => {
  const name = `${lastName}${firstName}`.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, '');
  return `${name}${index}@${role === 'student' ? 'student' : 'school'}.edu.vn`;
};

/**
 * MAIN SEED FUNCTION
 */
async function seed() {
  try {
    console.log('🌱 Starting seed process...\n');

    // Sync database (CAUTION: This will drop all tables!)
    console.log('🗄️  Syncing database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced\n');

    // ========================================
    // 1. CREATE ADMIN USER
    // ========================================
    console.log('👤 Creating admin user...');
    const adminPassword = await hashPassword('Admin@123');
    const admin = await User.create({
      email: 'admin@school.edu.vn',
      password: adminPassword,
      role: 'admin',
      first_name: 'Quản trị',
      last_name: 'Hệ thống',
      is_active: true
    });
    console.log('✅ Admin created: admin@school.edu.vn / Admin@123\n');

    // ========================================
    // 2. CREATE TEACHERS
    // ========================================
    console.log('👨‍🏫 Creating teachers...');
    const teachers = [];
    const teacherPassword = await hashPassword('Teacher@123');

    for (let i = 1; i <= 12; i++) {
      const { firstName, lastName } = generateName();
      const email = generateEmail(firstName, lastName, 'teacher', i);

      const user = await User.create({
        email,
        password: teacherPassword,
        role: 'teacher',
        first_name: firstName,
        last_name: lastName,
        phone: `09${randomInt(10, 99)}${randomInt(100000, 999999)}`,
        is_active: true
      });

      const teacher = await Teacher.create({
        user_id: user.id,
        employee_id: `GV${String(i).padStart(4, '0')}`,
        department: randomElement(['Khoa học tự nhiên', 'Khoa học xã hội', 'Ngoại ngữ', 'Công nghệ']),
        specialization: randomElement(SUBJECTS).name,
        hire_date: randomDate(new Date(2015, 0, 1), new Date(2022, 0, 1)),
        education_level: randomElement(['Cử nhân', 'Thạc sĩ', 'Tiến sĩ']),
        years_of_experience: randomInt(1, 15)
      });

      teachers.push({ user, teacher });
    }
    console.log(`✅ Created ${teachers.length} teachers (Password: Teacher@123)\n`);

    // ========================================
    // 3. CREATE CLASSES
    // ========================================
    console.log('🏫 Creating classes...');
    const classes = [];

    for (let i = 0; i < CLASS_NAMES.length; i++) {
      const className = CLASS_NAMES[i];
      const homeRoomTeacher = teachers[i % teachers.length];

      const classObj = await Class.create({
        class_name: className,
        grade_level: parseInt(className.substring(0, 2)),
        school_year: '2024-2025',
        homeroom_teacher_id: homeRoomTeacher.teacher.id,
        max_students: 40,
        room_number: `${randomInt(1, 5)}${String(randomInt(1, 20)).padStart(2, '0')}`
      });

      classes.push(classObj);
    }
    console.log(`✅ Created ${classes.length} classes\n`);

    // ========================================
    // 4. CREATE STUDENTS
    // ========================================
    console.log('👨‍🎓 Creating students...');
    const students = [];
    const studentPassword = await hashPassword('Student@123');

    for (let i = 1; i <= 120; i++) {
      const { firstName, lastName } = generateName();
      const email = generateEmail(firstName, lastName, 'student', i);
      const classObj = classes[(i - 1) % classes.length];

      const user = await User.create({
        email,
        password: studentPassword,
        role: 'student',
        first_name: firstName,
        last_name: lastName,
        date_of_birth: randomDate(new Date(2006, 0, 1), new Date(2009, 11, 31)),
        gender: randomElement(['M', 'F']),
        phone: `09${randomInt(10, 99)}${randomInt(100000, 999999)}`,
        is_active: true
      });

      const student = await Student.create({
        user_id: user.id,
        student_id: `HS${String(i).padStart(5, '0')}`,
        class_id: classObj.id,
        enrollment_date: new Date(classObj.school_year.split('-')[0], 8, 1),
        student_status: 'active',
        gpa: (Math.random() * 2 + 6).toFixed(2), // GPA từ 6.0 - 8.0
        parent_name: `${randomElement(VIETNAMESE_NAMES.lastNames)} ${randomElement(VIETNAMESE_NAMES.firstNames)}`,
        parent_phone: `09${randomInt(10, 99)}${randomInt(100000, 999999)}`,
        address: `${randomInt(1, 500)} đường ${randomElement(['Lê Lợi', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Hai Bà Trưng'])}, TP.HCM`
      });

      students.push({ user, student });
    }
    console.log(`✅ Created ${students.length} students (Password: Student@123)\n`);

    // ========================================
    // 5. CREATE COURSES
    // ========================================
    console.log('📚 Creating courses...');
    const courses = [];

    for (const classObj of classes) {
      // Mỗi lớp học 8-10 môn
      const numSubjects = randomInt(8, 10);
      const selectedSubjects = [...SUBJECTS]
        .sort(() => Math.random() - 0.5)
        .slice(0, numSubjects);

      for (const subject of selectedSubjects) {
        const teacher = randomElement(teachers);

        const course = await Course.create({
          course_name: subject.name,
          course_code: `${subject.code}_${classObj.class_name}_2024`,
          class_id: classObj.id,
          teacher_id: teacher.teacher.id,
          semester: randomElement([1, 2]),
          school_year: '2024-2025',
          credits: subject.credits,
          description: `Môn ${subject.name} cho lớp ${classObj.class_name}`,
          start_date: new Date(2024, 8, 5), // 5/9/2024
          end_date: new Date(2025, 4, 30),   // 30/5/2025
          schedule: `Thứ ${randomInt(2, 6)}, Tiết ${randomInt(1, 5)}`
        });

        courses.push(course);
      }
    }
    console.log(`✅ Created ${courses.length} courses\n`);

    // ========================================
    // 6. CREATE GRADES
    // ========================================
    console.log('📊 Creating grades...');
    let gradeCount = 0;

    for (const course of courses) {
      // Lấy học sinh của lớp
      const classStudents = students.filter(s => s.student.class_id === course.class_id);

      for (const { student } of classStudents) {
        // Mỗi học sinh có 3-5 điểm thành phần
        const numGrades = randomInt(3, 5);

        for (let i = 0; i < numGrades; i++) {
          const gradeTypes = ['Miệng', 'Kiểm tra 15 phút', 'Kiểm tra 1 tiết', 'Thi giữa kỳ', 'Thi cuối kỳ'];
          const weights = [1, 1, 2, 2, 3];

          await Grade.create({
            student_id: student.id,
            course_id: course.id,
            grade_type: gradeTypes[i % gradeTypes.length],
            score: (Math.random() * 3 + 6.5).toFixed(1), // Điểm từ 6.5 - 9.5
            max_score: 10,
            weight: weights[i % weights.length],
            graded_by: course.teacher_id,
            graded_at: randomDate(new Date(2024, 8, 15), new Date()),
            comments: randomElement([
              'Làm tốt!',
              'Cần cố gắng thêm',
              'Khá',
              'Giỏi',
              'Xuất sắc',
              null
            ])
          });

          gradeCount++;
        }
      }
    }
    console.log(`✅ Created ${gradeCount} grade entries\n`);

    // ========================================
    // 7. CREATE ATTENDANCE
    // ========================================
    console.log('📅 Creating attendance records...');
    let attendanceCount = 0;

    // Tạo điểm danh cho 30 ngày gần đây
    const today = new Date();
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);

      // Bỏ qua cuối tuần
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      for (const course of courses) {
        const classStudents = students.filter(s => s.student.class_id === course.class_id);

        for (const { student } of classStudents) {
          // 90% có mặt, 5% vắng có phép, 5% vắng không phép
          const rand = Math.random();
          let status;
          if (rand < 0.90) status = 'present';
          else if (rand < 0.95) status = 'absent_excused';
          else status = 'absent_unexcused';

          await Attendance.create({
            student_id: student.id,
            course_id: course.id,
            date: date,
            status: status,
            notes: status !== 'present' ? randomElement(['Ốm', 'Việc gia đình', null]) : null,
            marked_by: course.teacher_id
          });

          attendanceCount++;
        }
      }
    }
    console.log(`✅ Created ${attendanceCount} attendance records\n`);

    // ========================================
    // 8. CREATE ASSIGNMENTS
    // ========================================
    console.log('📝 Creating assignments...');
    const assignments = [];

    for (const course of courses) {
      // Mỗi môn có 3-5 bài tập
      const numAssignments = randomInt(3, 5);

      for (let i = 1; i <= numAssignments; i++) {
        const assignmentTypes = ['homework', 'quiz', 'exam', 'project'];
        const type = randomElement(assignmentTypes);

        const createdDate = randomDate(new Date(2024, 8, 5), new Date());
        const dueDate = new Date(createdDate);
        dueDate.setDate(dueDate.getDate() + randomInt(3, 14));

        const assignment = await Assignment.create({
          course_id: course.id,
          title: `${type === 'homework' ? 'Bài tập' : type === 'quiz' ? 'Kiểm tra' : type === 'exam' ? 'Thi' : 'Đồ án'} ${i}`,
          description: `${course.course_name} - ${type === 'homework' ? 'Ôn tập chương' : type === 'quiz' ? 'Kiểm tra nhanh' : type === 'exam' ? 'Kiểm tra định kỳ' : 'Dự án nhóm'} số ${i}`,
          assignment_type: type,
          total_points: type === 'exam' ? 100 : type === 'quiz' ? 50 : type === 'project' ? 200 : 10,
          due_date: dueDate,
          created_by: course.teacher_id,
          is_published: true,
          allow_late_submission: randomElement([true, false]),
          late_penalty_percent: randomInt(10, 30),
          auto_grade: type === 'quiz' || type === 'homework',
          time_limit_minutes: type === 'quiz' ? randomInt(15, 45) : type === 'exam' ? randomInt(60, 120) : null,
          passing_score: type === 'exam' ? 50 : null
        });

        assignments.push(assignment);
      }
    }
    console.log(`✅ Created ${assignments.length} assignments\n`);

    // ========================================
    // 9. CREATE QUESTIONS
    // ========================================
    console.log('❓ Creating questions...');
    let questionCount = 0;

    for (const assignment of assignments) {
      if (assignment.assignment_type === 'quiz' || assignment.assignment_type === 'homework') {
        // Mỗi quiz/homework có 5-10 câu hỏi
        const numQuestions = randomInt(5, 10);

        for (let i = 1; i <= numQuestions; i++) {
          const questionTypes = ['multiple_choice', 'true_false', 'short_answer'];
          const type = randomElement(questionTypes);

          let options = null;
          let correctAnswer = null;

          if (type === 'multiple_choice') {
            options = ['A', 'B', 'C', 'D'];
            correctAnswer = randomElement(options);
          } else if (type === 'true_false') {
            options = ['Đúng', 'Sai'];
            correctAnswer = randomElement(options);
          } else {
            correctAnswer = 'Đáp án mẫu';
          }

          await Question.create({
            assignment_id: assignment.id,
            question_text: `Câu ${i}: Nội dung câu hỏi số ${i}`,
            question_type: type,
            options: options,
            correct_answer: correctAnswer,
            points: assignment.total_points / numQuestions,
            order_number: i,
            explanation: 'Giải thích đáp án'
          });

          questionCount++;
        }
      }
    }
    console.log(`✅ Created ${questionCount} questions\n`);

    // ========================================
    // 10. CREATE SUBMISSIONS
    // ========================================
    console.log('✍️ Creating submissions...');
    let submissionCount = 0;

    for (const assignment of assignments) {
      const course = courses.find(c => c.id === assignment.course_id);
      const classStudents = students.filter(s => s.student.class_id === course.class_id);

      for (const { student } of classStudents) {
        // 80% sinh viên nộp bài
        if (Math.random() > 0.2) {
          const submittedAt = randomDate(new Date(assignment.created_at), assignment.due_date);
          const isLate = submittedAt > assignment.due_date;
          const scorePercent = Math.random() * 0.4 + 0.5; // 50-90%
          const score = (assignment.total_points * scorePercent).toFixed(2);

          await Submission.create({
            assignment_id: assignment.id,
            student_id: student.id,
            submitted_at: submittedAt,
            status: 'graded',
            score: score,
            max_score: assignment.total_points,
            percentage: (scorePercent * 100).toFixed(2),
            is_late: isLate,
            late_penalty: isLate ? assignment.late_penalty_percent : 0,
            attempt_number: 1,
            graded_by: course.teacher_id,
            graded_at: new Date(submittedAt.getTime() + 86400000), // +1 day
            feedback: randomElement([
              'Làm tốt!',
              'Cần cải thiện phần...',
              'Xuất sắc!',
              'Đạt yêu cầu',
              null
            ]),
            answers: {}
          });

          submissionCount++;
        }
      }
    }
    console.log(`✅ Created ${submissionCount} submissions\n`);

    // ========================================
    // 11. CREATE NOTIFICATIONS
    // ========================================
    console.log('🔔 Creating notifications...');
    const notifications = [];

    // Tạo thông báo cho admin
    await Notification.create({
      user_id: admin.id,
      title: 'Chào mừng đến với AI School Dashboard',
      message: 'Hệ thống đã sẵn sàng để sử dụng!',
      type: 'system',
      is_read: false
    });

    // Tạo thông báo cho một số học sinh
    for (let i = 0; i < 20; i++) {
      const { student } = randomElement(students);
      const assignment = randomElement(assignments);

      await Notification.create({
        user_id: student.user_id,
        title: 'Bài tập mới',
        message: `Bài tập "${assignment.title}" đã được giao. Hạn nộp: ${assignment.due_date.toLocaleDateString('vi-VN')}`,
        type: 'assignment',
        is_read: Math.random() > 0.5
      });
    }

    console.log(`✅ Created notifications\n`);

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   🎉 SEED DATA CREATED SUCCESSFULLY!   ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('📊 Summary:');
    console.log(`   • Admin: 1`);
    console.log(`   • Teachers: ${teachers.length}`);
    console.log(`   • Students: ${students.length}`);
    console.log(`   • Classes: ${classes.length}`);
    console.log(`   • Courses: ${courses.length}`);
    console.log(`   • Grades: ${gradeCount}`);
    console.log(`   • Attendance: ${attendanceCount}`);
    console.log(`   • Assignments: ${assignments.length}`);
    console.log(`   • Questions: ${questionCount}`);
    console.log(`   • Submissions: ${submissionCount}\n`);

    console.log('🔑 Login Credentials:');
    console.log('   📌 Admin:    admin@school.edu.vn / Admin@123');
    console.log('   📌 Teacher:  (any teacher email) / Teacher@123');
    console.log('   📌 Student:  (any student email) / Student@123\n');

    console.log('📧 Sample accounts:');
    console.log(`   Teacher: ${teachers[0].user.email}`);
    console.log(`   Student: ${students[0].user.email}\n`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run seed
seed();
