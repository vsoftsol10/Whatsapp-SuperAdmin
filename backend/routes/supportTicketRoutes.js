const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  assignSupportTicket,
  changeSupportTicketStatus,
  deleteSupportTicket
} = require("../controllers/supportTicketController");


// Create Ticket
router.post("/", authMiddleware, createSupportTicket);


// Get All Tickets
router.get("/", authMiddleware, getSupportTickets);


// Get Single Ticket
router.get("/:id", authMiddleware, getSupportTicketById);


// Update Ticket
router.put("/:id", authMiddleware, updateSupportTicket);


// Assign Ticket to Employee
router.patch("/:id/assign", authMiddleware, assignSupportTicket);


// Change Ticket Status
router.patch("/:id/status", authMiddleware, changeSupportTicketStatus);


// Delete Ticket
router.delete("/:id", authMiddleware, deleteSupportTicket);

module.exports = router;