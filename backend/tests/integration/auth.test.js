/**
 * Authentication Integration Tests
 * ==================================
 * Tests for user authentication endpoints
 * 
 * Endpoints tested:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/auth/me
 * - POST /api/auth/logout
 * 
 * Total tests: 20
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

describe('Authentication API', () => {
  // Setup database before all tests
  beforeAll(async () => {
    await setupDatabase();
  });

  // Clean database before each test
  beforeEach(async () => {
    await cleanDatabase();
  });

  // Close database after all tests
  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * ============================================
   * POST /api/auth/register
   * ============================================
   */
  describe('POST /api/auth/register', () => {
    describe('Success Cases', () => {
      test('should register new admin user', async () => {
        const userData = {
          email: 'admin@test.com',
          password: 'Admin123!',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertSuccess(response, 201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.user.email).toBe(userData.email);
        expect(response.body.data.user.role).toBe('admin');
        Assertions.assertUserObject(response.body.data.user);
      });

      test('should register new teacher with profile', async () => {
        const userData = {
          email: 'teacher@test.com',
          password: 'Teacher123!',
          role: 'teacher',
          firstName: 'John',
          lastName: 'Teacher',
          department: 'Mathematics',
          phone: '1234567890'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertSuccess(response, 201);
        expect(response.body.data).toHaveProperty('profile');
        expect(response.body.data.profile).toHaveProperty('id');
        expect(response.body.data.profile.first_name).toBe(userData.firstName);
        expect(response.body.data.profile.department).toBe(userData.department);
      });

      test('should register new student with profile', async () => {
        const userData = {
          email: 'student@test.com',
          password: 'Student123!',
          role: 'student',
          firstName: 'Jane',
          lastName: 'Student',
          dateOfBirth: '2008-01-01',
          gender: 'F',
          parentName: 'Parent Name',
          parentEmail: 'parent@test.com'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertSuccess(response, 201);
        expect(response.body.data).toHaveProperty('profile');
        expect(response.body.data.profile).toHaveProperty('id');
        expect(response.body.data.profile.first_name).toBe(userData.firstName);
        expect(response.body.data.profile.date_of_birth).toBe(userData.dateOfBirth);
      });

      test('should register with minimal required fields', async () => {
        const userData = {
          email: 'minimal@test.com',
          password: 'Password123!',
          role: 'student'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertSuccess(response, 201);
      });
    });

    describe('Validation Errors', () => {
      test('should fail with invalid email format', async () => {
        const userData = {
          email: 'invalid-email',
          password: 'Password123!',
          role: 'student'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertValidationError(response);
      });

      test('should fail with weak password (too short)', async () => {
        const userData = {
          email: 'user@test.com',
          password: 'Pass1!',
          role: 'student'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertValidationError(response);
      });

      test('should fail with password missing uppercase', async () => {
        const userData = {
          email: 'user@test.com',
          password: 'password123!',
          role: 'student'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertValidationError(response);
      });

      test('should fail with password missing number', async () => {
        const userData = {
          email: 'user@test.com',
          password: 'Password!',
          role: 'student'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertValidationError(response);
      });

      test('should fail with invalid role', async () => {
        const userData = {
          email: 'user@test.com',
          password: 'Password123!',
          role: 'invalid_role'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertValidationError(response);
      });
    });

    describe('Conflict Errors', () => {
      test('should fail when email already exists', async () => {
        const userData = {
          email: 'duplicate@test.com',
          password: 'Password123!',
          role: 'student'
        };

        // First registration
        await request(app).post('/api/auth/register').send(userData);

        // Second registration with same email
        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        Assertions.assertConflict(response);
        expect(response.body.message).toMatch(/email.*already exists/i);
      });
    });
  });

  /**
   * ============================================
   * POST /api/auth/login
   * ============================================
   */
  describe('POST /api/auth/login', () => {
    describe('Success Cases', () => {
      test('should login with valid credentials', async () => {
        // Register user first
        const userData = {
          email: 'login@test.com',
          password: 'Password123!',
          role: 'student'
        };
        await request(app).post('/api/auth/register').send(userData);

        // Login
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          });

        Assertions.assertSuccess(response, 200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.user.email).toBe(userData.email);
      });

      test('should return user profile on login', async () => {
        // Register teacher
        const userData = {
          email: 'teacher@test.com',
          password: 'Teacher123!',
          role: 'teacher',
          firstName: 'John',
          lastName: 'Teacher'
        };
        await request(app).post('/api/auth/register').send(userData);

        // Login
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          });

        Assertions.assertSuccess(response, 200);
        expect(response.body.data).toHaveProperty('profile');
        expect(response.body.data.profile).toHaveProperty('firstName');
        expect(response.body.data.profile.firstName).toBe(userData.firstName);
      });
    });

    describe('Authentication Errors', () => {
      test('should fail with invalid email', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@test.com',
            password: 'Password123!'
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/invalid.*email.*password/i);
      });

      test('should fail with wrong password', async () => {
        // Register user
        const userData = {
          email: 'wrongpwd@test.com',
          password: 'Correct123!',
          role: 'student'
        };
        await request(app).post('/api/auth/register').send(userData);

        // Login with wrong password
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: 'Wrong123!'
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
      });

      test('should fail with inactive account', async () => {
        // Register user
        const { user } = await TestHelpers.createAdmin();

        // Deactivate account
        await request(app)
          .patch(`/api/user/${user.id}/deactivate`)
          .set('Authorization', `Bearer ${(await TestHelpers.createAdmin()).token}`);

        // Try to login
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: user.email,
            password: 'Admin123!'
          });

        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/inactive/i);
      });
    });

    describe('Validation Errors', () => {
      test('should fail without email', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            password: 'Password123!'
          });

        Assertions.assertValidationError(response);
      });

      test('should fail without password', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'user@test.com'
          });

        Assertions.assertValidationError(response);
      });
    });
  });

  /**
   * ============================================
   * GET /api/auth/me
   * ============================================
   */
  describe('GET /api/auth/me', () => {
    test('should return current user profile with valid token', async () => {
      const { token, user } = await TestHelpers.createStudent();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.id).toBe(user.id);
      expect(response.body.data.user.email).toBe(user.email);
    });

    test('should return teacher profile', async () => {
      const { token } = await TestHelpers.createTeacher();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data.profile).toHaveProperty('first_name');
    });

    test('should fail without token', async () => {
      const response = await request(app).get('/api/auth/me');

      Assertions.assertAuthRequired(response);
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      Assertions.assertAuthRequired(response);
    });
  });

  /**
   * ============================================
   * POST /api/auth/logout
   * ============================================
   */
  describe('POST /api/auth/logout', () => {
    test('should logout successfully', async () => {
      const { token } = await TestHelpers.createStudent();

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      Assertions.assertSuccess(response, 200);
      expect(response.body.message).toBe('Logout successful');
    });

    test('should fail without token', async () => {
      const response = await request(app).post('/api/auth/logout');

      Assertions.assertAuthRequired(response);
    });
  });
});
