const prisma = require("../config/prisma");

const getNotifications = async (req, res) => {
  try {

    let where = {};

    if (req.user.role === "EMPLOYEE") {
      where.employeeId = req.user.id;
    }

    if (req.user.role === "SUPER_ADMIN") {
      where.superAdminId = req.user.id;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications."
    });

  }
};

const markAsRead = async (req, res) => {
  try {

    const { id } = req.params;

    let where = {
      id: Number(id)
    };

    if (req.user.role === "EMPLOYEE") {
      where.employeeId = req.user.id;
    }

    if (req.user.role === "SUPER_ADMIN") {
      where.superAdminId = req.user.id;
    }

    const notification = await prisma.notification.update({
      where,
      data: {
        isRead: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification."
    });

  }
};

const deleteNotification = async (req, res) => {
  try {

    const { id } = req.params;

    let where = {
      id: Number(id)
    };

    // Employee can delete only their own notifications
    if (req.user.role === "EMPLOYEE") {
      where.employeeId = req.user.id;
    }

    // Super Admin can delete only their own notifications
    if (req.user.role === "SUPER_ADMIN") {
      where.superAdminId = req.user.id;
    }

    await prisma.notification.delete({
      where
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully."
    });

  } catch (error) {

    console.log("Delete notification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete notification."
    });

  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification
};