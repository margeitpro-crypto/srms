const express = require('express');
const {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolStats,
  getMySchool
} = require('../controllers/school.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateSchool } = require('../middleware/validation');
const { body, param } = require('express-validator');

const router = express.Router();

// GET /api/schools - Get all schools
router.get('/', authenticateToken, getAllSchools);

// GET /api/schools/:id - Get school by ID
router.get(
  '/:id',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid school ID is required'),
  getSchoolById
);

// GET /api/schools/:id/stats - Get school statistics
router.get(
  '/:id/stats',
  authenticateToken,
  authorize('school_admin', 'district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid school ID is required'),
  getSchoolStats
);

// GET /api/schools/my-school - Get current user's school
router.get(
  '/my-school',
  authenticateToken,
  authorize('school_admin'),
  getMySchool
);

// POST /api/schools - Create new school
router.post(
  '/',
  authenticateToken,
  authorize('district_admin', 'super_admin'),
  validateSchool,
  createSchool
);

// PUT /api/schools/:id - Update school
router.put(
  '/:id',
  authenticateToken,
  authorize('district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid school ID is required'),
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('code').optional().trim().isLength({ min: 2 }),
    body('address').optional().trim().isLength({ min: 5 })
  ],
  updateSchool
);

// DELETE /api/schools/:id - Delete school
router.delete(
  '/:id',
  authenticateToken,
  authorize('super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid school ID is required'),
  deleteSchool
);

module.exports = router;
