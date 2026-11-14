// const prisma = require("../config/prisma");

// // Integration limits: -1 = unlimited. When a field is not sent at all
// // we return undefined so Prisma leaves the stored value untouched.
// const optionalLimit = (value) => {
//   if (value === undefined || value === null || value === "") return undefined;
//   const n = Number(value);
//   return Number.isInteger(n) && n >= -1 ? n : 0;
// };

// const toBool = (value) => value === true || value === "true";

// // Custom plans have no price, duration or limits set by the super admin.
// // The database columns stay required (so nothing else in the system breaks),
// // so we store neutral values: free, 1 year validity, and -1 = unlimited.
// const CUSTOM_PLAN_DEFAULTS = {
//   price: 0,
//   durationDays: 365,
//   maxUsers: -1,
//   maxCustomers: -1,
//   maxCampaigns: -1,
//   maxTemplates: -1,
//   maxFacebookPages: -1,
//   maxInstagramAccounts: -1,
//   maxWebsiteIntegrations: -1,
//   maxAppIntegrations: -1,
//   isTrial: false,
// };

// const cleanFeatures = (features) =>
//   Array.isArray(features)
//     ? features.map((f) => String(f).trim()).filter(Boolean)
//     : [];

// // Builds the Prisma `data` object for create / update
// const buildPlanData = (body) => {
//   const {
//     planName,
//     price,
//     durationDays,
//     maxUsers,
//     maxCustomers,
//     maxCampaigns,
//     maxTemplates,
//     maxFacebookPages,
//     maxInstagramAccounts,
//     maxWebsiteIntegrations,
//     maxAppIntegrations,
//     features,
//     isTrial,
//     isCustom,
//     status,
//   } = body;

//   if (toBool(isCustom)) {
//     return {
//       planName: String(planName).trim(),
//       ...CUSTOM_PLAN_DEFAULTS,
//       features: cleanFeatures(features),
//       isCustom: true,
//       status: status || "ACTIVE",
//     };
//   }

//   return {
//     planName,
//     price: Number(price) || 0,
//     durationDays: Number(durationDays) || 0,
//     maxUsers: Number(maxUsers) || 0,
//     maxCustomers: Number(maxCustomers) || 0,
//     maxCampaigns: Number(maxCampaigns) || 0,
//     maxTemplates: Number(maxTemplates) || 0,
//     maxFacebookPages: optionalLimit(maxFacebookPages),
//     maxInstagramAccounts: optionalLimit(maxInstagramAccounts),
//     maxWebsiteIntegrations: optionalLimit(maxWebsiteIntegrations),
//     maxAppIntegrations: optionalLimit(maxAppIntegrations),
//     features: Array.isArray(features) ? features : [],
//     isTrial: toBool(isTrial),
//     isCustom: false,
//     status: status || "ACTIVE",
//   };
// };

// // Extra checks only for custom plans (regular plans behave exactly as before)
// const validateCustomPlan = (body) => {
//   if (!body.planName || !String(body.planName).trim()) {
//     return "Plan name is required";
//   }
//   if (cleanFeatures(body.features).length === 0) {
//     return "Add at least one feature for a custom plan";
//   }
//   return null;
// };

// // CREATE SUBSCRIPTION PLAN
// const createSubscriptionPlan = async (req, res) => {
//   try {
//     const { planName } = req.body;

//     if (!planName) {
//       return res.status(400).json({
//         success: false,
//         message: "Plan name is required",
//       });
//     }

//     if (toBool(req.body.isCustom)) {
//       const error = validateCustomPlan(req.body);
//       if (error) {
//         return res.status(400).json({ success: false, message: error });
//       }
//     }

//     const data = buildPlanData(req.body);

//     const existingPlan = await prisma.subscriptionPlan.findUnique({
//       where: {
//         planName: data.planName,
//       },
//     });

//     if (existingPlan) {
//       return res.status(400).json({
//         success: false,
//         message: "A plan with this name already exists",
//       });
//     }

//     const plan = await prisma.subscriptionPlan.create({ data });

//     res.status(201).json({
//       success: true,
//       message: "Subscription plan created successfully",
//       plan,
//     });
//   } catch (error) {
//     console.log("Create plan error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create subscription plan",
//     });
//   }
// };

// // GET ALL SUBSCRIPTION PLANS
// const getSubscriptionPlans = async (req, res) => {
//   try {
//     const plans = await prisma.subscriptionPlan.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.status(200).json({
//       success: true,
//       count: plans.length,
//       plans,
//     });
//   } catch (error) {
//     console.log("Get plans error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch subscription plans",
//     });
//   }
// };

// // GET ONE SUBSCRIPTION PLAN
// const getSubscriptionPlanById = async (req, res) => {
//   try {
//     const planId = Number(req.params.id);

//     if (Number.isNaN(planId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid plan ID",
//       });
//     }

//     const plan = await prisma.subscriptionPlan.findUnique({
//       where: {
//         id: planId,
//       },
//     });

//     if (!plan) {
//       return res.status(404).json({
//         success: false,
//         message: "Subscription plan not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       plan,
//     });
//   } catch (error) {
//     console.log("Get plan error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch subscription plan",
//     });
//   }
// };

// // UPDATE SUBSCRIPTION PLAN
// const updateSubscriptionPlan = async (req, res) => {
//   try {
//     const planId = Number(req.params.id);

//     if (Number.isNaN(planId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid plan ID",
//       });
//     }

//     const existingPlan = await prisma.subscriptionPlan.findUnique({
//       where: {
//         id: planId,
//       },
//     });

//     if (!existingPlan) {
//       return res.status(404).json({
//         success: false,
//         message: "Subscription plan not found",
//       });
//     }

//     if (toBool(req.body.isCustom)) {
//       const error = validateCustomPlan(req.body);
//       if (error) {
//         return res.status(400).json({ success: false, message: error });
//       }
//     }

//     const data = buildPlanData(req.body);

//     const duplicatePlan = await prisma.subscriptionPlan.findFirst({
//       where: {
//         planName: data.planName,
//         NOT: {
//           id: planId,
//         },
//       },
//     });

//     if (duplicatePlan) {
//       return res.status(400).json({
//         success: false,
//         message: "A plan with this name already exists",
//       });
//     }

//     const plan = await prisma.subscriptionPlan.update({
//       where: {
//         id: planId,
//       },
//       data,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Subscription plan updated successfully",
//       plan,
//     });
//   } catch (error) {
//     console.log("Update plan error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to update subscription plan",
//     });
//   }
// };

// // DELETE SUBSCRIPTION PLAN
// const deleteSubscriptionPlan = async (req, res) => {
//   try {
//     const planId = Number(req.params.id);

//     if (Number.isNaN(planId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid plan ID",
//       });
//     }

//     const existingPlan = await prisma.subscriptionPlan.findUnique({
//       where: {
//         id: planId,
//       },
//     });

//     if (!existingPlan) {
//       return res.status(404).json({
//         success: false,
//         message: "Subscription plan not found",
//       });
//     }

//     const subscriptionCount = await prisma.subscription.count({
//       where: {
//         planId,
//       },
//     });

//     if (subscriptionCount > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot delete a plan that is assigned to companies",
//       });
//     }

//     await prisma.subscriptionPlan.delete({
//       where: {
//         id: planId,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Subscription plan deleted successfully",
//     });
//   } catch (error) {
//     console.log("Delete plan error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to delete subscription plan",
//     });
//   }
// };

// module.exports = {
//   createSubscriptionPlan,
//   getSubscriptionPlans,
//   getSubscriptionPlanById,
//   updateSubscriptionPlan,
//   deleteSubscriptionPlan,
// };


const prisma = require("../config/prisma");
const {
  FEATURE_CATALOG,
  normalizeFeatureConfig,
  validateFeatureConfig,
  columnsFromConfig,
  fullAccessConfig,
  buildFeatureSummary,
} = require("../config/featureCatalog");

// Integration limits: -1 = unlimited. When a field is not sent at all
// we return undefined so Prisma leaves the stored value untouched.
const optionalLimit = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n >= -1 ? n : 0;
};

const toBool = (value) => value === true || value === "true";

// Custom plans have no price, duration or limits set by the super admin.
// The database columns stay required (so nothing else in the system breaks),
// so we store neutral values: free, 1 year validity, and -1 = unlimited.
const CUSTOM_PLAN_DEFAULTS = {
  price: 0,
  durationDays: 365,
  maxUsers: -1,
  maxCustomers: -1,
  maxCampaigns: -1,
  maxTemplates: -1,
  maxFacebookPages: -1,
  maxInstagramAccounts: -1,
  maxWebsiteIntegrations: -1,
  maxAppIntegrations: -1,
  isTrial: false,
};

const cleanFeatures = (features) =>
  Array.isArray(features)
    ? features.map((f) => String(f).trim()).filter(Boolean)
    : [];

// Adds a complete featureConfig (every catalog feature) and a short
// featureSummary to a plan before it is sent to the frontend. Plans saved
// before this feature existed get their config built from the old columns.
const withFeatureConfig = (plan) => {
  if (!plan) return plan;
  const featureConfig = normalizeFeatureConfig(plan.featureConfig, plan);
  return {
    ...plan,
    featureConfig,
    featureSummary: buildFeatureSummary(featureConfig),
  };
};

// Builds the Prisma `data` object for create / update
const buildPlanData = (body) => {
  const {
    planName,
    price,
    durationDays,
    maxUsers,
    maxCustomers,
    maxCampaigns,
    maxTemplates,
    maxFacebookPages,
    maxInstagramAccounts,
    maxWebsiteIntegrations,
    maxAppIntegrations,
    features,
    isTrial,
    isCustom,
    status,
  } = body;

  if (toBool(isCustom)) {
    return {
      planName: String(planName).trim(),
      ...CUSTOM_PLAN_DEFAULTS,
      features: cleanFeatures(features),
      featureConfig: fullAccessConfig(),
      isCustom: true,
      status: status || "ACTIVE",
    };
  }

  // NEW: the form sends one featureConfig (switches + limits). The old
  // limit columns are filled from it automatically.
  if (body.featureConfig && typeof body.featureConfig === "object") {
    const featureConfig = normalizeFeatureConfig(body.featureConfig);

    return {
      planName,
      price: Number(price) || 0,
      durationDays: Number(durationDays) || 0,
      ...columnsFromConfig(featureConfig),
      featureConfig,
      features: Array.isArray(features) ? features : [],
      isTrial: toBool(isTrial),
      isCustom: false,
      status: status || "ACTIVE",
    };
  }

  const legacyData = {
    planName,
    price: Number(price) || 0,
    durationDays: Number(durationDays) || 0,
    maxUsers: Number(maxUsers) || 0,
    maxCustomers: Number(maxCustomers) || 0,
    maxCampaigns: Number(maxCampaigns) || 0,
    maxTemplates: Number(maxTemplates) || 0,
    maxFacebookPages: optionalLimit(maxFacebookPages),
    maxInstagramAccounts: optionalLimit(maxInstagramAccounts),
    maxWebsiteIntegrations: optionalLimit(maxWebsiteIntegrations),
    maxAppIntegrations: optionalLimit(maxAppIntegrations),
    features: Array.isArray(features) ? features : [],
    isTrial: toBool(isTrial),
    isCustom: false,
    status: status || "ACTIVE",
  };

  // Keep featureConfig in step with the columns for old-style requests
  return { ...legacyData, featureConfig: normalizeFeatureConfig(null, legacyData) };
};

// Extra checks only for custom plans (regular plans behave exactly as before)
const validateCustomPlan = (body) => {
  if (!body.planName || !String(body.planName).trim()) {
    return "Plan name is required";
  }
  if (cleanFeatures(body.features).length === 0) {
    return "Add at least one feature for a custom plan";
  }
  return null;
};

// CREATE SUBSCRIPTION PLAN
const createSubscriptionPlan = async (req, res) => {
  try {
    const { planName } = req.body;

    if (!planName) {
      return res.status(400).json({
        success: false,
        message: "Plan name is required",
      });
    }

    if (toBool(req.body.isCustom)) {
      const error = validateCustomPlan(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error });
      }
    }

    if (!toBool(req.body.isCustom) && req.body.featureConfig) {
      const featureError = validateFeatureConfig(req.body.featureConfig);
      if (featureError) {
        return res.status(400).json({ success: false, message: featureError });
      }
    }

    const data = buildPlanData(req.body);

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        planName: data.planName,
      },
    });

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "A plan with this name already exists",
      });
    }

    const plan = await prisma.subscriptionPlan.create({ data });

    res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
      plan: withFeatureConfig(plan),
    });
  } catch (error) {
    console.log("Create plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create subscription plan",
    });
  }
};

// GET ALL SUBSCRIPTION PLANS
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans: plans.map(withFeatureConfig),
    });
  } catch (error) {
    console.log("Get plans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plans",
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
        message: "Invalid plan ID",
      });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    res.status(200).json({
      success: true,
      plan: withFeatureConfig(plan),
    });
  } catch (error) {
    console.log("Get plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plan",
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
        message: "Invalid plan ID",
      });
    }

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    if (toBool(req.body.isCustom)) {
      const error = validateCustomPlan(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error });
      }
    }

    if (!toBool(req.body.isCustom) && req.body.featureConfig) {
      const featureError = validateFeatureConfig(req.body.featureConfig);
      if (featureError) {
        return res.status(400).json({ success: false, message: featureError });
      }
    }

    const data = buildPlanData(req.body);

    const duplicatePlan = await prisma.subscriptionPlan.findFirst({
      where: {
        planName: data.planName,
        NOT: {
          id: planId,
        },
      },
    });

    if (duplicatePlan) {
      return res.status(400).json({
        success: false,
        message: "A plan with this name already exists",
      });
    }

    const plan = await prisma.subscriptionPlan.update({
      where: {
        id: planId,
      },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      plan: withFeatureConfig(plan),
    });
  } catch (error) {
    console.log("Update plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update subscription plan",
    });
  }
};

// GET FEATURE CATALOG (the list that draws the Features & Limits section)
const getFeatureCatalog = async (req, res) => {
  res.status(200).json({
    success: true,
    features: FEATURE_CATALOG,
  });
};

// DELETE SUBSCRIPTION PLAN
const deleteSubscriptionPlan = async (req, res) => {
  try {
    const planId = Number(req.params.id);

    if (Number.isNaN(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    const subscriptionCount = await prisma.subscription.count({
      where: {
        planId,
      },
    });

    if (subscriptionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a plan that is assigned to companies",
      });
    }

    await prisma.subscriptionPlan.delete({
      where: {
        id: planId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    console.log("Delete plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete subscription plan",
    });
  }
};

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getFeatureCatalog,
};