const express = require("express");
const router = express.Router();

const {
  getSubscriptions,
  getSubscriptionStats
} = require("../controllers/subscriptionController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

// Only Super Admin can view subscriptions
router.use(authMiddleware, superAdminMiddleware);

// GET SUBSCRIPTION STATS
router.get("/stats", getSubscriptionStats);


// GET ALL SUBSCRIPTIONS
router.get("/", getSubscriptions);


module.exports = router;