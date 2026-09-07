const express = require("express");

const router = express.Router();

const {
  getPayments,
  getPayment,
  getPaymentStats,
  createPayment,
  updatePaymentStatus,
  deletePayment,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

// Only Super Admin can manage payments
router.use(authMiddleware, superAdminMiddleware);


// GET PAYMENT STATS
router.get("/stats", getPaymentStats);

// GET ALL PAYMENTS
router.get("/", getPayments);



// GET SINGLE PAYMENT
router.get("/:id", getPayment);

// CREATE PAYMENT
router.post("/", createPayment);

// UPDATE PAYMENT STATUS
router.put("/:id", updatePaymentStatus);

// DELETE PAYMENT
router.delete("/:id", deletePayment);

module.exports = router;