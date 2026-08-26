const express = require("express");

const {
  getAuditLogs,
  getAuditLogById,
  deleteAuditLog,
} = require("../controllers/auditLogController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

// All audit log routes require Super Admin
router.use(
  authMiddleware,
  superAdminMiddleware
);

// Get all audit logs
router.get("/", getAuditLogs);

// Get single audit log
router.get("/:id", getAuditLogById);

// Delete audit log
router.delete("/:id", deleteAuditLog);

module.exports = router;