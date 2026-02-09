/**
 * Teacher Routes
 * ==============
 * Routes for teacher management (CRUD operations)
 * 
 * Week 3-4 Day 4
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const teacherController = require('../controllers/teacherController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/teachers/health
 * @desc    Health check for teacher routes
 * @access  Public
 */
router.get('/health', (req, res) => res.status(200).json({ status: 'ok', scope: 'teachers' }));

/**
 * Public routes (no authentication required)
 */

/**
 * @route   GET /api/teachers/departments/list
 * @desc    Get list of all departments
 * @access  Public
 * @note    MUST be before /:id route to avoid conflict
 */
router.get('/departments/list', teacherController.getDepartmentsList);

/**
 * @route   GET /api/teachers/departments
 * @desc    Get list of all departments (alias for /departments/list)
 * @access  Public
 * @note    Added for frontend compatibility
 */
router.get('/departments', teacherController.getDepartmentsList);

/**
 * @route   GET /api/teachers/subjects
 * @desc    Get list of all subjects taught by teachers
 * @access  Public
 * @note    Returns unique subjects from courses
 */
router.get('/subjects', teacherController.getSubjectsList);

/**
 * Protected routes (authentication required)
 */
router.use(verifyToken);

/**
 * @route   GET /api/teachers/stats
 * @desc    Get teacher statistics
 * @access  Admin only
 * @note    MUST be before /:id route to avoid treating 'stats' as an ID
 */
router.get('/stats',
  checkRole('admin'),
  teacherController.getTeacherStats
);

/**
 * @route   GET /api/teachers
 * @desc    Get all teachers (with pagination, filtering, search)
 * @access  Authenticated users (filtered by active status for non-admins)
 * @query   page, limit, department, search, sort
 */
router.get('/', teacherController.getAllTeachers);

/**
 * @route   POST /api/teachers
 * @desc    Create new teacher
 * @access  Admin only
 */
router.post('/',
  checkRole('admin'),
  [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
    
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('First name must be 1-100 characters'),
    
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Last name must be 1-100 characters'),
    
    body('department')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Department must be 1-100 characters'),
    
    body('phone')
      .optional()
      .matches(/^[0-9\s\-\+\(\)]*$/)
      .withMessage('Phone number contains invalid characters'),
    
    body('hireDate')
      .optional()
      .isISO8601()
      .withMessage('Hire date must be a valid date')
  ],
  validate,
  teacherController.createTeacher
);

/**
 * @route   GET /api/teachers/:id
 * @desc    Get teacher by ID
 * @access  Authenticated users
 */
router.get('/:id', teacherController.getTeacherById);

/**
 * @route   PUT /api/teachers/:id
 * @desc    Update teacher
 * @access  Admin or Self
 */
router.put('/:id',
  [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('First name must be 1-100 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Last name must be 1-100 characters'),
    
    body('department')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Department must be 1-100 characters'),
    
    body('phone')
      .optional()
      .matches(/^[0-9\s\-\+\(\)]*$/)
      .withMessage('Phone number contains invalid characters'),
    
    body('hireDate')
      .optional()
      .isISO8601()
      .withMessage('Hire date must be a valid date')
  ],
  validate,
  teacherController.updateTeacher
);

/**
 * @route   DELETE /api/teachers/:id
 * @desc    Delete teacher (soft delete by deactivating user)
 * @access  Admin only
 */
router.delete('/:id',
  checkRole('admin'),
  teacherController.deleteTeacher
);

/**
 * @route   GET /api/teachers/:id/courses
 * @desc    Get teacher's courses
 * @access  Authenticated users
 */
router.get('/:id/courses', teacherController.getTeacherCourses);

// --- ALIASES for /:teacherId and other missing routes ---

const createNotImplementedHandler = (endpoint) => (req, res) => {
    try {
        return res.status(501).json({ status: 'not_implemented', endpoint });
    } catch (e) {
        return res.status(500).json({ error: 'internal_error', detail: String(e) });
    }
};

// NOTE: The following aliases map :teacherId to the existing :id routes.
// This is for backward compatibility with the frontend.
// TODO: Unify frontend to use a consistent parameter name.

router.get('/:teacherId', (req, res, next) => {
    req.params.id = req.params.teacherId;
    return teacherController.getTeacherById(req, res, next);
});

// Note: This alias for PUT does not re-run the validation middleware.
// This is a temporary measure. The routes should be unified.
router.put('/:teacherId', (req, res, next) => {
    req.params.id = req.params.teacherId;
    return teacherController.updateTeacher(req, res, next);
});

router.delete('/:teacherId', (req, res, next) => {
    req.params.id = req.params.teacherId;
    return teacherController.deleteTeacher(req, res, next);
});

// Alias for courses (plural vs singular)
router.get('/:teacherId/courses', (req, res, next) => {
    req.params.id = req.params.teacherId;
    return teacherController.getTeacherCourses(req, res, next);
});

// --- NEW Teacher-specific routes ---
router.get('/:teacherId/achievements', createNotImplementedHandler('GET /teachers/:teacherId/achievements'));
router.post('/:teacherId/achievements', createNotImplementedHandler('POST /teachers/:teacherId/achievements'));
router.post('/:teacherId/archive', createNotImplementedHandler('POST /teachers/:teacherId/archive'));
router.post('/:teacherId/assign-class', createNotImplementedHandler('POST /teachers/:teacherId/assign-class'));
router.post('/:teacherId/assign-substitute', createNotImplementedHandler('POST /teachers/:teacherId/assign-substitute'));
router.post('/:teacherId/attendance', createNotImplementedHandler('POST /teachers/:teacherId/attendance'));
router.post('/:teacherId/avatar', createNotImplementedHandler('POST /teachers/:teacherId/avatar'));
router.get('/:teacherId/classes', createNotImplementedHandler('GET /teachers/:teacherId/classes'));
router.delete('/:teacherId/classes/:classId', createNotImplementedHandler('DELETE /teachers/:teacherId/classes/:classId'));
router.post('/:teacherId/evaluate', createNotImplementedHandler('POST /teachers/:teacherId/evaluate'));
router.get('/:teacherId/evaluations', createNotImplementedHandler('GET /teachers/:teacherId/evaluations'));
router.get('/:teacherId/id-card', createNotImplementedHandler('GET /teachers/:teacherId/id-card'));
router.get('/:teacherId/leaves', createNotImplementedHandler('GET /teachers/:teacherId/leaves'));
router.post('/:teacherId/leaves', createNotImplementedHandler('POST /teachers/:teacherId/leaves'));
router.post('/:teacherId/restore', createNotImplementedHandler('POST /teachers/:teacherId/restore'));
router.get('/:teacherId/salary', createNotImplementedHandler('GET /teachers/:teacherId/salary'));
router.post('/:teacherId/salary', createNotImplementedHandler('POST /teachers/:teacherId/salary'));
router.post('/:teacherId/send-email', createNotImplementedHandler('POST /teachers/:teacherId/send-email'));
router.post('/:teacherId/send-sms', createNotImplementedHandler('POST /teachers/:teacherId/send-sms'));
router.get('/:teacherId/stats', createNotImplementedHandler('GET /teachers/:teacherId/stats'));
router.get('/:teacherId/students', createNotImplementedHandler('GET /teachers/:teacherId/students'));
router.get('/:teacherId/substitute-suggestions', createNotImplementedHandler('GET /teachers/:teacherId/substitute-suggestions'));
router.get('/:teacherId/training', createNotImplementedHandler('GET /teachers/:teacherId/training'));
router.post('/:teacherId/training', createNotImplementedHandler('POST /teachers/:teacherId/training'));

module.exports = router;