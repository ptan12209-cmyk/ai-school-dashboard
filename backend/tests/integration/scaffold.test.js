/**
 * Scaffold and Placeholder Routes Integration Tests
 * ================================================
 * Tests for newly added placeholder and health check endpoints.
 */

const {
  request,
  app,
  setupDatabase,
  cleanDatabase,
  closeDatabase,
  TestHelpers,
  Assertions
} = require('../setup');

describe('Scaffold and Placeholder Routes API', () => {
  let adminUser;

  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    adminUser = await TestHelpers.createAdmin();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  /**
   * ============================================
   * Health Checks for New/Updated Routers
   * ============================================
   */
  describe('GET /api/.../health', () => {
    const routers = [
      'students',
      'teachers',
      'auth',
      'assignments',
      'users',
      'notifications',
      'grades',
      'courses',
      'classes',
      'attendance',
      'dashboard'
    ];

    routers.forEach(routerName => {
      test(`should return 200 OK for ${routerName} health check`, async () => {
        const response = await request(app)
          .get(`/api/${routerName}/health`)
          .set('Authorization', `Bearer ${adminUser.token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.status || response.body.ok).toBeTruthy();
      });
    });
  });

  /**
   * ============================================
   * 501 Not Implemented Placeholders
   * ============================================
   */
  describe('501 Not Implemented Endpoints', () => {
    test('should return 501 for POST /api/auth/refresh', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${adminUser.token}`);

      expect(response.status).toBe(501);
      expect(response.body.status).toBe('not_implemented');
      expect(response.body.endpoint).toBe('POST /auth/refresh');
    });

    test('should return 501 for GET /api/dashboard/stats', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${adminUser.token}`);

      expect(response.status).toBe(501);
      expect(response.body.status).toBe('not_implemented');
      expect(response.body.endpoint).toBe('GET /dashboard/stats');
    });

    test('should return 501 for POST /api/students/:studentId/archive', async () => {
        const { student } = await TestHelpers.createStudent();
        const response = await request(app)
            .post(`/api/students/${student.id}/archive`)
            .set('Authorization', `Bearer ${adminUser.token}`);

        expect(response.status).toBe(501);
        expect(response.body.status).toBe('not_implemented');
    });

    test('should return 501 for POST /api/teachers/:teacherId/archive', async () => {
        const { teacher } = await TestHelpers.createTeacher();
        const response = await request(app)
            .post(`/api/teachers/${teacher.id}/archive`)
            .set('Authorization', `Bearer ${adminUser.token}`);

        expect(response.status).toBe(501);
        expect(response.body.status).toBe('not_implemented');
    });
  });
});