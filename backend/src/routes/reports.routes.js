const express = require("express");
const {
  getSummaryReport,
  getAnalytics,
  generateCertificate,
  getClassReport,
  getSubjectReport,
} = require("../controllers/reports.controller");
const { authenticateToken } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { query, param } = require("express-validator");

const router = express.Router();

// GET /api/reports/summary - Get summary report
router.get(
  "/summary",
  authenticateToken,
  [
    query("class").optional().trim(),
    query("section").optional().trim(),
    query("schoolId").optional().isInt({ min: 1 }),
  ],
  getSummaryReport,
);

// GET /api/reports/analytics - Get analytics data
router.get(
  "/analytics",
  authenticateToken,
  authorize("school_admin", "district_admin", "super_admin"),
  [
    query("timeRange")
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage("Time range must be between 1 and 365 days"),
  ],
  getAnalytics,
);

// GET /api/reports/class - Get class report
router.get(
  "/class",
  authenticateToken,
  [
    query("class").notEmpty().withMessage("Class is required"),
    query("section").optional().trim(),
  ],
  getClassReport,
);

// GET /api/reports/subject/:subjectId - Get subject report
router.get(
  "/subject/:subjectId",
  authenticateToken,
  [
    param("subjectId")
      .isInt({ min: 1 })
      .withMessage("Valid subject ID is required"),
    query("class").optional().trim(),
    query("section").optional().trim(),
  ],
  getSubjectReport,
);

// GET /api/reports/certificate/:studentId - Generate student certificate
router.get(
  "/certificate/:studentId",
  authenticateToken,
  param("studentId")
    .isInt({ min: 1 })
    .withMessage("Valid student ID is required"),
  generateCertificate,
);

module.exports = router;
