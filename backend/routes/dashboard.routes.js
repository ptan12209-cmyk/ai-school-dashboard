/**
 * Dashboard Routes
 * ==================
 * Routes for aggregating data for the main dashboard.
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// All dashboard routes require authentication
router.use(verifyToken);

// Health check for the dashboard router
router.get('/health', (req, res) => res.status(200).json({ status: 'ok', scope: 'dashboard' }));

const createNotImplementedHandler = (endpoint) => (req, res) => {
    try {
        return res.status(501).json({ status: 'not_implemented', endpoint });
    } catch (e) {
        return res.status(500).json({ error: 'internal_error', detail: String(e) });
    }
};

router.get('/stats', createNotImplementedHandler('GET /dashboard/stats'));
router.get('/activities', createNotImplementedHandler('GET /dashboard/activities'));
router.get('/attendance', createNotImplementedHandler('GET /dashboard/attendance'));
router.get('/grades', createNotImplementedHandler('GET /dashboard/grades'));
router.get('/students/:studentId/performance', createNotImplementedHandler('GET /dashboard/students/:studentId/performance'));
router.get('/teachers/:teacherId/performance', createNotImplementedHandler('GET /dashboard/teachers/:teacherId/performance'));
router.get('/classes/:classId/performance', createNotImplementedHandler('GET /dashboard/classes/:classId/performance'));
router.get('/ai-predictions', createNotImplementedHandler('GET /dashboard/ai-predictions'));
router.get('/notifications', createNotImplementedHandler('GET /dashboard/notifications'));
router.put('/notifications/:notificationId/read', createNotImplementedHandler('PUT /dashboard/notifications/:notificationId/read'));
router.get('/quick-stats', createNotImplementedHandler('GET /dashboard/quick-stats'));

module.exports = router;

