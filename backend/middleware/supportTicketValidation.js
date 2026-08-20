const { body, param, validationResult } = require("express-validator");


// ==================================================
// COMMON VALIDATION ERROR HANDLER
// ==================================================

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};


// ==================================================
// CREATE SUPPORT TICKET
// ==================================================

const validateSupportTicket = [

  // ----------------------------------------------
  // Company
  // ----------------------------------------------

  body("companyId")
    .optional()
    .custom((value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return true;
      }

      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        throw new Error("Company ID must be a positive integer");
      }

      return true;
    }),


  // ----------------------------------------------
  // Employee
  // ----------------------------------------------

  body("employeeId")
    .optional()
    .custom((value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return true;
      }

      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        throw new Error("Employee ID must be a positive integer");
      }

      return true;
    }),


  // ----------------------------------------------
  // Title
  // ----------------------------------------------

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Ticket title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Ticket title must be between 3 and 200 characters"
    ),


  // ----------------------------------------------
  // Description
  // ----------------------------------------------

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Ticket description is required")
    .isLength({ min: 5, max: 5000 })
    .withMessage(
      "Ticket description must be between 5 and 5000 characters"
    ),


  // ----------------------------------------------
  // Priority
  // ----------------------------------------------

  body("priority")
    .optional()
    .isIn([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT"
    ])
    .withMessage(
      "Priority must be LOW, MEDIUM, HIGH, or URGENT"
    ),


  handleValidationErrors
];


// ==================================================
// UPDATE SUPPORT TICKET
// ==================================================

const validateSupportTicketUpdate = [

  // ----------------------------------------------
  // Title
  // ----------------------------------------------

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Ticket title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Ticket title must be between 3 and 200 characters"
    ),


  // ----------------------------------------------
  // Description
  // ----------------------------------------------

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Ticket description is required")
    .isLength({ min: 5, max: 5000 })
    .withMessage(
      "Ticket description must be between 5 and 5000 characters"
    ),


  // ----------------------------------------------
  // Priority
  // ----------------------------------------------

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT"
    ])
    .withMessage(
      "Priority must be LOW, MEDIUM, HIGH, or URGENT"
    ),


  // ----------------------------------------------
  // Status
  // ----------------------------------------------

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED"
    ])
    .withMessage(
      "Invalid support ticket status"
    ),


  // ----------------------------------------------
  // Employee
  // ----------------------------------------------

  body("employeeId")
    .optional()
    .custom((value) => {

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return true;
      }

      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        throw new Error(
          "Employee ID must be a positive integer"
        );
      }

      return true;
    }),


  handleValidationErrors
];


// ==================================================
// ASSIGN SUPPORT TICKET
// ==================================================

const validateAssignSupportTicket = [

  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required")
    .isInt({ min: 1 })
    .withMessage(
      "Employee ID must be a positive integer"
    ),


  handleValidationErrors
];


// ==================================================
// CHANGE SUPPORT TICKET STATUS
// ==================================================

const validateSupportTicketStatus = [

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED"
    ])
    .withMessage(
      "Invalid support ticket status"
    ),


  handleValidationErrors
];


// ==================================================
// TICKET ID VALIDATION
// ==================================================

const validateSupportTicketId = [

  param("id")
    .isInt({ min: 1 })
    .withMessage(
      "Invalid support ticket ID"
    ),


  handleValidationErrors
];


// ==================================================
// EXPORT
// ==================================================

module.exports = {
  validateSupportTicket,
  validateSupportTicketUpdate,
  validateAssignSupportTicket,
  validateSupportTicketStatus,
  validateSupportTicketId
};