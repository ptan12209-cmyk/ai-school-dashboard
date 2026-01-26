
const assignmentService = require('../../services/assignmentService');
const { Assignment, Question, Submission, Student, Course, Teacher, User } = require('../../models');
const notificationService = require('../../services/notificationService');

// Mock dependencies
jest.mock('../../models', () => ({
  Assignment: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Question: {
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
    increment: jest.fn(),
    getByAssignment: jest.fn(),
  },
  Submission: {
    create: jest.fn(),
    findByPk: jest.fn(),
    getAttemptsCount: jest.fn(),
    findAll: jest.fn(),
    getAssignmentStats: jest.fn(),
  },
  Student: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Course: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Teacher: {},
  User: {},
}));

jest.mock('../../services/notificationService', () => ({
  createNotification: jest.fn(),
  createBulkNotifications: jest.fn(),
}));

describe('AssignmentService.submitAssignment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should optimize grading with N+1 queries fix', async () => {
    // Setup data
    const submissionId = 'sub-1';
    const studentId = 'student-1';
    const assignmentId = 'assign-1';

    const mockSubmission = {
      id: submissionId,
      student_id: studentId,
      assignment_id: assignmentId,
      status: 'draft',
      submit: jest.fn(),
    };

    const mockAssignment = {
      id: assignmentId,
      title: 'Test Assignment',
      updateStatistics: jest.fn(),
    };

    // Create mock questions
    const mockQuestions = [
      {
        id: 'q1',
        points: 10,
        question_type: 'multiple_choice',
        isAutoGradable: () => true,
        checkAnswer: (ans) => ans === 'A',
      },
      {
        id: 'q2',
        points: 10,
        question_type: 'multiple_choice',
        isAutoGradable: () => true,
        checkAnswer: (ans) => ans === 'B',
      },
      {
        id: 'q3',
        points: 10,
        question_type: 'essay',
        isAutoGradable: () => false,
        checkAnswer: () => null,
      },
    ];

    const answers = {
      'q1': 'A', // Correct
      'q2': 'C', // Incorrect
      'q3': 'Essay Answer', // Manual
    };

    const mockStudent = {
      user_id: 'user-1',
      user: {}
    };

    // Setup mocks
    Submission.findByPk.mockResolvedValueOnce(mockSubmission) // initial find
                      .mockResolvedValueOnce(mockSubmission); // return at the end
    Assignment.findByPk.mockResolvedValue(mockAssignment);
    Question.findAll.mockResolvedValue(mockQuestions);
    Student.findByPk.mockResolvedValue(mockStudent);
    Question.increment.mockResolvedValue([[], 1]); // Simulate success

    // Execute
    const io = {}; // Mock io object
    await assignmentService.submitAssignment(submissionId, answers, studentId, io);

    // Verify N+1 fix: Question.increment should be called for correct and incorrect answers
    expect(Question.increment).toHaveBeenCalledTimes(2);

    // Check correct answers update
    expect(Question.increment).toHaveBeenCalledWith(
      { times_answered: 1, times_correct: 1 },
      { where: { id: ['q1'] } }
    );

    // Check incorrect answers update
    expect(Question.increment).toHaveBeenCalledWith(
      { times_answered: 1 },
      { where: { id: ['q2'] } }
    );

    // Verify submission update logic
    expect(mockSubmission.submit).toHaveBeenCalled();
    const expectedGradedAnswers = {
      'q1': {
        answer: 'A',
        is_correct: true,
        points_earned: 10,
        max_points: 10
      },
      'q2': {
        answer: 'C',
        is_correct: false,
        points_earned: 0,
        max_points: 10
      },
      'q3': {
        answer: 'Essay Answer',
        is_correct: null,
        points_earned: 0,
        max_points: 10,
        needs_manual_grading: true
      }
    };

    // Check that graded answers contain expected properties
    // We can't strict equal matches because of how objects might be constructed
    expect(mockSubmission.answers).toMatchObject(expectedGradedAnswers);
    expect(mockSubmission.needs_manual_grading).toBe(true);
  });
});
