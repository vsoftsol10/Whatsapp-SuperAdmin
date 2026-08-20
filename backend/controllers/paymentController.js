const paymentService = require("../services/paymentService");

// GET ALL PAYMENTS
const getPayments = async (req, res) => {
  try {
    const payments = await paymentService.getPayments();

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.log("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

// GET PAYMENT BY ID
const getPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.log("Get payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
    });
  }
};

// CREATE PAYMENT
const createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.log("Create payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};

// UPDATE PAYMENT STATUS
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId, gateway } = req.body;

    const payment = await paymentService.updatePaymentStatus(
      req.params.id,
      paymentStatus,
      transactionId,
      gateway
    );

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.log("Update payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment",
    });
  }
};

// DELETE PAYMENT
const deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.id);

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.log("Delete payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
    });
  }
};

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
  deletePayment,
};