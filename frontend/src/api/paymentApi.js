import axios from "axios";

const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get all payments
export const getPayments = async () => {
  const response = await paymentApi.get("/payments");
  return response.data;
};

// Get payment stats
export const getPaymentStats = async () => {
  const response = await paymentApi.get("/payments/stats");
  return response.data;
};

// Get payment by ID
export const getPaymentById = async (id) => {
  const response = await paymentApi.get(`/payments/${id}`);
  return response.data;
};

// Create payment
export const createPayment = async (data) => {
  const response = await paymentApi.post("/payments", data);
  return response.data;
};

// Update payment
export const updatePayment = async (id, data) => {
  const response = await paymentApi.put(`/payments/${id}`, data);
  return response.data;
};

// Delete payment
export const deletePayment = async (id) => {
  const response = await paymentApi.delete(`/payments/${id}`);
  return response.data;
};