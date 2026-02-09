const express = require('express');
const router = express.Router();
const { handleChatbotQuery } = require('../controllers/aiController');

// @route   POST api/ai/chatbot
// @desc    Xử lý truy vấn từ chatbot AI
// @access  Private (Cần xác thực)
router.post('/chatbot', handleChatbotQuery);

module.exports = router;
