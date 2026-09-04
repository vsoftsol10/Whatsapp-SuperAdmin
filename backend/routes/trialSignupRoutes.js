const express = require("express");

const {
  createTrialCompany,
} = require("../controllers/trialSignupController");

const router = express.Router();

// Public Free Trial Signup
// No authMiddleware here because this is used by the Landing Page.
router.post("/", createTrialCompany);

module.exports = router;