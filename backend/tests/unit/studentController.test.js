const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock models
const mockStudent = {
  findByPk: jest.fn(),
  findUnassigned: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  findAll: jest.fn(),
  sequelize: {
    fn: jest.fn(),
    col: jest.fn()
  }
};

const mockGrade = {
  findAll: jest.fn(),
  calculateStudentGPA: jest.fn()
};

const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  validatePassword: jest.fn()
};

const mockCourse = {};

// Mock Sequelize Op
const mockOp = {
  or: 'or',
  iLike: 'iLike',
  ne: 'ne'
};

jest.mock('sequelize', () => ({
  Op: mockOp
}));

jest.mock('../../models', () => ({
  Student: mockStudent,
  Grade: mockGrade,
  User: mockUser,
  Course: mockCourse
}));

// Mock Error Handler
jest.mock('../../middleware/errorHandler', () => ({
  catchAsync: (fn) => fn,
  AuthorizationError: class extends Error {},
  NotFoundError: class extends Error {},
  ValidationError: class extends Error {},
  ConflictError: class extends Error {}
}));

const studentController = require('../../controllers/studentController');

describe('Student Controller - getStudentGrades', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'student-123' },
      query: {},
      user: { id: 'user-123', role: 'student' } // default as self
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  test('should return grades and GPA stats', async () => {
    // Setup mock student
    mockStudent.findByPk.mockResolvedValue({
      id: 'student-123',
      user_id: 'user-123',
      first_name: 'John',
      last_name: 'Doe'
    });

    // Setup mock grades
    const mockGradesList = [
      { id: 'grade-1', score: 90, course: { name: 'Math' } }
    ];
    mockGrade.findAll.mockResolvedValue(mockGradesList);

    // Setup mock GPA
    const mockGPA = {
      gpa: 3.5,
      totalCredits: 3,
      gradeCount: 1
    };
    mockGrade.calculateStudentGPA.mockResolvedValue(mockGPA);

    await studentController.getStudentGrades(req, res);

    expect(mockStudent.findByPk).toHaveBeenCalledWith('student-123');
    expect(mockGrade.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { student_id: 'student-123' },
      include: expect.any(Array)
    }));
    expect(mockGrade.calculateStudentGPA).toHaveBeenCalledWith('student-123', expect.any(Object));

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: expect.objectContaining({
        grades: mockGradesList,
        stats: expect.objectContaining({
          gpa: 3.5
        })
      })
    }));
  });
});
