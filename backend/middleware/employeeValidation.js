const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

// ==========================================
// CREATE EMPLOYEE VALIDATION
// ==========================================

const validateEmployee = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Employee name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Employee name must be between 2 and 100 characters")
    .matches(/^[A-Za-z\s.'-]+$/)
    .withMessage("Employee name contains invalid characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain exactly 10 digits"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),

  body("role")
    .optional()
    .isIn(["EMPLOYEE", "ADMIN"])
    .withMessage("Invalid employee role"),

  handleValidationErrors,
];


// ==========================================
// UPDATE EMPLOYEE VALIDATION
// ==========================================

const validateEmployeeUpdate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Employee name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Employee name must be between 2 and 100 characters")
    .matches(/^[A-Za-z\s.'-]+$/)
    .withMessage("Employee name contains invalid characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain exactly 10 digits"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),

  body("role")
    .notEmpty()
    .withMessage("Employee role is required")
    .isIn(["EMPLOYEE", "ADMIN"])
    .withMessage("Invalid employee role"),

  body("status")
    .notEmpty()
    .withMessage("Employee status is required")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Invalid employee status"),

  handleValidationErrors,
];


// ==========================================
// EMPLOYEE ID VALIDATION
// ==========================================

const validateEmployeeId = [
  param("employeeId")
    .trim()
    .matches(/^EMP\d{3,}$/)
    .withMessage("Invalid employee ID"),

  handleValidationErrors,
];


// ==========================================
// STATUS VALIDATION
// ==========================================

const validateEmployeeStatus = [
  body("status")
    .notEmpty()
    .withMessage("Employee status is required")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Invalid employee status"),

  handleValidationErrors,
];


module.exports = {
  validateEmployee,
  validateEmployeeUpdate,
  validateEmployeeId,
  validateEmployeeStatus,
};