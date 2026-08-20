const prisma = require("../config/prisma");

// GET ALL COMPANY SUBSCRIPTIONS
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        company: true,
        plan: true,

        reminders: {
          where: {
            status: "SENT"
          },
          orderBy: {
            sentAt: "desc"
          },
          take: 1
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });

    const today = new Date();

    const data = subscriptions.map((subscription) => {
      const today = new Date();
      const expiryDate = new Date(subscription.expiryDate);

      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const expiryDateOnly = new Date(
        expiryDate.getFullYear(),
        expiryDate.getMonth(),
        expiryDate.getDate()
      );

      const remainingDays = Math.max(
        0,
        Math.ceil(
          (expiryDateOnly - todayDate) /
          (1000 * 60 * 60 * 24)
        )
      );

      return {
        ...subscription,
        remainingDays,
        isExpired: expiryDateOnly < todayDate,

        lastReminderSentAt:
          subscription.reminders?.[0]?.sentAt || null
      };
    });

    res.status(200).json({
      success: true,
      count: data.length,
      subscriptions: data
    });

  } catch (error) {
    console.error("Get subscriptions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions"
    });
  }
};

// GET SUBSCRIPTION STATS
const getSubscriptionStats = async (req, res) => {
  try {
    const now = new Date();

    // Date/time 3 days from now
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(
      threeDaysFromNow.getDate() + 3
    );

    // Total subscriptions
    const totalSubscriptions =
      await prisma.subscription.count();

    // Active subscriptions
    const activeSubscriptions =
      await prisma.subscription.count({
        where: {
          status: "ACTIVE",
          expiryDate: {
            gt: now
          }
        }
      });

    // Expired subscriptions
    const expiredSubscriptions =
      await prisma.subscription.count({
        where: {
          OR: [
            {
              status: "EXPIRED"
            },
            {
              expiryDate: {
                lte: now
              }
            }
          ]
        }
      });

    // Expiring within next 3 days
    const expiringSoon =
      await prisma.subscription.count({
        where: {
          status: "ACTIVE",
          expiryDate: {
            gt: now,
            lte: threeDaysFromNow
          }
        }
      });

    return res.status(200).json({
      success: true,
      stats: {
        totalSubscriptions,
        activeSubscriptions,
        expiringSoon,
        expiredSubscriptions
      }
    });

  } catch (error) {

    console.error(
      "Get subscription stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription statistics"
    });
  }
};

module.exports = {
  getSubscriptions,
  getSubscriptionStats
};