/**
 * Attendance Management Integration Tests
 * =========================================
 * Tests for attendance tracking endpoints
 * 
 * Endpoints tested:
 * - GET    /api/attendance
 * - GET    /api/attendance/stats
 * - GET    /api/attendance/student/:studentId
 * - GET    /api/attendance/course/:courseId
 * - GET    /api/attendance/date/:date
 * - GET    /api/attendance/:id
 * - POST   /api/attendance
 * - POST   /api/attendance/bulk
 * - PUT    /api/attendance/:id
 * - DELETE /api/attendance/:id
 * 
 * Total tests: 36
 */

const {
  request,
  app,
  setupDatabase,
  cleanDatabase,
  closeDatabase,
  TestHelpers,
  Assertions,
  MockData
} = require('../setup');

describe('Attendance Management API', () => {
  let adminToken, teacherToken, teacher, studentData, cls, course;

  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    
    // Setup common data
    const admin = await TestHelpers.createAdmin();
    adminToken = admin.token;
    
    const teacherInfo = await TestHelpers.createTeacher();
    teacherToken = teacherInfo.token;
    teacher = teacherInfo.teacher;
    
    studentData = await TestHelpers.createStudent();
    
    cls = await TestHelpers.createClass(adminToken);
    course = await TestHelpers.createCourse(adminToken, {
      teacher_id: teacher.id,
      class_id: cls.id,
      code: 'TESTCOURSE'
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * ============================================
   * GET /api/attendance
   * ============================================
   */
  describe('GET /api/attendance', () => {
    test('should get all attendance records as admin', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        date: '2024-10-01'
      });

      const response = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('attendance');
      expect(Array.isArray(response.body.data.attendance)).toBe(true);
      Assertions.assertPagination(response);
    });

    test('should get attendance as teacher', async () => {
      const response = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should support pagination', async () => {
      for (let i = 0; i < 5; i++) {
        await TestHelpers.markAttendance(adminToken, {
          student_id: studentData.student.id,
          course_id: course.id,
          date: `2024-10-0${i + 1}`
        });
      }

      const response = await request(app)
        .get('/api/attendance?page=1&limit=3')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.attendance.length).toBeLessThanOrEqual(3);
    });

    test('should filter by status', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        status: 'Absent'
      });

      const response = await request(app)
        .get('/api/attendance?status=Absent')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      response.body.data.attendance.forEach(att => {
        expect(att.status).toBe('Absent');
      });
    });

    test('should filter by date range', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        date: '2024-10-15'
      });

      const response = await request(app)
        .get('/api/attendance?start_date=2024-10-01&end_date=2024-10-31')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny access for students', async () => {
      const response = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/attendance/stats
   * ============================================
   */
  describe('GET /api/attendance/stats', () => {
    test('should get attendance statistics as admin', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        status: 'Present'
      });

      const response = await request(app)
        .get('/api/attendance/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('overallRate');
      expect(response.body.data).toHaveProperty('byStatus');
    });

    test('should filter stats by date range', async () => {
      const response = await request(app)
        .get('/api/attendance/stats?start_date=2024-10-01&end_date=2024-10-31')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny access for non-admin', async () => {
      const response = await request(app)
        .get('/api/attendance/stats')
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * POST /api/attendance
   * ============================================
   */
  describe('POST /api/attendance', () => {
    test('should mark attendance as admin', async () => {
      const attendanceData = {
        student_id: studentData.student.id,
        course_id: course.id,
        date: '2024-10-01',
        status: 'Present',
        check_in_time: '08:00:00',
        check_out_time: '12:00:00',
        notes: 'On time'
      };

      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(attendanceData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.message).toBe('Attendance marked successfully');
      expect(response.body.data.attendance.status).toBe(attendanceData.status);
      Assertions.assertAttendanceObject(response.body.data.attendance);
    });

    test('should mark attendance as teacher', async () => {
      const attendanceData = {
        student_id: studentData.student.id,
        course_id: course.id,
        date: '2024-10-01',
        status: 'Present'
      };

      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(attendanceData);

      Assertions.assertSuccess(response, 201);
    });

    test('should mark attendance for different statuses', async () => {
      const statuses = ['Present', 'Absent', 'Late', 'Excused'];

      for (let i = 0; i < statuses.length; i++) {
        const student = await TestHelpers.createStudent();
        const attendanceData = {
          student_id: student.student.id,
          course_id: course.id,
          date: '2024-10-01',
          status: statuses[i]
        };

        const response = await request(app)
          .post('/api/attendance')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(attendanceData);

        Assertions.assertSuccess(response, 201);
        expect(response.body.data.attendance.status).toBe(statuses[i]);
      }
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing student_id, course_id, date, status
        });

      Assertions.assertValidationError(response);
    });

    test('should validate status values', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          student_id: studentData.student.id,
          course_id: course.id,
          date: '2024-10-01',
          status: 'Invalid Status'
        });

      Assertions.assertValidationError(response);
    });

    test('should validate date format', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          student_id: studentData.student.id,
          course_id: course.id,
          date: 'invalid-date',
          status: 'Present'
        });

      Assertions.assertValidationError(response);
    });

    test('should not allow future dates', async () => {
      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          student_id: studentData.student.id,
          course_id: course.id,
          date: MockData.futureDate(),
          status: 'Present'
        });

      Assertions.assertValidationError(response);
    });

    test('should deny access for students', async () => {
      const attendanceData = MockData.validAttendance(studentData.student.id, course.id);

      const response = await request(app)
        .post('/api/attendance')
        .set('Authorization', `Bearer ${studentData.token}`)
        .send(attendanceData);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * POST /api/attendance/bulk
   * ============================================
   */
  describe('POST /api/attendance/bulk', () => {
    test('should mark bulk attendance as admin', async () => {
      const student2 = await TestHelpers.createStudent();

      const bulkData = {
        course_id: course.id,
        date: '2024-10-01',
        records: [
          {
            student_id: studentData.student.id,
            status: 'Present'
          },
          {
            student_id: student2.student.id,
            status: 'Absent',
            notes: 'Sick'
          }
        ]
      };

      const response = await request(app)
        .post('/api/attendance/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bulkData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.data.attendance.length).toBe(2);
    });

    test('should mark bulk attendance as teacher', async () => {
      const bulkData = {
        course_id: course.id,
        date: '2024-10-01',
        records: [
          {
            student_id: studentData.student.id,
            status: 'Present'
          }
        ]
      };

      const response = await request(app)
        .post('/api/attendance/bulk')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(bulkData);

      Assertions.assertSuccess(response, 201);
    });

    test('should validate bulk data', async () => {
      const response = await request(app)
        .post('/api/attendance/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          course_id: course.id,
          date: '2024-10-01',
          records: [] // Empty array
        });

      Assertions.assertValidationError(response);
    });
  });

  /**
   * ============================================
   * GET /api/attendance/student/:studentId
   * ============================================
   */
  describe('GET /api/attendance/student/:studentId', () => {
    test('should get student attendance as admin', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/attendance/student/${studentData.student.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('attendance');
      expect(response.body.data).toHaveProperty('stats');
    });

    test('should allow student to view own attendance', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/attendance/student/${studentData.student.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should allow teacher to view student attendance', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/attendance/student/${studentData.student.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should filter by course', async () => {
      const response = await request(app)
        .get(`/api/attendance/student/${studentData.student.id}?course_id=${course.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should filter by date range', async () => {
      const response = await request(app)
        .get(`/api/attendance/student/${studentData.student.id}?start_date=2024-10-01&end_date=2024-10-31`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny access to other students attendance', async () => {
      const otherStudent = await TestHelpers.createStudent();

      const response = await request(app)
        .get(`/api/attendance/student/${otherStudent.student.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/attendance/course/:courseId
   * ============================================
   */
  describe('GET /api/attendance/course/:courseId', () => {
    test('should get course attendance as admin', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/attendance/course/${course.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('attendance');
      expect(response.body.data).toHaveProperty('stats');
    });

    test('should allow teacher to view own course attendance', async () => {
      const response = await request(app)
        .get(`/api/attendance/course/${course.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should filter by date', async () => {
      const response = await request(app)
        .get(`/api/attendance/course/${course.id}?date=2024-10-01`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny students access', async () => {
      const response = await request(app)
        .get(`/api/attendance/course/${course.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/attendance/date/:date
   * ============================================
   */
  describe('GET /api/attendance/date/:date', () => {
    test('should get attendance by date as admin', async () => {
      await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        date: '2024-10-01'
      });

      const response = await request(app)
        .get('/api/attendance/date/2024-10-01')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('attendance');
      expect(response.body.data).toHaveProperty('stats');
    });

    test('should allow teacher to view attendance by date', async () => {
      const response = await request(app)
        .get('/api/attendance/date/2024-10-01')
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should filter by course', async () => {
      const response = await request(app)
        .get(`/api/attendance/date/2024-10-01?course_id=${course.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny students access', async () => {
      const response = await request(app)
        .get('/api/attendance/date/2024-10-01')
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/attendance/:id
   * ============================================
   */
  describe('GET /api/attendance/:id', () => {
    test('should get attendance by ID as admin', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.attendance.id).toBe(attendance.id);
      Assertions.assertAttendanceObject(response.body.data.attendance);
    });

    test('should allow teacher to view attendance', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should return 404 for non-existent attendance', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/attendance/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * PUT /api/attendance/:id
   * ============================================
   */
  describe('PUT /api/attendance/:id', () => {
    test('should update attendance as admin', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        status: 'Present'
      });

      const updateData = {
        status: 'Late',
        notes: 'Arrived 10 minutes late'
      };

      const response = await request(app)
        .put(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.attendance.status).toBe(updateData.status);
    });

    test('should update attendance as teacher', async () => {
      const attendance = await TestHelpers.markAttendance(teacherToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .put(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ status: 'Absent' });

      Assertions.assertSuccess(response, 200);
    });

    test('should validate status values', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .put(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Invalid' });

      Assertions.assertValidationError(response);
    });

    test('should deny access for students', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .put(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${studentData.token}`)
        .send({ status: 'Present' });

      Assertions.assertForbidden(response);
    });

    test('should return 404 for non-existent attendance', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .put(`/api/attendance/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Present' });

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * DELETE /api/attendance/:id
   * ============================================
   */
  describe('DELETE /api/attendance/:id', () => {
    test('should delete attendance as admin', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .delete(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.message).toBe('Attendance deleted successfully');
    });

    test('should delete attendance as teacher', async () => {
      const attendance = await TestHelpers.markAttendance(teacherToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .delete(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny access for students', async () => {
      const attendance = await TestHelpers.markAttendance(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .delete(`/api/attendance/${attendance.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });

    test('should return 404 for non-existent attendance', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .delete(`/api/attendance/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertNotFound(response);
    });
  });
});
