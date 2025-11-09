const express = require("express");
const {
  getAllMarks,
  createMarks,
  createBulkMarks,
  updateMarks,
  deleteMarks,
  getStudentReport,
  getMarksByClassSection,
} = require("../controllers/marks.controller");
const { authenticateToken } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { validateMarks } = require("../middleware/validation");
const { body, param, query } = require("express-validator");

const router = express.Router();

// GET /api/marks - Get all marks with filtering
router.get("/", authenticateToken, getAllMarks);

// GET /api/marks/class-section - Get marks by class and section
router.get(
  "/class-section",
  authenticateToken,
  [
    query("class").notEmpty().withMessage("Class is required"),
    query("section").notEmpty().withMessage("Section is required"),
    query("subjectId").optional().isInt({ min: 1 }),
  ],
  getMarksByClassSection,
);

// GET /api/marks/student/:studentId - Get student report
router.get(
  "/student/:studentId",
  authenticateToken,
  param("studentId")
    .isInt({ min: 1 })
    .withMessage("Valid student ID is required"),
  getStudentReport,
);

// POST /api/marks - Create new marks entry
router.post(
  "/",
  authenticateToken,
  authorize("teacher", "school_admin", "district_admin", "super_admin"),
  validateMarks,
  createMarks,
);

// POST /api/marks/bulk - Create multiple marks entries
router.post(
  "/bulk",
  authenticateToken,
  authorize("teacher", "school_admin", "district_admin", "super_admin"),
  [
    body("marks").isArray({ min: 1 }).withMessage("Marks array is required"),
    body("marks.*.studentId")
      .isInt({ min: 1 })
      .withMessage("Valid student ID is required"),
    body("marks.*.subjectId")
      .isInt({ min: 1 })
      .withMessage("Valid subject ID is required"),
    body("marks.*.marks")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Marks must be between 0 and 100"),
  ],
  createBulkMarks,
);

// PUT /api/marks/:id - Update marks
router.put(
  "/:id",
  authenticateToken,
  authorize("teacher", "school_admin", "district_admin", "super_admin"),
  param("id").isInt({ min: 1 }).withMessage("Valid marks ID is required"),
  [
    body("marks")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Marks must be between 0 and 100"),
  ],
  updateMarks,
);

// DELETE /api/marks/:id - Delete marks
router.delete(
  "/:id",
  authenticateToken,
  authorize("school_admin", "district_admin", "super_admin"),
  param("id").isInt({ min: 1 }).withMessage("Valid marks ID is required"),
  deleteMarks,
);

module.exports = router;
