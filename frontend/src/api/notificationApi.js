import axiosInstance from "./axios";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data.notifications;
};

export const markAsRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}`);
  return response.data;
};