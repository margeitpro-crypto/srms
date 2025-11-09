const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { validateUser } = require("../middleware/validation");
const { body, param } = require("express-validator");

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get(
  "/",
  authenticateToken,
  authorize("super_admin", "district_admin"),
  getAllUsers,
);

// GET /api/users/:id - Get user by ID
router.get(
  "/:id",
  authenticateToken,
  param("id").isInt({ min: 1 }).withMessage("Valid user ID is required"),
  getUserById,
);

// POST /api/users - Create new user (admin only)
router.post(
  "/",
  authenticateToken,
  authorize("super_admin", "district_admin"),
  validateUser,
  createUser,
);

// PUT /api/users/:id - Update user (admin only)
router.put(
  "/:id",
  authenticateToken,
  authorize("super_admin", "district_admin"),
  param("id").isInt({ min: 1 }).withMessage("Valid user ID is required"),
  [
    body("email").optional().isEmail().normalizeEmail(),
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("role")
      .optional()
      .isIn([
        "super_admin",
        "district_admin",
        "school_admin",
        "teacher",
        "student",
        "parent",
      ]),
  ],
  updateUser,
);

// DELETE /api/users/:id - Delete user (super admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorize("super_admin"),
  param("id").isInt({ min: 1 }).withMessage("Valid user ID is required"),
  deleteUser,
);

module.exports = router;
