const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

// Registration now requires an existing logged-in Super Admin.
// (If you have no Super Admin account yet, use backend/scripts/createFirstAdmin.js once,
// then this route locks down immediately after.)
router.post("/register", authMiddleware, superAdminMiddleware, register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;