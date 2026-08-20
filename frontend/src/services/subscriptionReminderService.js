
import api from "../api/axios";

export const sendSubscriptionReminder = async (subscriptionId, data) => {
  const response = await api.post(
    `/subscriptions/${subscriptionId}/reminder`,
    data
  );

  return response.data;
};

export const getSubscriptionReminders = async (subscriptionId) => {
  const response = await api.get(
    `/subscriptions/${subscriptionId}/reminders`
  );

  return response.data;
};

