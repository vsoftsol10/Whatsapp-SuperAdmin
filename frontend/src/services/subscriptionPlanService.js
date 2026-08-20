import api from "../api/axios";

export const getSubscriptionPlans = async () => {
  const { data } = await api.get("/subscription-plans");
  return data;
};

export const createSubscriptionPlan = async (planData) => {
  const { data } = await api.post("/subscription-plans", planData);
  return data;
};

export const updateSubscriptionPlan = async (id, planData) => {
  const { data } = await api.put(`/subscription-plans/${id}`, planData);
  return data;
};

export const deleteSubscriptionPlan = async (id) => {
  const { data } = await api.delete(`/subscription-plans/${id}`);
  return data;
};