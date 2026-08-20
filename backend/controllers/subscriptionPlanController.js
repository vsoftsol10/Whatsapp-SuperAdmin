

const prisma = require("../config/prisma");

// CREATE SUBSCRIPTION PLAN
const createSubscriptionPlan = async (req, res) => {
  try {
    const {
      planName,
      price,
      durationDays,
      maxUsers,
      maxCustomers,
      maxCampaigns,
      maxTemplates,
      features,
      isTrial,
      status
    } = req.body;

    if (!planName) {
      return res.status(400).json({
        success: false,
        message: "Plan name is required"
      });
    }

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        planName
      }
    });

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "A plan with this name already exists"
      });
    }

    const trialPlan = isTrial === true || isTrial === "true";

    const plan = await prisma.subscriptionPlan.create({
      data: {
        planName,
        price: Number(price) || 0,
        durationDays: Number(durationDays) || 0,
        maxUsers: Number(maxUsers) || 0,
        maxCustomers: Number(maxCustomers) || 0,
        maxCampaigns: Number(maxCampaigns) || 0,
        maxTemplates: Number(maxTemplates) || 0,
        features: Array.isArray(features) ? features : [],
        isTrial: trialPlan,
        status: status || "ACTIVE"
      }
    });

    res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
      plan
    });
  } catch (error) {
    console.log("Create plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create subscription plan"
    });
  }
};

// GET ALL SUBSCRIPTION PLANS
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans
    });
  } catch (error) {
    console.log("Get plans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plans"
    });
  }
};

// GET ONE SUBSCRIPTION PLAN
const getSubscriptionPlanById = async (req, res) => {
  try {
    const planId = Number(req.params.id);

    if (Number.isNaN(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID"
      });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found"
      });
    }

    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    console.log("Get plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plan"
    });
  }
};

// UPDATE SUBSCRIPTION PLAN
const updateSubscriptionPlan = async (req, res) => {
  try {
    const planId = Number(req.params.id);

    if (Number.isNaN(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID"
      });
    }

    const {
      planName,
      price,
      durationDays,
      maxUsers,
      maxCustomers,
      maxCampaigns,
      maxTemplates,
      features,
      isTrial,
      status
    } = req.body;

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId
      }
    });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found"
      });
    }

    const duplicatePlan = await prisma.subscriptionPlan.findFirst({
      where: {
        planName,
        NOT: {
          id: planId
        }
      }
    });

    if (duplicatePlan) {
      return res.status(400).json({
        success: false,
        message: "A plan with this name already exists"
      });
    }

    const trialPlan = isTrial === true || isTrial === "true";

    const plan = await prisma.subscriptionPlan.update({
      where: {
        id: planId
      },
      data: {
        planName,
        price: Number(price) || 0,
        durationDays: Number(durationDays) || 0,
        maxUsers: Number(maxUsers) || 0,
        maxCustomers: Number(maxCustomers) || 0,
        maxCampaigns: Number(maxCampaigns) || 0,
        maxTemplates: Number(maxTemplates) || 0,
        features: Array.isArray(features) ? features : [],
        isTrial: trialPlan,
        status: status || "ACTIVE"
      }
    });

    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      plan
    });
  } catch (error) {
    console.log("Update plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update subscription plan"
    });
  }
};

// DELETE SUBSCRIPTION PLAN
const deleteSubscriptionPlan = async (req, res) => {
  try {
    const planId = Number(req.params.id);

    if (Number.isNaN(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID"
      });
    }

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId
      }
    });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found"
      });
    }

    const subscriptionCount = await prisma.subscription.count({
      where: {
        planId
      }
    });

    if (subscriptionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a plan that is assigned to companies"
      });
    }

    await prisma.subscriptionPlan.delete({
      where: {
        id: planId
      }
    });

    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully"
    });
  } catch (error) {
    console.log("Delete plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete subscription plan"
    });
  }
};

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
};