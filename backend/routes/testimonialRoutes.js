const express = require("express");

const {
  getTestimonials,
  getPublishedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();

// Super Admin
router.get("/", getTestimonials);
router.post("/", createTestimonial);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

// Public Landing Page
router.get("/public", getPublishedTestimonials);

module.exports = router;