const express = require("express");

const router = express.Router();

const {
  createBackup,
  getBackups,
  downloadBackup,
  deleteBackup,

} = require("../controllers/superAdminBackupController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

// Create backup
router.post(
  "/",
  authMiddleware,
  superAdminMiddleware,
  createBackup
);

// Get backup history
router.get(
  "/",
  authMiddleware,
  superAdminMiddleware,
  getBackups
);

// Download backup

router.get(
  "/:id/download",
  authMiddleware,
  superAdminMiddleware,
  downloadBackup
);

// Delete backup
router.delete(
  "/:id",
  authMiddleware,
  superAdminMiddleware,
  deleteBackup
);

module.exports = router;