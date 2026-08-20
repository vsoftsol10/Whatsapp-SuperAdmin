// const express = require("express");

// const router = express.Router();

// const {
//  getSupportTicketNotes,
//  createSupportTicketNote
// } = require("../controllers/supportTicketNoteController");



// router.get(
//  "/:ticketId/notes",
//  getSupportTicketNotes
// );



// router.post(
//  "/:ticketId/notes",
//  createSupportTicketNote
// );



// module.exports = router;

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getSupportTicketNotes,
  createSupportTicketNote
} = require("../controllers/supportTicketNoteController");


router.get(
  "/:ticketId/notes",
  authMiddleware,
  getSupportTicketNotes
);


router.post(
  "/:ticketId/notes",
  authMiddleware,
  createSupportTicketNote
);


module.exports = router;