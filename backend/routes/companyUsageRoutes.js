const express = require("express");

const {
  getCompanyUsageList,
  getCompanyUsageDetail,
} = require("../controllers/companyUsageController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

// Same protection as the Companies routes: logged-in Super Admin / Employee
router.use(authMiddleware, superAdminMiddleware);

router.get("/", getCompanyUsageList);
router.get("/:id", getCompanyUsageDetail);

module.exports = router;