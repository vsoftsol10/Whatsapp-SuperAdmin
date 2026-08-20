import api from "../api/axios";


// GET ALL SUBSCRIPTIONS
export const getSubscriptions = async () => {
  const response = await api.get("/subscriptions");
  return response.data;
};


// GET SUBSCRIPTION STATS
export const getSubscriptionStats = async () => {
  const response = await api.get("/subscriptions/stats");
  return response.data;
};