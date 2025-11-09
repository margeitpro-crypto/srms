const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass
} = require('../controllers/student.controller');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateStudent } = require('../middleware/validation');
const { body, param, query } = require('express-validator');

const router = express.Router();

// GET /api/students - Get all students (accessible to all authenticated users)
router.get('/', authenticateToken, getAllStudents);

// GET /api/students/by-class - Get students by class (accessible to all authenticated users)
router.get(
  '/by-class',
  authenticateToken,
  [
    query('class').notEmpty().withMessage('Class is required'),
    query('section').optional().trim(),
    query('schoolId').optional().isInt({ min: 1 })
  ],
  getStudentsByClass
);

// GET /api/students/:id - Get student by ID (accessible to all authenticated users)
router.get(
  '/:id',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  getStudentById
);

// POST /api/students - Create new student (restricted to admins and school staff)
router.post(
  '/',
  authenticateToken,
  authorize('school_admin', 'district_admin', 'super_admin'),
  validateStudent,
  createStudent
);

// PUT /api/students/:id - Update student (restricted to admins and school staff)
router.put(
  '/:id',
  authenticateToken,
  authorize('school_admin', 'district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('rollNo').optional().trim().notEmpty(),
    body('class').optional().trim().notEmpty(),
    body('section').optional().trim().notEmpty(),
    body('schoolId').optional().isInt({ min: 1 })
  ],
  updateStudent
);

// DELETE /api/students/:id - Delete student (restricted to admins)
router.delete(
  '/:id',
  authenticateToken,
  authorize('school_admin', 'district_admin', 'super_admin'),
  param('id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  deleteStudent
);

module.exports = router;