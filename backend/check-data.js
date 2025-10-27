/**
 * Check Database Data Script
 * Quick script to verify seeded data exists
 */

const { sequelize } = require('./config/database');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Class = require('./models/Class');
const Course = require('./models/Course');
const Grade = require('./models/Grade');
const Attendance = require('./models/Attendance');
const Assignment = require('./models/Assignment');

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n');

    const counts = {
      users: await User.count(),
      teachers: await Teacher.count(),
      students: await Student.count(),
      classes: await Class.count(),
      courses: await Course.count(),
      grades: await Grade.count(),
      attendance: await Attendance.count(),
      assignments: await Assignment.count()
    };

    console.log('📊 Database Counts:');
    console.log('==================');
    Object.entries(counts).forEach(([model, count]) => {
      const icon = count > 0 ? '✅' : '❌';
      console.log(`${icon} ${model.padEnd(15)}: ${count}`);
    });

    console.log('\n');

    // Sample some data
    console.log('📋 Sample Data:');
    console.log('===============');

    const sampleClass = await Class.findOne({
      include: [{ model: Teacher, as: 'homeRoomTeacher' }]
    });
    if (sampleClass) {
      console.log(`✅ Sample Class: ${sampleClass.name} (Grade ${sampleClass.grade_level})`);
    } else {
      console.log('❌ No classes found');
    }

    const sampleCourse = await Course.findOne();
    if (sampleCourse) {
      console.log(`✅ Sample Course: ${sampleCourse.name} (${sampleCourse.code})`);
    } else {
      console.log('❌ No courses found');
    }

    const sampleGrade = await Grade.findOne();
    if (sampleGrade) {
      console.log(`✅ Sample Grade: Score ${sampleGrade.score}, Type: ${sampleGrade.grade_type}`);
    } else {
      console.log('❌ No grades found');
    }

    const sampleAttendance = await Attendance.findOne();
    if (sampleAttendance) {
      console.log(`✅ Sample Attendance: ${sampleAttendance.status} on ${sampleAttendance.date}`);
    } else {
      console.log('❌ No attendance records found');
    }

    await sequelize.close();
    console.log('\n✅ Database check complete!');

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    process.exit(1);
  }
}

checkData();
