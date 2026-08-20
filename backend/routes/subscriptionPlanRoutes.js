const express = require("express");

const {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} = require("../controllers/subscriptionPlanController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

// Only Super Admin can manage subscription plans
router.use(authMiddleware, superAdminMiddleware);

router.post("/", createSubscriptionPlan);

router.get("/", getSubscriptionPlans);

router.get("/:id", getSubscriptionPlanById);

router.put("/:id", updateSubscriptionPlan);

router.delete("/:id", deleteSubscriptionPlan);

module.exports = router;