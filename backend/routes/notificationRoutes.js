const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

router.patch("/:id", authMiddleware, markAsRead);

router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;