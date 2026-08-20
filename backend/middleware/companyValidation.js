const { body, validationResult } = require("express-validator");

const validateCompany = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("ownerName")
    .trim()
    .notEmpty()
    .withMessage("Owner name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Owner name must be between 2 and 100 characters")
    .matches(/^[A-Za-z\s.'-]+$/)
    .withMessage("Owner name contains invalid characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  // Country code
  body("countryCode")
    .trim()
    .notEmpty()
    .withMessage("Country code is required")
    .matches(/^\+\d{1,4}$/)
    .withMessage("Invalid country code"),

  // Phone number WITHOUT country code
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

  body("plan")
    .trim()
    .notEmpty()
    .withMessage("Plan is required")
    .isIn(["Trial", "Starter", "Professional", "Enterprise"])
    .withMessage("Invalid subscription plan"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "EXPIRED"])
    .withMessage("Invalid company status"),

  // ==========================================
  // ERROR HANDLER
  // ==========================================

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      console.log("========== COMPANY VALIDATION ==========");
      console.log("BODY:", req.body);
      console.log("ERRORS:", errors.array());
      console.log("=========================================");

      return res.status(400).json({
        success: false,
        message: "Please correct the highlighted fields",
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    next();
  }
];

module.exports = {
  validateCompany
};