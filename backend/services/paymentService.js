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
      paidAt: data.paidAt || null,
    },
  });
};

// UPDATE PAYMENT STATUS
const updatePaymentStatus = async (
  id,
  paymentStatus,
  transactionId,
  gateway
) => {
  return await prisma.payment.update({
    where: {
      id,
    },
    data: {
      paymentStatus,
      transactionId,
      gateway,
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

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  deletePayment,
};