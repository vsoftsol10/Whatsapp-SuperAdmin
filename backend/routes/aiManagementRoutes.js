const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const c = require("../controllers/aiManagementController");

// AI settings include the API key and cost data: Super Admin only
// (employees are intentionally NOT allowed here).
const superAdminOnly = (req, res, next) => {
  if (req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Only Super Admin can manage AI settings.",
    });
  }
  next();
};

// Every call to the provider costs money -> keep the test endpoints throttled
const aiCallLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many tests. Please wait a minute." },
});

router.use(authMiddleware, superAdminOnly);

// Provider / model / instructions / limits
router.get("/config", c.getConfig);
router.patch("/config", c.updateConfig);
router.post("/config/test", aiCallLimiter, c.testConnection);

// Knowledge base
router.get("/docs", c.listDocs);
router.post("/docs", c.createDoc);
router.post("/docs/reindex", c.reindexAll);
router.post("/docs/test-chat", aiCallLimiter, c.testChat);
router.get("/docs/:id", c.getDoc);
router.patch("/docs/:id", c.updateDoc);
router.delete("/docs/:id", c.deleteDoc);

// Per-company enable / limits
router.get("/tenants", c.listTenants);
router.patch("/tenants/:companyId", c.updateTenant);

// Usage, cost, feedback
router.get("/usage", c.getUsage);
router.get("/unanswered", c.listUnanswered);

module.exports = router;