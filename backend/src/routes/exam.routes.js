const express = require('express');
const {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  getExamResults,
  processExamResults,
  publishResults
} = require('../controllers/exam.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// GET /api/exams - Get all exams
router.get(
  '/',
  authenticateToken,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('schoolId').optional().isInt({ min: 1 }),
    query('examType').optional().isIn(['UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT']),
    query('status').optional().isIn(['active', 'published']),
    query('search').optional().trim()
  ],
  handleValidationErrors,
  getAllExams
);

// GET /api/exams/:id - Get exam by ID
router.get(
  '/:id',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
  handleValidationErrors,
  getExamById
);

// GET /api/exams/:id/results - Get exam results
router.get(
  '/:id/results',
  authenticateToken,
  [
    param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'PUBLISHED', 'CANCELLED']),
    query('class').optional().trim(),
    query('section').optional().trim()
  ],
  handleValidationErrors,
  getExamResults
);

// POST /api/exams - Create new exam
router.post(
  '/',
  authenticateToken,
  authorize('super_admin', 'district_admin', 'school_admin'),
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Exam name must be at least 2 characters'),
    body('code')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Exam code must be at least 2 characters'),
    body('description').optional().trim(),
    body('examType')
      .isIn(['UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT'])
      .withMessage('Valid exam type is required'),
    body('startDate')
      .isISO8601()
      .withMessage('Valid start date is required'),
    body('endDate')
      .isISO8601()
      .withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('schoolId').optional().isInt({ min: 1 }),
    body('subjects').optional().isArray(),
    body('subjects.*.subjectId').isInt({ min: 1 }),
    body('subjects.*.maxMarks').optional().isFloat({ min: 0 }),
    body('subjects.*.minMarks').optional().isFloat({ min: 0 }),
    body('subjects.*.examDate').optional().isISO8601(),
    body('subjects.*.duration').optional().isInt({ min: 1 }),
    body('subjects.*.instructions').optional().trim()
  ],
  handleValidationErrors,
  createExam
);

// PUT /api/exams/:id - Update exam
router.put(
  '/:id',
  authenticateToken,
  authorize('super_admin', 'district_admin', 'school_admin'),
  [
    param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Exam name must be at least 2 characters'),
    body('description').optional().trim(),
    body('examType')
      .optional()
      .isIn(['UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT']),
    body('startDate').optional().isISO8601(),
    body('endDate')
      .optional()
      .isISO8601()
      .custom((value, { req }) => {
        if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('isActive').optional().isBoolean(),
    body('subjects').optional().isArray(),
    body('subjects.*.subjectId').isInt({ min: 1 }),
    body('subjects.*.maxMarks').optional().isFloat({ min: 0 }),
    body('subjects.*.minMarks').optional().isFloat({ min: 0 }),
    body('subjects.*.examDate').optional().isISO8601(),
    body('subjects.*.duration').optional().isInt({ min: 1 }),
    body('subjects.*.instructions').optional().trim()
  ],
  handleValidationErrors,
  updateExam
);

// POST /api/exams/:id/publish - Publish exam
router.post(
  '/:id/publish',
  authenticateToken,
  authorize('super_admin', 'district_admin', 'school_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
  handleValidationErrors,
  publishExam
);

// POST /api/exams/:id/results/process - Process exam results
router.post(
  '/:id/results/process',
  authenticateToken,
  authorize('super_admin', 'district_admin', 'school_admin', 'teacher'),
  [
    param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
    body('results')
      .isArray({ min: 1 })
      .withMessage('Results array is required'),
    body('results.*.studentId')
      .isInt({ min: 1 })
      .withMessage('Valid student ID is required'),
    body('results.*.subjectResults')
      .isArray({ min: 1 })
      .withMessage('Subject results are required'),
    body('results.*.subjectResults.*.subjectId')
      .isInt({ min: 1 })
      .withMessage('Valid subject ID is required'),
    body('results.*.subjectResults.*.marks')
      .isFloat({ min: 0 })
      .withMessage('Valid marks are required'),
    body('results.*.subjectResults.*.maxMarks').optional().isFloat({ min: 0 }),
    body('results.*.subjectResults.*.isAbsent').optional().isBoolean(),
    body('results.*.subjectResults.*.remarks').optional().trim()
  ],
  handleValidationErrors,
  processExamResults
);

// POST /api/exams/:id/results/publish - Publish exam results
router.post(
  '/:id/results/publish',
  authenticateToken,
  authorize('super_admin', 'district_admin', 'school_admin'),
  [
    param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
    body('studentIds')
      .optional()
      .isArray()
      .withMessage('Student IDs must be an array'),
    body('studentIds.*').optional().isInt({ min: 1 })
  ],
  handleValidationErrors,
  publishResults
);

// DELETE /api/exams/:id - Delete exam
router.delete(
  '/:id',
  authenticateToken,
  authorize('super_admin', 'district_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid exam ID is required'),
  handleValidationErrors,
  deleteExam
);

module.exports = router;
