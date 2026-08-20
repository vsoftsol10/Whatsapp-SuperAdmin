import api from "../api/axios";

// GET ALL PAYMENTS
export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

// GET SINGLE PAYMENT
export const getPayment = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

// CREATE PAYMENT
export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

// UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (id, paymentData) => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data;
};