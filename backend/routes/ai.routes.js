/**
 * AI Routes
 * =========
 * Routes for AI-powered features
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

/**
 * @route   POST /api/ai/chat
 * @desc    AI Chatbot conversation
 * @access  Private
 */
router.post('/chat',
  verifyToken,
  [
    body('message').notEmpty().withMessage('Message is required')
  ],
  validate,
  aiController.chat
);

/**
 * @route   POST /api/ai/predict-grade
 * @desc    Predict student grade
 * @access  Private
 */
router.post('/predict-grade',
  verifyToken,
  [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  validate,
  aiController.predictGrade
);

/**
 * @route   POST /api/ai/detect-risk
 * @desc    Detect at-risk students
 * @access  Private (Teacher/Admin)
 */
router.post('/detect-risk',
  verifyToken,
  aiController.detectRisk
);

/**
 * @route   POST /api/ai/generate-report
 * @desc    Generate AI report
 * @access  Private
 */
router.post('/generate-report',
  verifyToken,
  [
    body('studentId').notEmpty().withMessage('Student ID is required')
  ],
  validate,
  aiController.generateReport
);

/**
 * @route   GET /api/ai/status
 * @desc    Get AI service status
 * @access  Private
 */
router.get('/status',
  verifyToken,
  aiController.getStatus
);

module.exports = router;
