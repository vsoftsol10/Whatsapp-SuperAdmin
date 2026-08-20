const { body, param, validationResult } = require("express-validator");


// ==========================================
// COMMON ERROR HANDLER
// ==========================================

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
// CREATE SUBSCRIPTION PLAN
// ==========================================

const validateSubscriptionPlan = [
  body("planName")
    .trim()
    .notEmpty()
    .withMessage("Plan name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Plan name must be between 2 and 50 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("durationDays")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("maxUsers")
    .notEmpty()
    .withMessage("Maximum users is required")
    .isInt({ min: 1 })
    .withMessage("Maximum users must be at least 1"),

  body("maxCustomers")
    .notEmpty()
    .withMessage("Maximum customers is required")
    .isInt({ min: 0 })
    .withMessage("Maximum customers cannot be negative"),

  body("maxCampaigns")
    .notEmpty()
    .withMessage("Maximum campaigns is required")
    .isInt({ min: 0 })
    .withMessage("Maximum campaigns cannot be negative"),

  body("maxTemplates")
    .notEmpty()
    .withMessage("Maximum templates is required")
    .isInt({ min: 0 })
    .withMessage("Maximum templates cannot be negative"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("isTrial")
    .optional()
    .isBoolean()
    .withMessage("isTrial must be true or false"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Invalid subscription plan status"),

  handleValidationErrors,
];


// ==========================================
// UPDATE SUBSCRIPTION PLAN
// ==========================================

const validateSubscriptionPlanUpdate = [
  body("planName")
    .trim()
    .notEmpty()
    .withMessage("Plan name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Plan name must be between 2 and 50 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("durationDays")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1 day"),

  body("maxUsers")
    .notEmpty()
    .withMessage("Maximum users is required")
    .isInt({ min: 1 })
    .withMessage("Maximum users must be at least 1"),

  body("maxCustomers")
    .notEmpty()
    .withMessage("Maximum customers is required")
    .isInt({ min: 0 })
    .withMessage("Maximum customers cannot be negative"),

  body("maxCampaigns")
    .notEmpty()
    .withMessage("Maximum campaigns is required")
    .isInt({ min: 0 })
    .withMessage("Maximum campaigns cannot be negative"),

  body("maxTemplates")
    .notEmpty()
    .withMessage("Maximum templates is required")
    .isInt({ min: 0 })
    .withMessage("Maximum templates cannot be negative"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("isTrial")
    .optional()
    .isBoolean()
    .withMessage("isTrial must be true or false"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Invalid subscription plan status"),

  handleValidationErrors,
];


// ==========================================
// PLAN ID VALIDATION
// ==========================================

const validateSubscriptionPlanId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid subscription plan ID"),

  handleValidationErrors,
];


module.exports = {
  validateSubscriptionPlan,
  validateSubscriptionPlanUpdate,
  validateSubscriptionPlanId,
};