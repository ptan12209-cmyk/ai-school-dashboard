/**
 * AI Routes
 * =========
 * Routes for AI-powered features
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI assistant
 * @access  Private
 */
router.post('/chat', verifyToken, aiController.chat);

/**
 * @route   DELETE /api/ai/chat/history
 * @desc    Clear chat history
 * @access  Private
 */
router.delete('/chat/history', verifyToken, aiController.clearChatHistory);

/**
 * @route   GET /api/ai/recommendations/study/:studentId
 * @desc    Get AI-powered study recommendations
 * @access  Private (Student can only access their own, teachers/admins can access all)
 */
router.get(
  '/recommendations/study/:studentId',
  verifyToken,
  aiController.getStudyRecommendations
);

/**
 * @route   GET /api/ai/predict/performance/:studentId
 * @desc    Predict student performance trend
 * @access  Private
 */
router.get(
  '/predict/performance/:studentId',
  verifyToken,
  aiController.predictPerformance
);

/**
 * @route   POST /api/ai/recommendations/courses
 * @desc    Get AI-powered course recommendations
 * @access  Private (Students only)
 */
router.post(
  '/recommendations/courses',
  verifyToken,
  aiController.getCourseRecommendations
);

/**
 * @route   POST /api/ai/report/summary
 * @desc    Generate AI report summary
 * @access  Private (Teachers and Admins only)
 */
router.post(
  '/report/summary',
  verifyToken,
  checkRole('teacher', 'admin'),
  aiController.generateReportSummary
);

module.exports = router;
