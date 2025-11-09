const { body, param, query, validationResult } = require("express-validator");
const { Role } = require("@prisma/client");
const { ValidationError } = require("../utils/errors");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    const validationError = new ValidationError(
      "Validation failed",
      errorMessages,
    );
    return next(validationError);
  }
  next();
};

const validateUser = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character",
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("role").isIn(Object.values(Role)).withMessage("Invalid role specified"),
  body("phone")
    .optional()
    .isString()
    .withMessage("Please provide a valid phone number"),
  handleValidationErrors,
];

const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateForgotPassword = [
  body("email").isEmail().normalizeEmail(),
  handleValidationErrors,
];

const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
  handleValidationErrors,
];

const validateRequestAccess = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail(),
  body("organization").optional().isString(),
  body("message").optional().isString(),
  handleValidationErrors,
];

const validateMarks = [
  body("studentId").isInt({ min: 1 }),
  body("subjectId").isInt({ min: 1 }),
  body("marks").isFloat({ min: 0, max: 100 }),
  handleValidationErrors,
];

const validateStudent = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("rollNo")
    .trim()
    .notEmpty()
    .withMessage("Roll number is required"),
  body("class")
    .trim()
    .notEmpty()
    .withMessage("Class is required"),
  body("section")
    .trim()
    .notEmpty()
    .withMessage("Section is required"),
  body("schoolId")
    .isInt({ min: 1 })
    .withMessage("Valid school ID is required"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .optional()
    .isIn(["MALE", "FEMALE", "OTHER"])
    .withMessage("Gender must be MALE, FEMALE, or OTHER"),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must not exceed 500 characters"),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("parentName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Parent name must not exceed 100 characters"),
  body("parentPhone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Parent phone must not exceed 20 characters"),
  body("parentEmail")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid parent email"),
  handleValidationErrors,
];

const validateSchool = [
  body("name").trim().isLength({ min: 2 }),
  body("code").trim().isLength({ min: 2 }),
  body("address").trim().isLength({ min: 5 }),
  handleValidationErrors,
];

const validateSubject = [
  body("name").trim().isLength({ min: 2 }),
  body("code").trim().isLength({ min: 2 }),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "name", "email"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either asc or desc"),
  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
  handleValidationErrors,
];

// File upload validation
const validateFileUpload = [
  body("maxSize")
    .optional()
    .isInt({ min: 1024, max: 10 * 1024 * 1024 }) // 1KB to 10MB
    .withMessage("Maximum file size must be between 1KB and 10MB"),
  body("allowedTypes")
    .optional()
    .isArray()
    .withMessage("Allowed types must be an array")
    .custom((types) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      return types.every((type) => validTypes.includes(type));
    })
    .withMessage("Invalid file type"),
  handleValidationErrors,
];

// Date range validation
const validateDateRange = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date")
    .custom((value, { req }) => {
      if (
        req.query.startDate &&
        new Date(value) < new Date(req.query.startDate)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  validateUser,
  validateLogin,
  validateMarks,
  validateStudent,
  validateSchool,
  validateSubject,
  handleValidationErrors,
  validateForgotPassword,
  validateResetPassword,
  validateRequestAccess,
  validatePagination,
  validateFileUpload,
  validateDateRange,
};