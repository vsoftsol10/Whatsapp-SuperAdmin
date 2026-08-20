const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getUpgradeRequests,
  getUpgradeRequestById,
  approveUpgradeRequest,
  rejectUpgradeRequest,
} = require("../controllers/superAdminUpgradeRequestController");

const router = express.Router();

// ==========================================
// GET ALL UPGRADE REQUESTS
// ==========================================
router.get(
  "/",
  authMiddleware,
  getUpgradeRequests
);

// ==========================================
// GET SINGLE UPGRADE REQUEST
// ==========================================
router.get(
  "/:id",
  authMiddleware,
  getUpgradeRequestById
);

// ==========================================
// APPROVE UPGRADE REQUEST
// ==========================================
router.patch(
  "/:id/approve",
  authMiddleware,
  approveUpgradeRequest
);

// ==========================================
// REJECT UPGRADE REQUEST
// ==========================================
router.patch(
  "/:id/reject",
  authMiddleware,
  rejectUpgradeRequest
);

module.exports = router;