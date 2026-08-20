const prisma = require("../config/prisma");

// ==========================================
// GET ALL UPGRADE REQUESTS
// ==========================================
const getUpgradeRequests = async (req, res) => {
  try {
    const requests =
      await prisma.subscriptionUpgradeRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },

        include: {
          company: {
            select: {
              id: true,
              companyId: true,
              companyName: true,
              ownerName: true,
              email: true,
              phone: true,
              status: true,
            },
          },

          currentPlan: {
            select: {
              id: true,
              planName: true,
              price: true,
              durationDays: true,
            },
          },

          requestedPlan: {
            select: {
              id: true,
              planName: true,
              price: true,
              durationDays: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(
      "GET UPGRADE REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch upgrade requests.",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE UPGRADE REQUEST
// ==========================================
const getUpgradeRequestById = async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Invalid upgrade request ID.",
      });
    }

    const request =
      await prisma.subscriptionUpgradeRequest.findUnique({
        where: {
          id: requestId,
        },

        include: {
          company: true,
          currentPlan: true,
          requestedPlan: true,
        },
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Upgrade request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error(
      "GET UPGRADE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch upgrade request.",
      error: error.message,
    });
  }
};

// ==========================================
// APPROVE UPGRADE REQUEST
// ==========================================
const approveUpgradeRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    const approvedBy =
      req.user.userId || req.user.id;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Invalid upgrade request ID.",
      });
    }

    if (!approvedBy) {
      return res.status(401).json({
        success: false,
        message:
          "Super Admin information not found.",
      });
    }

    // ==========================================
    // GET UPGRADE REQUEST
    // ==========================================
    const upgradeRequest =
      await prisma.subscriptionUpgradeRequest.findUnique({
        where: {
          id: requestId,
        },

        include: {
          requestedPlan: true,
          currentPlan: true,
          company: true,
        },
      });

    if (!upgradeRequest) {
      return res.status(404).json({
        success: false,
        message: "Upgrade request not found.",
      });
    }

    // ==========================================
    // ONLY PENDING CAN BE APPROVED
    // ==========================================
    if (upgradeRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending upgrade requests can be approved.",
      });
    }

    // ==========================================
    // TRANSACTION
    // ==========================================
    const result = await prisma.$transaction(
      async (tx) => {
        // ----------------------------------------
        // FIND CURRENT SUBSCRIPTION
        // ----------------------------------------
        const currentSubscription =
          await tx.subscription.findFirst({
            where: {
              companyId:
                upgradeRequest.companyId,

              status: {
                in: ["ACTIVE", "TRIAL"],
              },
            },

            orderBy: {
              expiryDate: "desc",
            },
          });

        if (!currentSubscription) {
          throw new Error(
            "No active subscription found for this company."
          );
        }

        // ----------------------------------------
        // CALCULATE NEW DATES
        // ----------------------------------------
        const startDate = new Date();

        const expiryDate = new Date(startDate);

        expiryDate.setDate(
          expiryDate.getDate() +
            upgradeRequest.requestedPlan
              .durationDays
        );

        // ----------------------------------------
        // UPDATE SUBSCRIPTION
        // ----------------------------------------
        const updatedSubscription =
          await tx.subscription.update({
            where: {
              id: currentSubscription.id,
            },

            data: {
              planId:
                upgradeRequest.requestedPlanId,

              startDate,

              expiryDate,

              status: "ACTIVE",

              paymentStatus: "PENDING",
            },

            include: {
              plan: true,
            },
          });

        // ----------------------------------------
        // UPDATE COMPANY
        // ----------------------------------------
        await tx.company.update({
          where: {
            id: upgradeRequest.companyId,
          },

          data: {
            plan:
              upgradeRequest.requestedPlan
                .planName,

            expiryDate,
          },
        });

        // ----------------------------------------
        // UPDATE REQUEST
        // ----------------------------------------
        const updatedRequest =
          await tx.subscriptionUpgradeRequest.update({
            where: {
              id: requestId,
            },

            data: {
              status: "APPROVED",

              approvedBy,

              remarks:
                req.body.remarks ||
                "Upgrade request approved.",
            },

            include: {
              company: true,
              currentPlan: true,
              requestedPlan: true,
            },
          });

        // ========================================
        // CREATE CRM USER NOTIFICATION
        // ========================================
        await tx.userNotification.create({
          data: {
            userId:
              upgradeRequest.requestedBy,

            title:
              "Upgrade Request Approved",

            message: `Your upgrade request for ${upgradeRequest.requestedPlan.planName} has been approved.`,

            type: "SYSTEM",

            isRead: false,
          },
        });

        return {
          updatedSubscription,
          updatedRequest,
        };
      }
    );

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    return res.status(200).json({
      success: true,

      message:
        "Upgrade request approved successfully.",

      data: result,
    });
  } catch (error) {
    console.error(
      "APPROVE UPGRADE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve upgrade request.",
      error: error.message,
    });
  }
};

// ==========================================
// REJECT UPGRADE REQUEST
// ==========================================
const rejectUpgradeRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    const approvedBy =
      req.user.userId || req.user.id;

    const { rejectionReason } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Invalid upgrade request ID.",
      });
    }

    if (!approvedBy) {
      return res.status(401).json({
        success: false,
        message:
          "Super Admin information not found.",
      });
    }

    if (!rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Rejection reason is required.",
      });
    }

    // ==========================================
    // GET REQUEST
    // ==========================================
    const upgradeRequest =
      await prisma.subscriptionUpgradeRequest.findUnique({
        where: {
          id: requestId,
        },

        include: {
          company: true,
          currentPlan: true,
          requestedPlan: true,
        },
      });

    if (!upgradeRequest) {
      return res.status(404).json({
        success: false,
        message:
          "Upgrade request not found.",
      });
    }

    // ==========================================
    // ONLY PENDING CAN BE REJECTED
    // ==========================================
    if (upgradeRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending upgrade requests can be rejected.",
      });
    }

    // ==========================================
    // TRANSACTION
    // ==========================================
    const result = await prisma.$transaction(
      async (tx) => {
        // ----------------------------------------
        // UPDATE REQUEST
        // ----------------------------------------
        const updatedRequest =
          await tx.subscriptionUpgradeRequest.update({
            where: {
              id: requestId,
            },

            data: {
              status: "REJECTED",

              approvedBy,

              rejectionReason:
                rejectionReason.trim(),
            },

            include: {
              company: true,
              currentPlan: true,
              requestedPlan: true,
            },
          });

        // ========================================
        // CREATE CRM USER NOTIFICATION
        // ========================================
        await tx.userNotification.create({
          data: {
            userId:
              upgradeRequest.requestedBy,

            title:
              "Upgrade Request Rejected",

            message: `Your upgrade request for ${upgradeRequest.requestedPlan.planName} was rejected. Reason: ${rejectionReason.trim()}`,

            type: "SYSTEM",

            isRead: false,
          },
        });

        return {
          updatedRequest,
        };
      }
    );

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    return res.status(200).json({
      success: true,

      message:
        "Upgrade request rejected successfully.",

      data: result,
    });
  } catch (error) {
    console.error(
      "REJECT UPGRADE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject upgrade request.",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getUpgradeRequests,
  getUpgradeRequestById,
  approveUpgradeRequest,
  rejectUpgradeRequest,
};