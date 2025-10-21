/**
 * Teacher Management Integration Tests
 * ======================================
 * Tests for teacher CRUD endpoints
 * 
 * Endpoints tested:
 * - GET    /api/teacher
 * - GET    /api/teacher/departments/list
 * - GET    /api/teacher/stats
 * - GET    /api/teacher/:id
 * - POST   /api/teacher
 * - PUT    /api/teacher/:id
 * - DELETE /api/teacher/:id
 * - GET    /api/teacher/:id/course
 * 
 * Total tests: 25
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

describe('Teacher Management API', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * ============================================
   * GET /api/teacher
   * ============================================
   */
  describe('GET /api/teacher', () => {
    test('should get all teacher', async () => {
      const { token } = await TestHelpers.createAdmin();
      
      await TestHelpers.createTeacher({ department: 'Mathematics' });
      await TestHelpers.createTeacher({ department: 'Science' });

      const response = await request(app)
        .get('/api/teacher')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('teacher');
      expect(Array.isArray(response.body.data.teacher)).toBe(true);
      expect(response.body.data.teacher.length).toBeGreaterThanOrEqual(2);
      Assertions.assertPagination(response);
    });

    test('should support pagination', async () => {
      const { token } = await TestHelpers.createAdmin();
      
      for (let i = 0; i < 5; i++) {
        await TestHelpers.createTeacher({ email: `teacher${i}@test.com` });
      }

      const response = await request(app)
        .get('/api/teacher?page=1&limit=3')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.teacher.length).toBeLessThanOrEqual(3);
    });

    test('should filter by department', async () => {
      const { token } = await TestHelpers.createAdmin();
      
      await TestHelpers.createTeacher({ department: 'Mathematics' });
      await TestHelpers.createTeacher({ department: 'Science' });

      const response = await request(app)
        .get('/api/teacher?department=Mathematics')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      response.body.data.teacher.forEach(teacher => {
        expect(teacher.department).toBe('Mathematics');
      });
    });

    test('should search by name', async () => {
      const { token } = await TestHelpers.createAdmin();
      
      await TestHelpers.createTeacher({ 
        firstName: 'John', 
        lastName: 'Smith' 
      });

      const response = await request(app)
        .get('/api/teacher?search=John')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.teacher.length).toBeGreaterThan(0);
    });

    test('should return only active teacher for non-admin', async () => {
      const adminData = await TestHelpers.createAdmin();
      const { token: teacherToken } = await TestHelpers.createTeacher();
      const { user } = await TestHelpers.createTeacher();

      // Deactivate one teacher
      await request(app)
        .patch(`/api/user/${user.id}/deactivate`)
        .set('Authorization', `Bearer ${adminData.token}`);

      const response = await request(app)
        .get('/api/teacher')
        .set('Authorization', `Bearer ${teacherToken}`);

      Assertions.assertSuccess(response, 200);
      response.body.data.teacher.forEach(teacher => {
        expect(teacher.user.is_active).toBe(true);
      });
    });
  });

  /**
   * ============================================
   * GET /api/teacher/departments/list
   * ============================================
   */
  describe('GET /api/teacher/departments/list', () => {
    test('should get department list without authentication', async () => {
      // Create teacher with different departments
      await TestHelpers.createTeacher({ department: 'Mathematics' });
      await TestHelpers.createTeacher({ department: 'Science' });
      await TestHelpers.createTeacher({ department: 'Mathematics' }); // Duplicate

      const response = await request(app)
        .get('/api/teacher/departments/list');

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('departments');
      expect(Array.isArray(response.body.data.departments)).toBe(true);
      expect(response.body.data.departments).toContain('Mathematics');
      expect(response.body.data.departments).toContain('Science');
    });

    test('should return empty array when no teacher', async () => {
      const response = await request(app)
        .get('/api/teacher/departments/list');

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.departments).toEqual([]);
    });
  });

  /**
   * ============================================
   * GET /api/teacher/stats
   * ============================================
   */
  describe('GET /api/teacher/stats', () => {
    test('should get teacher statistics as admin', async () => {
      const { token } = await TestHelpers.createAdmin();
      
      await TestHelpers.createTeacher({ department: 'Mathematics' });
      await TestHelpers.createTeacher({ department: 'Science' });
      await TestHelpers.createTeacher({ department: 'Mathematics' });

      const response = await request(app)
        .get('/api/teacher/stats')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('active');
      expect(response.body.data).toHaveProperty('byDepartment');
      expect(Array.isArray(response.body.data.byDepartment)).toBe(true);
    });

    test('should deny access for non-admin', async () => {
      const { token } = await TestHelpers.createTeacher();

      const response = await request(app)
        .get('/api/teacher/stats')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * POST /api/teacher
   * ============================================
   */
  describe('POST /api/teacher', () => {
    test('should create teacher as admin', async () => {
      const { token } = await TestHelpers.createAdmin();

      const teacherData = {
        email: 'newteacher@test.com',
        password: 'Teacher123!',
        firstName: 'John',
        lastName: 'Doe',
        department: 'Mathematics',
        phone: '1234567890',
        hireDate: '2023-01-01'
      };

      const response = await request(app)
        .post('/api/teacher')
        .set('Authorization', `Bearer ${token}`)
        .send(teacherData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.message).toBe('Teacher created successfully');
      expect(response.body.data.teacher.first_name).toBe(teacherData.firstName);
      expect(response.body.data.teacher.department).toBe(teacherData.department);
      Assertions.assertTeacherObject(response.body.data.teacher);
    });

    test('should create teacher without optional fields', async () => {
      const { token } = await TestHelpers.createAdmin();

      const teacherData = {
        email: 'minimal@test.com',
        password: 'Teacher123!',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      const response = await request(app)
        .post('/api/teacher')
        .set('Authorization', `Bearer ${token}`)
        .send(teacherData);

      Assertions.assertSuccess(response, 201);
      expect(response.body.data.teacher.first_name).toBe(teacherData.firstName);
    });

    test('should fail with duplicate email', async () => {
      const { token } = await TestHelpers.createAdmin();
      
      await TestHelpers.createTeacher({ email: 'duplicate@test.com' });

      const teacherData = {
        email: 'duplicate@test.com',
        password: 'Teacher123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/teacher')
        .set('Authorization', `Bearer ${token}`)
        .send(teacherData);

      Assertions.assertConflict(response);
    });

    test('should validate required fields', async () => {
      const { token } = await TestHelpers.createAdmin();

      const response = await request(app)
        .post('/api/teacher')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test@test.com'
          // Missing password, firstName, lastName
        });

      Assertions.assertValidationError(response);
    });

    test('should validate password strength', async () => {
      const { token } = await TestHelpers.createAdmin();

      const response = await request(app)
        .post('/api/teacher')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test@test.com',
          password: 'weak',
          firstName: 'John',
          lastName: 'Doe'
        });

      Assertions.assertValidationError(response);
    });

    test('should deny access for non-admin', async () => {
      const { token } = await TestHelpers.createTeacher();

      const teacherData = MockData.validTeacher();

      const response = await request(app)
        .post('/api/teacher')
        .set('Authorization', `Bearer ${token}`)
        .send(teacherData);

      Assertions.assertForbidden(response);
    });
  });

  /**
   * ============================================
   * GET /api/teacher/:id
   * ============================================
   */
  describe('GET /api/teacher/:id', () => {
    test('should get teacher by ID', async () => {
      const { token } = await TestHelpers.createAdmin();
      const { teacher } = await TestHelpers.createTeacher();

      const response = await request(app)
        .get(`/api/teacher/${teacher.id}`)
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.teacher.id).toBe(teacher.id);
      Assertions.assertTeacherObject(response.body.data.teacher);
    });

    test('should return 404 for non-existent teacher', async () => {
      const { token } = await TestHelpers.createAdmin();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/teacher/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * PUT /api/teacher/:id
   * ============================================
   */
  describe('PUT /api/teacher/:id', () => {
    test('should update teacher as admin', async () => {
      const { token } = await TestHelpers.createAdmin();
      const { teacher } = await TestHelpers.createTeacher();

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        department: 'Physics',
        phone: '9876543210'
      };

      const response = await request(app)
        .put(`/api/teacher/${teacher.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.teacher.first_name).toBe(updateData.firstName);
      expect(response.body.data.teacher.department).toBe(updateData.department);
    });

    test('should update own profile as teacher', async () => {
      const { token, teacher } = await TestHelpers.createTeacher();

      const updateData = {
        phone: '1111111111'
      };

      const response = await request(app)
        .put(`/api/teacher/${teacher.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data.teacher.phone).toBe(updateData.phone);
    });

    test('should not allow updating other teacher profiles', async () => {
      const { token } = await TestHelpers.createTeacher();
      const { teacher: otherTeacher } = await TestHelpers.createTeacher();

      const response = await request(app)
        .put(`/api/teacher/${otherTeacher.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '0000000000' });

      Assertions.assertForbidden(response);
    });

    test('should return 404 for non-existent teacher', async () => {
      const { token } = await TestHelpers.createAdmin();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .put(`/api/teacher/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Test' });

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * DELETE /api/teacher/:id
   * ============================================
   */
  describe('DELETE /api/teacher/:id', () => {
    test('should delete teacher as admin', async () => {
      const { token } = await TestHelpers.createAdmin();
      const { teacher } = await TestHelpers.createTeacher();

      const response = await request(app)
        .delete(`/api/teacher/${teacher.id}`)
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.message).toBe('Teacher deleted successfully');
    });

    test('should not allow deleting own account', async () => {
      const adminData = await TestHelpers.createAdmin();
      const { token, teacher } = await TestHelpers.createTeacher();

      const response = await request(app)
        .delete(`/api/teacher/${teacher.id}`)
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertForbidden(response);
    });

    test('should deny access for non-admin', async () => {
      const { token } = await TestHelpers.createTeacher();
      const { teacher: otherTeacher } = await TestHelpers.createTeacher();

      const response = await request(app)
        .delete(`/api/teacher/${otherTeacher.id}`)
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertForbidden(response);
    });

    test('should return 404 for non-existent teacher', async () => {
      const { token } = await TestHelpers.createAdmin();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .delete(`/api/teacher/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertNotFound(response);
    });
  });

  /**
   * ============================================
   * GET /api/teacher/:id/course
   * ============================================
   */
  describe('GET /api/teacher/:id/course', () => {
    test('should get teacher course', async () => {
      const { token, teacher } = await TestHelpers.createTeacher();

      const response = await request(app)
        .get(`/api/teacher/${teacher.id}/course`)
        .set('Authorization', `Bearer ${token}`);

      // Currently returns placeholder message
      Assertions.assertSuccess(response, 200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
