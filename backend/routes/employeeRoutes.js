
const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  changeEmployeeStatus,
  deleteEmployee
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const router = express.Router();

// Only Super Admin can manage employees
router.use(authMiddleware, superAdminMiddleware);

router.post("/", createEmployee);

router.get("/", getEmployees);

router.put("/:employeeId", updateEmployee);


router.get("/:employeeId", getEmployeeById);

router.patch("/:employeeId/status", changeEmployeeStatus);

router.delete("/:employeeId", deleteEmployee);

module.exports = router;

