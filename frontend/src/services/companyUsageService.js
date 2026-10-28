import api from "../api/axios";

// All companies: connection status, campaigns, templates, AI usage
export const getCompanyUsage = async () => {
  const response = await api.get("/company-usage");
  return response.data;
};

// One company in detail (id = the company's numeric id)
export const getCompanyUsageDetail = async (id) => {
  const response = await api.get(`/company-usage/${id}`);
  return response.data;
};