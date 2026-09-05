
const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const razorpay = require("../services/razorpayService");
const prisma = require("../config/prisma");
const sendCompanyWelcomeEmail = require("../services/companyWelcomeEmail");

// ======================================================
// CREATE RAZORPAY ORDER
// ======================================================

router.post("/create-order", async (req, res) => {
  try {
    const { amount, receipt } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order.id);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Razorpay order creation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
});


// ======================================================
// CHECK EMAIL BEFORE PAYMENT
// ======================================================

router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check Company table
    const existingCompany =
      await prisma.company.findFirst({
        where: {
          email: normalizedEmail,
        },
        select: {
          id: true,
        },
      });

    // Check User table
    const existingUser =
      await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
        },
        select: {
          id: true,
        },
      });

    const exists =
      Boolean(existingCompany) ||
      Boolean(existingUser);

    return res.status(200).json({
      success: true,
      exists,
    });

  } catch (error) {
    console.error(
      "Check email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to check email",
    });
  }
});

// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      // Company details
      companyName,
      ownerName,
      email,
      phone,
      address,

      // Plan
      planId,
    } = req.body;

    // ==================================================
    // 1. VALIDATE REQUIRED DATA
    // ==================================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    if (
      !companyName ||
      !ownerName ||
      !email ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Company details are required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ==================================================
    // 2. VERIFY RAZORPAY SIGNATURE
    // ==================================================

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      console.error("Invalid Razorpay payment signature");

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log("==========================================");
    console.log("Razorpay payment verified successfully");
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("==========================================");

    // ==================================================
    // 3. CHECK PLAN FROM DATABASE
    // ==================================================

    const subscriptionPlan =
      await prisma.subscriptionPlan.findUnique({
        where: {
          id: Number(planId),
        },
      });

    if (!subscriptionPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    console.log(
      "Selected Plan:",
      subscriptionPlan.planName
    );

    // ==================================================
    // 4. GET RAZORPAY ORDER
    // ==================================================

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    // ==================================================
    // 5. CALCULATE EXPECTED AMOUNT FROM DATABASE
    // ==================================================

    const baseAmount =
      Number(subscriptionPlan.price);

    const tax =
      Math.round(baseAmount * 0.18);

    const expectedTotal =
      baseAmount + tax;

    const expectedAmountInPaise =
      Math.round(expectedTotal * 100);

    console.log(
      "Plan Price:",
      baseAmount
    );

    console.log(
      "GST:",
      tax
    );

    console.log(
      "Expected Total:",
      expectedTotal
    );

    console.log(
      "Razorpay Order Amount:",
      razorpayOrder.amount
    );

    // ==================================================
    // 6. VERIFY ORDER AMOUNT
    // ==================================================

    if (
      Number(razorpayOrder.amount) !==
      expectedAmountInPaise
    ) {
      console.error(
        "Razorpay order amount mismatch"
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment amount does not match the selected plan",
      });
    }

    // ==================================================
    // 7. CHECK DUPLICATE PAYMENT
    // ==================================================

    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          razorpayPaymentId:
            razorpay_payment_id,
        },
      });

    if (existingPayment) {
      console.log(
        "Payment already exists:",
        existingPayment.id
      );

      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        payment: existingPayment,
      });
    }

    // ==================================================
    // 8. CHECK EXISTING COMPANY EMAIL
    // ==================================================

    const existingCompany =
      await prisma.company.findFirst({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message:
          "This email ID is already registered to a company. Please use another email.",
      });
    }

    // ==================================================
    // 9. CHECK EXISTING USER EMAIL
    // ==================================================

    const existingUser =
      await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "This email ID is already registered. Please use another email.",
      });
    }

    // ==================================================
    // 10. PREPARE SUBSCRIPTION DATES
    // ==================================================

    const startDate = new Date();

    const expiryDate =
      new Date(startDate);

    expiryDate.setDate(
      expiryDate.getDate() +
        subscriptionPlan.durationDays
    );

    // ==================================================
    // 11. GENERATE TEMPORARY PASSWORD
    // ==================================================

    const generatePassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

      let password = "";

      for (let i = 0; i < 10; i++) {
        password += chars.charAt(
          Math.floor(
            Math.random() * chars.length
          )
        );
      }

      return password;
    };

    const temporaryPassword =
      generatePassword();

    const hashedPassword =
      await bcrypt.hash(
        temporaryPassword,
        10
      );

    // ==================================================
    // 12. DATABASE TRANSACTION
    // ==================================================

    const result =
      await prisma.$transaction(
        async (tx) => {

          // --------------------------------------------
          // GENERATE COMPANY ID
          // --------------------------------------------

          const lastCompany =
            await tx.company.findFirst({
              orderBy: {
                id: "desc",
              },
            });

          const nextCompanyNumber =
            lastCompany
              ? lastCompany.id + 1
              : 1;

          const generatedCompanyId =
            `COM-${String(
              nextCompanyNumber
            ).padStart(3, "0")}`;

          console.log(
            "Generated Company ID:",
            generatedCompanyId
          );

          // --------------------------------------------
          // CREATE COMPANY
          // --------------------------------------------

          const company =
            await tx.company.create({
              data: {
                companyId:
                  generatedCompanyId,

                companyName,

                ownerName,

                email:
                  normalizedEmail,

                phone,

                address,

                plan:
                  subscriptionPlan.planName,

                status: "ACTIVE",

                expiryDate,
              },
            });

          console.log(
            "Company created:",
            company.companyId
          );

          // --------------------------------------------
          // CREATE SUBSCRIPTION
          // --------------------------------------------

          const subscription =
            await tx.subscription.create({
              data: {
                companyId:
                  company.id,

                planId:
                  subscriptionPlan.id,

                startDate,

                expiryDate,

                usersAtSubscriptionStart: 1,

                status: "ACTIVE",

                paymentStatus: "PAID",
              },
            });

          console.log(
            "Subscription created:",
            subscription.id
          );

          // --------------------------------------------
          // CREATE ADMIN USER
          // --------------------------------------------

          const adminUser =
            await tx.user.create({
              data: {
                companyId:
                  company.id,

                name:
                  ownerName,

                email:
                  normalizedEmail,

                password:
                  hashedPassword,

                role: "ADMIN",

                isFirstLogin: true,
              },
            });

          console.log(
            "Admin created:",
            adminUser.id
          );

          // --------------------------------------------
          // CREATE PAYMENT
          // --------------------------------------------

          const payment =
            await tx.payment.create({
              data: {
                paymentId:
                  `PAY-${Date.now()}`,

                companyId:
                  company.id,

                subscriptionId:
                  subscription.id,

                planId:
                  subscriptionPlan.id,

                companyName,

                ownerName,

                email:
                  normalizedEmail,

                phone,

                amount:
                  baseAmount,

                tax,

                discount: 0,

                totalAmount:
                  expectedTotal,

                paymentMethod:
                  "RAZORPAY",

                paymentStatus:
                  "PAID",

                gateway:
                  "RAZORPAY",

                transactionId:
                  razorpay_payment_id,

                razorpayOrderId:
                  razorpay_order_id,

                razorpayPaymentId:
                  razorpay_payment_id,

                razorpaySignature:
                  razorpay_signature,

                paidAt:
                  new Date(),
              },
            });

          console.log(
            "Payment created:",
            payment.paymentId
          );

          return {
            company,
            subscription,
            adminUser,
            payment,
            temporaryPassword,
          };
        }
      );

    // ==================================================
    // 13. TRANSACTION SUCCESS
    // ==================================================

    console.log("==========================================");
    console.log("DATABASE TRANSACTION SUCCESS");
    console.log("Company:", result.company.companyId);
    console.log("Subscription:", result.subscription.id);
    console.log("Payment:", result.payment.paymentId);
    console.log("==========================================");

    // ==================================================
    // 14. SEND WELCOME EMAIL
    // ==================================================

    try {
      await sendCompanyWelcomeEmail({
        companyName,
        ownerName,
        email: normalizedEmail,
        password: result.temporaryPassword,
      });

      console.log(
        "Welcome email sent successfully"
      );

    } catch (emailError) {

      console.error(
        "Welcome email failed:",
        emailError.message
      );

      // IMPORTANT:
      // Do not rollback the transaction because
      // email failed after successful payment.
    }

    // ==================================================
    // 15. SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Payment verified and company created successfully",

      payment: {
        id:
          result.payment.id,

        paymentId:
          result.payment.paymentId,

        razorpayOrderId:
          result.payment.razorpayOrderId,

        razorpayPaymentId:
          result.payment.razorpayPaymentId,

        paymentStatus:
          result.payment.paymentStatus,
      },

      company: {
        id:
          result.company.id,

        companyId:
          result.company.companyId,

        companyName:
          result.company.companyName,

        ownerName:
          result.company.ownerName,

        email:
          result.company.email,

        status:
          result.company.status,

        expiryDate:
          result.company.expiryDate,
      },

      subscription: {
        id:
          result.subscription.id,

        plan:
          subscriptionPlan.planName,

        startDate:
          result.subscription.startDate,

        expiryDate:
          result.subscription.expiryDate,

        status:
          result.subscription.status,
      },
    });

  } catch (error) {

    console.error(
      "=========================================="
    );

    console.error(
      "RAZORPAY PAYMENT VERIFICATION ERROR"
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Payment verification failed",

      error:
        error.message,
    });
  }
});


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;
