/**
 * Grade Management Integration Tests
 * ====================================
 * Tests for grade/score CRUD endpoints
 * 
 * Endpoints tested:
 * - GET    /api/grade
 * - GET    /api/grade/stats
 * - GET    /api/grade/student/:studentId
 * - GET    /api/grade/course/:courseId
 * - GET    /api/grade/:id
 * - POST   /api/grade
 * - POST   /api/grade/bulk
 * - PUT    /api/grade/:id
 * - DELETE /api/grade/:id
 * 
 * Total tests: 35
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

describe('Grade Management API', () => {
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
   * GET /api/grade
   * ============================================
   */
  describe('GET /api/grade', () => {
    test('should get all grades as admin', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('grades');
      expect(Array.isArray(response.body.data.grades)).toBe(true);
      Assertions.assertPagination(response);
    });

    test('should get grades as teacher', async () => {
      const response = await request(app)
        .get('/api/grade')
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should support pagination', async () => {
      for (let i = 0; i < 5; i++) {
        await TestHelpers.createGrade(adminToken, {
          student_id: studentData.student.id,
          course_id: course.id,
          score: 80 + i,
          grade_type: i < 2 ? (i % 2 === 0 ? 'Test' : 'Quiz') : (i === 2 ? 'Final' : i === 3 ? 'Midterm' : 'Assignment'),
          semester: i < 2 ? `${i + 1}` : 'Final' // Use valid semester values: 1, 2, Final
        });
      }

      const response = await request(app)
        .get('/api/grade?page=1&limit=3')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.grades.length).toBeLessThanOrEqual(3);
    });

    test('should filter by semester', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        semester: '1'
      });

      const response = await request(app)
        .get('/api/grade?semester=1')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      response.body.data.grades.forEach(grade => {
        expect(grade.semester).toBe('1');
      });
    });

    test('should filter by grade type', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        grade_type: 'Quiz'
      });

      const response = await request(app)
        .get('/api/grade?grade_type=Quiz')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      response.body.data.grades.forEach(grade => {
        expect(grade.grade_type).toBe('Quiz');
      });
    });

    test('should deny access for students', async () => {
      const response = await request(app)
        .get('/api/grade')
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/grade/stats
   * ============================================
   */
  describe('GET /api/grade/stats', () => {
    test('should get grade statistics as admin', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        score: 85,
        is_published: true
      });

      const response = await request(app)
        .get('/api/grade/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('published');
      expect(response.body.data).toHaveProperty('averageScore');
      expect(response.body.data).toHaveProperty('byLetterGrade');
    });

    test('should deny access for non-admin', async () => {
      const response = await request(app)
        .get('/api/grade/stats')
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * POST /api/grade
   * ============================================
   */
  describe('POST /api/grade', () => {
    test('should create grade as admin', async () => {
      const gradeData = {
        student_id: studentData.student.id,
        course_id: course.id,
        score: 92.5,
        grade_type: 'Test',
        semester: '1',
        graded_date: '2024-10-01',
        notes: 'Excellent work',
        is_published: true
      };

      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(gradeData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.message).toBe('Grade created successfully');
      expect(response.body.data.grade.score).toBe(gradeData.score);
      expect(response.body.data.grade).toHaveProperty('letter_grade');
      Assertions.assertGradeObject(response.body.data.grade);
    });

    test('should create grade as teacher', async () => {
      const gradeData = {
        student_id: studentData.student.id,
        course_id: course.id,
        score: 88,
        grade_type: 'Assignment',
        semester: '1'
      };

      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(gradeData);

      Assertions.assertSuccess(response, 201);
    });

    test('should automatically calculate letter grade', async () => {
      const gradeData = {
        student_id: studentData.student.id,
        course_id: course.id,
        score: 95,
        grade_type: 'Test',
        semester: '1'
      };

      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(gradeData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.data.grade.letter_grade).toBe('A');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing student_id, course_id, score, grade_type, semester
        });

      Assertions.assertValidationError(response);
    });

    test('should validate score range', async () => {
      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          student_id: studentData.student.id,
          course_id: course.id,
          score: 150, // Invalid, must be 0-100
          grade_type: 'Test',
          semester: '1'
        });

      Assertions.assertValidationError(response);
    });

    test('should validate grade type', async () => {
      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          student_id: studentData.student.id,
          course_id: course.id,
          score: 85,
          grade_type: 'Invalid Type',
          semester: '1'
        });

      Assertions.assertValidationError(response);
    });

    test('should validate semester', async () => {
      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          student_id: studentData.student.id,
          course_id: course.id,
          score: 85,
          grade_type: 'Test',
          semester: '5' // Invalid
        });

      Assertions.assertValidationError(response);
    });

    test('should deny access for students', async () => {
      const gradeData = MockData.validGrade(studentData.student.id, course.id);

      const response = await request(app)
        .post('/api/grade')
        .set('Authorization', `Bearer ${studentData.token}`)
        .send(gradeData);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * POST /api/grade/bulk
   * ============================================
   */
  describe('POST /api/grade/bulk', () => {
    test('should create multiple grades as admin', async () => {
      const student2 = await TestHelpers.createStudent();

      const bulkData = {
        grades: [
          {
            student_id: studentData.student.id,
            course_id: course.id,
            score: 85,
            grade_type: 'Test',
            semester: '1'
          },
          {
            student_id: student2.student.id,
            course_id: course.id,
            score: 90,
            grade_type: 'Test',
            semester: '1'
          }
        ]
      };

      const response = await request(app)
        .post('/api/grade/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bulkData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.data.grades.length).toBe(2);
    });

    test('should validate bulk data', async () => {
      const response = await request(app)
        .post('/api/grade/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          grades: [] // Empty array
        });

      Assertions.assertValidationError(response);
    });
  });

  /**
   * ============================================
   * GET /api/grade/student/:studentId
   * ============================================
   */
  describe('GET /api/grade/student/:studentId', () => {
    test('should get student grades as admin', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/grade/student/${studentData.student.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('grades');
    });

    test('should allow student to view own grades', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        is_published: true
      });

      const response = await request(app)
        .get(`/api/grade/student/${studentData.student.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should allow teacher to view student grades', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/grade/student/${studentData.student.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should filter by semester', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        semester: '1'
      });

      const response = await request(app)
        .get(`/api/grade/student/${studentData.student.id}?semester=1`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny access to other students grades', async () => {
      const otherStudent = await TestHelpers.createStudent();

      const response = await request(app)
        .get(`/api/grade/student/${otherStudent.student.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/grade/course/:courseId
   * ============================================
   */
  describe('GET /api/grade/course/:courseId', () => {
    test('should get course grades as admin', async () => {
      await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/grade/course/${course.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('grades');
    });

    test('should allow teacher to view own course grades', async () => {
      const response = await request(app)
        .get(`/api/grade/course/${course.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny students access', async () => {
      const response = await request(app)
        .get(`/api/grade/course/${course.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/grade/:id
   * ============================================
   */
  describe('GET /api/grade/:id', () => {
    test('should get grade by ID as admin', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .get(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.grade.id).toBe(grade.id);
      Assertions.assertGradeObject(response.body.data.grade);
    });

    test('should allow student to view own published grade', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        is_published: true
      });

      const response = await request(app)
        .get(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should return 404 for non-existent grade', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/grade/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * PUT /api/grade/:id
   * ============================================
   */
  describe('PUT /api/grade/:id', () => {
    test('should update grade as admin', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        score: 80
      });

      const updateData = {
        score: 95,
        notes: 'Improved performance',
        is_published: true
      };

      const response = await request(app)
        .put(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.grade.score).toBe(updateData.score);
      expect(response.body.data.grade.letter_grade).toBe('A');
    });

    test('should update grade as teacher', async () => {
      const grade = await TestHelpers.createGrade(teacherToken, {
        student_id: studentData.student.id,
        course_id: course.id,
        score: 80
      });

      const response = await request(app)
        .put(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ score: 85 });

      Assertions.assertSuccess(response, 200);
    });

    test('should validate score range', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .put(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ score: -10 });

      Assertions.assertValidationError(response);
    });

    test('should deny access for students', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .put(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${studentData.token}`)
        .send({ score: 100 });

      Assertions.assertForbidden(response);
    });

    test('should return 404 for non-existent grade', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .put(`/api/grade/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ score: 90 });

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * DELETE /api/grade/:id
   * ============================================
   */
  describe('DELETE /api/grade/:id', () => {
    test('should delete grade as admin', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .delete(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.message).toBe('Grade deleted successfully');
    });

    test('should delete grade as teacher', async () => {
      const grade = await TestHelpers.createGrade(teacherToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .delete(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
    });

    test('should deny access for students', async () => {
      const grade = await TestHelpers.createGrade(adminToken, {
        student_id: studentData.student.id,
        course_id: course.id
      });

      const response = await request(app)
        .delete(`/api/grade/${grade.id}`)
        .set('Authorization', `Bearer ${studentData.token}`);

      Assertions.assertForbidden(response);
    });

    test('should return 404 for non-existent grade', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .delete(`/api/grade/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      Assertions.assertNotFound(response);
    });
  });
});
