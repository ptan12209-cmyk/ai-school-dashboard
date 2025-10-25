const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, dashboardController.getDashboardStats);

module.exports = router;
