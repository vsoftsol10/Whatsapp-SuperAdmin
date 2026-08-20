
const express = require("express");
const {
  sendSubscriptionReminder,
  getSubscriptionReminders
} = require("../controllers/subscriptionReminderController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

// Only Super Admin can send/view subscription reminders
router.use(authMiddleware, superAdminMiddleware);

router.post("/:subscriptionId/reminder", sendSubscriptionReminder);
router.get("/:subscriptionId/reminders", getSubscriptionReminders);

module.exports = router;

