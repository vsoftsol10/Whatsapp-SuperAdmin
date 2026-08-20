const express = require("express");
const { createCompany, getCompanies,getCompanyById,updateCompany,
    changeCompanyStatus,deleteCompany,getCompanyStats
 } = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

// All company management routes require a logged-in Super Admin
router.use(authMiddleware, superAdminMiddleware);

router.post("/", createCompany);
router.get("/", getCompanies);
router.get("/stats", getCompanyStats);
router.get("/:companyId", getCompanyById);
router.put("/:companyId", updateCompany);
router.patch("/:companyId/status", changeCompanyStatus);
router.delete("/:companyId", deleteCompany);

module.exports = router;