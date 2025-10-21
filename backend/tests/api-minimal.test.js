// ============================================
// MINIMAL API TESTS
// ============================================
// Copy file này vào: backend/api.test.js
// Chạy: npm test

const request = require('supertest');
const app = require('../app');

let adminToken = '';
let adminEmail = '';

describe('🧪 API Tests', () => {
  
  test('Health check', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('OK');
    console.log('✅ Health check passed');
  });
  
  test('Register admin', async () => {
    adminEmail = `admin${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        firstName: 'Test',
        lastName: 'Admin'
      })
      .expect(201);
    
    adminToken = res.body.data.token;
    console.log('✅ Admin registered');
  });
  
  test('Login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminEmail,
        password: 'Admin@123'
      })
      .expect(200);
    
    console.log('✅ Login successful');
  });
  
  test('Get current user', async () => {
    await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    console.log('✅ Got current user');
  });
  
  test('List users', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    console.log(`✅ Listed ${res.body.data.user.length} users`);
  });
});
// In tests/api-minimal.test.js, add:

test('Create teacher', async () => {
  const res = await request(app)
    .post('/api/teacher')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      email: `teacher${Date.now()}@test.com`,
      password: 'Teacher@123',
      firstName: 'New',
      lastName: 'Teacher',
      department: 'Science'
    })
    .expect(201);
  
  console.log('✅ Teacher created');
});

test('Create student', async () => {
  const res = await request(app)
    .post('/api/student')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      email: `student${Date.now()}@test.com`,
      password: 'Student@123',
      firstName: 'New',
      lastName: 'Student',
      dateOfBirth: '2010-01-15',
      gender: 'M'
    })
    .expect(201);
  
  console.log('✅ Student created');
});