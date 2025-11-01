/**
 * AI Controller
 * =============
 * Handles AI-powered features (chatbot, predictions, etc.)
 */

const { catchAsync, ValidationError } = require('../middleware/errorHandler');
const { openaiConfig, aiFeatures } = require('../config/ai');

/**
 * @route   POST /api/ai/chat
 * @desc    AI Chatbot - Send message and get response
 * @access  Private
 */
exports.chat = catchAsync(async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    throw new ValidationError('Message is required');
  }

  // Check if chatbot is enabled
  if (!aiFeatures.chatbot.enabled) {
    return res.status(503).json({
      success: false,
      message: 'AI Chatbot is currently disabled. Please set AI_CHATBOT_ENABLED=true and provide OPENAI_API_KEY in .env file.'
    });
  }

  // TODO: Implement OpenAI API call
  // For now, return a mock response
  const mockResponse = {
    role: 'assistant',
    content: `Xin chào! Tôi là AI Assistant của hệ thống quản lý trường học. Bạn hỏi: "${message}".

Hiện tại tính năng AI chatbot đang ở chế độ demo. Để kích hoạt đầy đủ, vui lòng:
1. Thiết lập OPENAI_API_KEY trong file .env
2. Bật AI_CHATBOT_ENABLED=true

Tôi có thể giúp gì cho bạn về:
- Thông tin học sinh và giáo viên
- Điểm số và báo cáo
- Lịch học và điểm danh
- Thông báo và sự kiện`,
    timestamp: new Date()
  };

  res.json({
    success: true,
    data: {
      response: mockResponse,
      conversationId: `conv_${Date.now()}`,
      model: openaiConfig.model
    }
  });
});

/**
 * @route   POST /api/ai/predict-grade
 * @desc    Predict student's final grade
 * @access  Private
 */
exports.predictGrade = catchAsync(async (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    throw new ValidationError('Student ID and Course ID are required');
  }

  // Check if prediction is enabled
  if (!aiFeatures.gradePrediction.enabled) {
    return res.status(503).json({
      success: false,
      message: 'Grade prediction is currently disabled. Enable AI_GRADE_PREDICTION_ENABLED in .env'
    });
  }

  // TODO: Implement ML prediction
  // Mock prediction for now
  const mockPrediction = {
    studentId,
    courseId,
    predictedGrade: Math.floor(Math.random() * 30 + 70), // 70-100
    confidence: 0.85,
    factors: [
      { name: 'Attendance Rate', impact: 'positive', weight: 0.3 },
      { name: 'Quiz Scores', impact: 'positive', weight: 0.25 },
      { name: 'Assignment Completion', impact: 'neutral', weight: 0.2 },
      { name: 'Previous Performance', impact: 'positive', weight: 0.25 }
    ],
    recommendation: 'Student is performing well. Continue current study pattern.'
  };

  res.json({
    success: true,
    data: mockPrediction
  });
});

/**
 * @route   POST /api/ai/detect-risk
 * @desc    Detect at-risk students
 * @access  Private (Teacher/Admin)
 */
exports.detectRisk = catchAsync(async (req, res) => {
  const { studentId, classId } = req.body;

  // Check if risk detection is enabled
  if (!aiFeatures.riskDetection.enabled) {
    return res.status(503).json({
      success: false,
      message: 'Risk detection is currently disabled'
    });
  }

  // TODO: Implement ML risk detection
  // Mock response
  const mockRisk = {
    studentId,
    riskLevel: 'low', // low, medium, high
    riskScore: 0.23,
    factors: [
      { factor: 'Attendance', status: 'good', value: '95%' },
      { factor: 'Grade Trend', status: 'stable', value: '+2%' },
      { factor: 'Assignment Completion', status: 'good', value: '90%' }
    ],
    recommendations: [
      'No immediate action required',
      'Continue monitoring attendance'
    ]
  };

  res.json({
    success: true,
    data: mockRisk
  });
});

/**
 * @route   POST /api/ai/generate-report
 * @desc    Generate AI-powered report
 * @access  Private
 */
exports.generateReport = catchAsync(async (req, res) => {
  const { studentId, reportType = 'summary', period } = req.body;

  if (!studentId) {
    throw new ValidationError('Student ID is required');
  }

  // Check if report generation is enabled
  if (!aiFeatures.reportGeneration.enabled) {
    return res.status(503).json({
      success: false,
      message: 'AI report generation is currently disabled'
    });
  }

  // TODO: Implement OpenAI report generation
  // Mock report
  const mockReport = {
    studentId,
    reportType,
    period: period || 'Current Semester',
    generatedAt: new Date(),
    summary: `Học sinh đang có xu hướng học tập tích cực với điểm trung bình đạt mức khá. Tỷ lệ tham gia lớp học cao và hoàn thành bài tập đầy đủ.`,
    details: {
      academicPerformance: 'Khá',
      attendance: '95%',
      participationLevel: 'Cao',
      areasOfStrength: ['Toán học', 'Khoa học'],
      areasForImprovement: ['Tiếng Anh']
    },
    recommendations: [
      'Tiếp tục duy trì tỷ lệ tham gia cao',
      'Tăng cường luyện tập Tiếng Anh'
    ]
  };

  res.json({
    success: true,
    data: mockReport
  });
});

/**
 * @route   GET /api/ai/status
 * @desc    Get AI service status
 * @access  Private
 */
exports.getStatus = catchAsync(async (req, res) => {
  const status = {
    chatbot: {
      enabled: aiFeatures.chatbot.enabled,
      configured: !!openaiConfig.apiKey,
      model: openaiConfig.model
    },
    gradePrediction: {
      enabled: aiFeatures.gradePrediction.enabled,
      configured: true
    },
    riskDetection: {
      enabled: aiFeatures.riskDetection.enabled,
      configured: true
    },
    reportGeneration: {
      enabled: aiFeatures.reportGeneration.enabled,
      configured: !!openaiConfig.apiKey
    }
  };

  res.json({
    success: true,
    data: status
  });
});
