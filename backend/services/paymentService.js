const prisma = require("../config/prisma");

// GET ALL PAYMENTS
const getPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      company: true,
      subscription: {
        include: {
          plan: true,
        },
      },
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// GET PAYMENT BY ID
const getPaymentById = async (id) => {
  return await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      subscription: {
        include: {
          plan: true,
        },
      },
      plan: true,
    },
  });
};

// CREATE PAYMENT
const createPayment = async (data) => {
  return await prisma.payment.create({
    data: {
      paymentId: data.paymentId,

      companyId: data.companyId || null,
      subscriptionId: data.subscriptionId || null,
      planId: data.planId || null,

      companyName: data.companyName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,

      amount: Number(data.amount),
      tax: Number(data.tax || 0),
      discount: Number(data.discount || 0),
      totalAmount: Number(data.totalAmount),

      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || "PENDING",

      gateway: data.gateway || null,
      transactionId: data.transactionId || null,
      invoiceNumber: data.invoiceNumber || null,

      // Razorpay details
      razorpayOrderId: data.razorpayOrderId || null,
      razorpayPaymentId: data.razorpayPaymentId || null,

      paidAt: data.paidAt || null,
    },
  });
};

// UPDATE PAYMENT STATUS
const updatePaymentStatus = async (
  id,
  paymentStatus,
  transactionId,
  gateway,
  razorpayOrderId,
  razorpayPaymentId
) => {
  return await prisma.payment.update({
    where: {
      id,
    },
    data: {
      paymentStatus,

      transactionId: transactionId || null,
      gateway: gateway || null,

      // Razorpay details
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,

      paidAt:
        paymentStatus === "PAID"
          ? new Date()
          : null,
    },
  });
};

// DELETE PAYMENT
const deletePayment = async (id) => {
  return await prisma.payment.delete({
    where: {
      id,
    },
  });
};

const getPaymentStats = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalPayments,
    paidPayments,
    revenueResult,
    thisMonthResult,
  ] = await Promise.all([
    prisma.payment.count(),

    prisma.payment.count({
      where: {
        paymentStatus: "PAID",
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        totalAmount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        paymentStatus: "PAID",
        paidAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  return {
    totalPayments,
    paidPayments,
    totalRevenue: revenueResult._sum.totalAmount || 0,
    thisMonthPayment: thisMonthResult._sum.totalAmount || 0,
  };
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  deletePayment,
  getPaymentStats,
};