const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        planName: true,
        price: true,
        durationDays: true,
        maxUsers: true,
        maxCustomers: true,
        maxCampaigns: true,
        maxTemplates: true,
        maxFacebookPages: true,
        maxInstagramAccounts: true,
        maxWebsiteIntegrations: true,
        maxAppIntegrations: true,
        features: true,
        isTrial: true,
        isCustom: true, // NEW: landing page uses this to show "Contact Sales"
        status: true,
      },
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error("Get public plans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plans",
    });
  }
});

module.exports = router;