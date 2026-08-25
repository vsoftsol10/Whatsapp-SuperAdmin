const express = require("express");

const {
  getAuditLogs
} = require("../controllers/auditLogController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

router.use(authMiddleware, superAdminMiddleware);

router.get("/", getAuditLogs);

module.exports = router;