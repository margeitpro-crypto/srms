const express = require('express');
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats
} = require('../controllers/subject.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateSubject } = require('../middleware/validation');
const { body, param } = require('express-validator');

const router = express.Router();

// GET /api/subjects - Get all subjects
router.get('/', authenticateToken, getAllSubjects);

// GET /api/subjects/:id - Get subject by ID
router.get(
  '/:id',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
  getSubjectById
);

// GET /api/subjects/:id/stats - Get subject statistics
router.get(
  '/:id/stats',
  authenticateToken,
  authorize('teacher', 'school_admin', 'district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
  getSubjectStats
);

// POST /api/subjects - Create new subject
router.post(
  '/',
  authenticateToken,
  authorize('school_admin', 'district_admin', 'super_admin'),
  validateSubject,
  createSubject
);

// PUT /api/subjects/:id - Update subject
router.put(
  '/:id',
  authenticateToken,
  authorize('school_admin', 'district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('code').optional().trim().isLength({ min: 2 })
  ],
  updateSubject
);

// DELETE /api/subjects/:id - Delete subject
router.delete(
  '/:id',
  authenticateToken,
  authorize('district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
  deleteSubject
);

module.exports = router;
