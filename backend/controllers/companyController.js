const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const sendCompanyWelcomeEmail = require("../services/companyWelcomeEmail");

console.log("******** COMPANY CONTROLLER LOADED ********");

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

  let password = "";

  for (let i = 0; i < 10; i++) {
    password += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return password;
};

const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      ownerName,
      email,
      phone,
      address,
      plan,
      status
    } = req.body;

    if (!companyName || !ownerName || !email || !phone || !address || !plan) {
      return res.status(400).json({
        success: false,
        message: "All company fields are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail
      }
    });

    const existingCompany = await prisma.company.findFirst({
      where: {
        email: normalizedEmail
      }
    });

    if (existingUser || existingCompany) {
      return res.status(409).json({
        success: false,
        message: "This email ID is already registered"
      });
    }

    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        planName: plan
      }
    });

    console.log("Subscription Plan:", subscriptionPlan);

    if (!subscriptionPlan) {
      return res.status(404).json({
        success: false,
        message: `Subscription plan "${plan}" not found`
      });
    }

    const startDate = new Date();

    const expiryDate = new Date(startDate);

    expiryDate.setDate(
      expiryDate.getDate() + subscriptionPlan.durationDays
    );

    const tempPassword = generatePassword(10);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // companyId (e.g. COM-004) is derived from the last row's id, which is
    // technically a race condition under concurrent requests. We retry on a
    // unique constraint violation (Prisma error P2002) so two simultaneous
    // signups can never silently overwrite/collide on the same companyId.
    let company;
    let attempts = 0;
    const maxAttempts = 5;

    while (!company) {
      attempts++;

      const lastCompany = await prisma.company.findFirst({
        orderBy: {
          id: "desc"
        }
      });

      const nextNumber = lastCompany ? lastCompany.id + 1 : 1;
      const generatedCompanyId = `COM-${String(nextNumber).padStart(3, "0")}`;

      try {
        company = await prisma.company.create({
          data: {
            companyId: generatedCompanyId,
            companyName,
            ownerName,
            email: normalizedEmail,
            phone,
            address,
            plan,
            status: status || "ACTIVE",
            expiryDate
          }
        });
      } catch (err) {
        const isDuplicateCompanyId =
          err.code === "P2002" && err.meta?.target?.includes("companyId");

        if (isDuplicateCompanyId && attempts < maxAttempts) {
          continue; // another request grabbed this id first, try the next one
        }

        throw err;
      }
    }

    // Create Subscription
    const subscription = await prisma.subscription.create({
      data: {
        companyId: company.id,
        planId: subscriptionPlan.id,
        startDate,
        expiryDate,
        status: status || "ACTIVE"
      }
    });


    const adminUser = await prisma.user.create({
      data: {
        companyId: company.id,
        name: ownerName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "ADMIN",
        isFirstLogin: true
      }
    });

    try {
      await sendCompanyWelcomeEmail({
        companyName,
        ownerName,
        email: normalizedEmail,
        password: tempPassword,
      });
    } catch (error) {
      console.error("Failed to send company welcome email:", error.message);
    }

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
      subscription,
      adminUser
    });

  } catch (error) {
    console.log("Create company error:", error);

    res.status(500).json({
      success: false,
      message: "Company creation failed",
      error: error.message
    });
  }
};



const getCompanies = async (req, res) => {
  try {

    const companies = await prisma.company.findMany({

      include: {

        subscriptions: {

          orderBy: {
            createdAt: "desc"
          },

          take: 1,

          include: {
            plan: true
          }

        }

      },

      orderBy: {
        createdAt: "desc"
      }

    });

    const formattedCompanies = companies.map((company) => {

      const subscription = company.subscriptions[0] || null;

      return {

        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName,
        ownerName: company.ownerName,
        email: company.email,
        phone: company.phone,
        address: company.address,

        plan: company.plan,
        status: company.status,

        expiryDate: company.expiryDate,

        subscription

      };

    });

    res.status(200).json({

      success: true,

      count: formattedCompanies.length,

      companies: formattedCompanies

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch companies"
    });

  }
};
const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        companyId
      },

      include: {
        subscriptions: {
          orderBy: {
            createdAt: "desc"
          },

          include: {
            plan: true
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    res.status(200).json({
      success: true,

      company: {
        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName,
        ownerName: company.ownerName,
        email: company.email,
        phone: company.phone,
        address: company.address,

        plan: company.plan,
        status: company.status,

        expiryDate: company.expiryDate,

        // ALL subscription history
        subscriptions: company.subscriptions
      }
    });

  } catch (error) {
    console.error("Get Company By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch company",
      error: error.message
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    const { companyId } = req.params;

    const {
      companyName,
      ownerName,
      email,
      phone,
      address,
      plan,
      status,
    } = req.body;

    // --------------------------------------------------
    // 1. Find company
    // --------------------------------------------------

    const existingCompany = await prisma.company.findUnique({
      where: {
        companyId,
      },
    });

    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // --------------------------------------------------
    // 2. Find selected plan
    // --------------------------------------------------

    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        planName: plan,
      },
    });

    if (!subscriptionPlan) {
      return res.status(404).json({
        success: false,
        message: `Subscription plan "${plan}" not found`,
      });
    }

    // --------------------------------------------------
    // 3. Check whether PLAN actually changed
    // --------------------------------------------------

    const planChanged = existingCompany.plan !== plan;

    console.log("=================================");
    console.log("OLD PLAN:", existingCompany.plan);
    console.log("NEW PLAN:", plan);
    console.log("PLAN CHANGED:", planChanged);
    console.log("=================================");

    // --------------------------------------------------
    // 4. Update company basic information
    // --------------------------------------------------

    let expiryDate = existingCompany.expiryDate;

    // Only calculate a new expiry date when plan changes
    if (planChanged) {
      const startDate = new Date();

      expiryDate = new Date(startDate);

      expiryDate.setDate(
        expiryDate.getDate() + subscriptionPlan.durationDays
      );
    }

    const company = await prisma.company.update({
      where: {
        companyId,
      },

      data: {
        companyName,
        ownerName,
        email,
        phone,
        address,
        plan,
        status,
        expiryDate,
      },
    });

    console.log("Company Updated:", company);

    // --------------------------------------------------
    // 5. Update company admin information
    // --------------------------------------------------

    await prisma.user.updateMany({
      where: {
        companyId: company.id,
        role: "ADMIN",
      },

      data: {
        name: ownerName,
        email,
      },
    });

    // --------------------------------------------------
    // 6. Get current active subscription
    // --------------------------------------------------

    const currentSubscription = await prisma.subscription.findFirst({
      where: {
        companyId: company.id,
        status: "ACTIVE",
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // --------------------------------------------------
    // 7. IMPORTANT:
    // Only create a NEW subscription when PLAN changes
    // --------------------------------------------------

    if (planChanged) {
      console.log("========== PLAN CHANGE ==========");
      console.log(
        `Changing plan from ${existingCompany.plan} to ${plan}`
      );

      // ----------------------------------------------
      // Count users BEFORE starting new plan
      // ----------------------------------------------

      const currentUserCount = await prisma.user.count({
        where: {
          companyId: company.id,
          status: "ACTIVE",
        },
      });

      console.log(
        "Users before new plan starts:",
        currentUserCount
      );

      // ----------------------------------------------
      // Expire old subscription
      // ----------------------------------------------

      if (currentSubscription) {
        await prisma.subscription.update({
          where: {
            id: currentSubscription.id,
          },

          data: {
            status: "EXPIRED",
          },
        });

        console.log(
          "Old subscription expired:",
          currentSubscription.id
        );
      }

      // ----------------------------------------------
      // Create new subscription
      // ----------------------------------------------

      const startDate = new Date();

      const newSubscription = await prisma.subscription.create({
        data: {
          companyId: company.id,
          planId: subscriptionPlan.id,
          startDate,
          expiryDate,

          // IMPORTANT:
          // Existing users belong to the previous plan.
          // New plan starts counting NEW users from now.
          usersAtSubscriptionStart: currentUserCount,

          status: "ACTIVE",
          paymentStatus: "PENDING",
        },

        include: {
          plan: true,
        },
      });

      console.log("========== NEW SUBSCRIPTION ==========");
      console.log("Plan:", newSubscription.plan.planName);
      console.log(
        "Max Users:",
        newSubscription.plan.maxUsers
      );
      console.log(
        "Users At Subscription Start:",
        newSubscription.usersAtSubscriptionStart
      );
      console.log("======================================");

      return res.status(200).json({
        success: true,
        message: `Company plan changed from ${existingCompany.plan} to ${plan}`,
        company,
        subscription: newSubscription,
      });
    }

    // --------------------------------------------------
    // 8. If PLAN DID NOT CHANGE
    // Don't create a new subscription
    // --------------------------------------------------

    console.log(
      "Plan did not change. Existing subscription preserved."
    );

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
      subscription: currentSubscription,
    });

  } catch (error) {
    console.error("Update Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update company",
      error: error.message,
    });
  }
};
const changeCompanyStatus = async (req, res) => {
  try {

    const { companyId } = req.params;

    const { status } = req.body;

    const allowedStatus = [
      "ACTIVE",
      "INACTIVE",
      "EXPIRED"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company status"
      });
    }

    // Update Company
    const company = await prisma.company.update({

      where: {
        companyId
      },

      data: {
        status
      }

    });

    // Update Subscription Status
    let subscriptionStatus = "ACTIVE";

    // if (status === "TRIAL") {
    //   subscriptionStatus = "TRIAL";
    // }

    if (status === "EXPIRED") {
      subscriptionStatus = "EXPIRED";
    }

    if (status === "CANCELLED") {
      subscriptionStatus = "CANCELLED";
    }

    if (status === "INACTIVE") {
      subscriptionStatus = "CANCELLED";
    }

    await prisma.subscription.updateMany({

      where: {
        companyId: company.id
      },

      data: {
        status: subscriptionStatus
      }

    });

    res.status(200).json({
      success: true,
      message: "Company status updated successfully",
      company,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update company status"
    });

  }
};

const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        companyId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    await prisma.subscription.deleteMany({
      where: {
        companyId: company.id
      }
    });

    await prisma.company.delete({
      where: {
        companyId
      }
    });

    res.status(200).json({
      success: true,
      message: "Company deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete company"
    });
  }
};

const getCompanyStats = async (req, res) => {
  try {
    console.log("========== COMPANY STATS ==========");

    const totalCompanies = await prisma.company.count();

    const activeCompanies = await prisma.company.count({
      where: {
        status: "ACTIVE",
      },
    });

    const inactiveCompanies = await prisma.company.count({
      where: {
        status: "INACTIVE",
      },
    });

    const expiredCompanies = await prisma.company.count({
      where: {
        status: "EXPIRED",
      },
    });

    const starterCompanies = await prisma.company.count({
      where: {
        plan: "Starter",
      },
    });

    const professionalCompanies = await prisma.company.count({
      where: {
        plan: "Professional",
      },
    });

    const enterpriseCompanies = await prisma.company.count({
      where: {
        plan: "Enterprise",
      },
    });

    const trialPlanCompanies = await prisma.company.count({
      where: {
        plan: "Trial",
      },
    });

    const stats = {
      totalCompanies,
      activeCompanies,
      inactiveCompanies,
      expiredCompanies,
      trialCompanies: trialPlanCompanies,
      starterCompanies,
      professionalCompanies,
      enterpriseCompanies,
    };

    console.log("COMPANY STATS:", stats);

    return res.status(200).json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error("========== COMPANY STATS ERROR ==========");
    console.error(error);
    console.error(error.message);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  changeCompanyStatus,
  deleteCompany,
  getCompanyStats
};