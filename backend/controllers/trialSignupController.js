const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const sendCompanyWelcomeEmail = require("../services/companyWelcomeEmail");

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

const createTrialCompany = async (req, res) => {
  try {
    const {
      companyName,
      ownerName,
      email,
      phone,
      address,
    } = req.body;

    // ============================================
    // 1. VALIDATE REQUIRED FIELDS
    // ============================================

    if (
      !companyName ||
      !ownerName ||
      !email ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All trial signup fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ============================================
    // 2. CHECK EMAIL
    // ============================================

    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    const existingCompany = await prisma.company.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser || existingCompany) {
      return res.status(409).json({
        success: false,
        message: "This email ID is already registered",
      });
    }

    // ============================================
    // 3. GET TRIAL PLAN
    // ============================================

    const trialPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        planName: "Trial",
      },
    });

    if (!trialPlan) {
      return res.status(404).json({
        success: false,
        message: "Trial plan is not available",
      });
    }

    // ============================================
    // 4. MAKE SURE TRIAL PLAN IS ACTIVE
    // ============================================

    if (trialPlan.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Trial signup is currently unavailable",
      });
    }

    // ============================================
    // 5. CALCULATE TRIAL DATES
    // ============================================

    const startDate = new Date();

    const expiryDate = new Date(startDate);

    expiryDate.setDate(
      expiryDate.getDate() + trialPlan.durationDays
    );

    // ============================================
    // 6. GENERATE PASSWORD
    // ============================================

    const tempPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(
      tempPassword,
      10
    );

    // ============================================
    // 7. CREATE COMPANY
    // ============================================

    let company;
    let attempts = 0;
    const maxAttempts = 5;

    while (!company) {
      attempts++;

      const lastCompany =
        await prisma.company.findFirst({
          orderBy: {
            id: "desc",
          },
        });

      const nextNumber = lastCompany
        ? lastCompany.id + 1
        : 1;

      const generatedCompanyId =
        `COM-${String(nextNumber).padStart(3, "0")}`;

      try {
        company = await prisma.company.create({
          data: {
            companyId: generatedCompanyId,
            companyName,
            ownerName,
            email: normalizedEmail,
            phone,
            address,

            // Always Trial
            plan: trialPlan.planName,

            // Trial starts as ACTIVE
            status: "ACTIVE",

            expiryDate,
          },
        });
      } catch (error) {
        const isDuplicateCompanyId =
          error.code === "P2002" &&
          error.meta?.target?.includes("companyId");

        if (
          isDuplicateCompanyId &&
          attempts < maxAttempts
        ) {
          continue;
        }

        throw error;
      }
    }

    // ============================================
    // 8. CREATE SUBSCRIPTION
    // ============================================

    const subscription =
      await prisma.subscription.create({
        data: {
          companyId: company.id,
          planId: trialPlan.id,
          startDate,
          expiryDate,

          usersAtSubscriptionStart: 0,

          status: "ACTIVE",

          paymentStatus: "PENDING",
        },
      });

    // ============================================
    // 9. CREATE ADMIN USER
    // ============================================

    const adminUser = await prisma.user.create({
      data: {
        companyId: company.id,
        name: ownerName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "ADMIN",
        isFirstLogin: true,
      },
    });

    // ============================================
    // 10. SEND WELCOME EMAIL
    // ============================================

    let emailSent = true;

    try {
      await sendCompanyWelcomeEmail({
        companyName,
        ownerName,
        email: normalizedEmail,
        password: tempPassword,
      });
    } catch (error) {
      emailSent = false;

      console.error(
        "Failed to send trial welcome email:",
        error.message
      );
    }

    // ============================================
    // 11. RESPONSE
    // ============================================

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Free trial started successfully. Login credentials have been sent to your email."
        : "Free trial created successfully, but we could not send the email.",

      company: {
        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName,
        ownerName: company.ownerName,
        email: company.email,
        plan: company.plan,
        expiryDate: company.expiryDate,
      },

      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        status: subscription.status,
      },

      emailSent,
    });

  } catch (error) {
    console.error(
      "Create trial company error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to start free trial",
      error: error.message,
    });
  }
};

module.exports = {
  createTrialCompany,
};