import api from "./axios";

const API_URL = "/dashboard";

export const getDashboard = async () => {
  const res = await api.get(API_URL);

  return res.data.data;
};
