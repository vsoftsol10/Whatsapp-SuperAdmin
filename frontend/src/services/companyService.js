import api from "../api/axios";

export const getCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export const getCompanyStats = async () => {
  const response = await api.get("/companies/stats");
  return response.data;
};

// GET SINGLE COMPANY + FULL SUBSCRIPTION HISTORY
export const getCompanyById = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

export const createCompany = async (data) => {
  const response = await api.post("/companies", data);
  return response.data;
};

export const updateCompany = async (companyId, data) => {
  const response = await api.put(`/companies/${companyId}`, data);
  return response.data;
};

export const changeCompanyStatus = async (companyId, status) => {
  const response = await api.patch(
    `/companies/${companyId}/status`,
    {
      status
    }
  );

  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await api.delete(
    `/companies/${companyId}`
  );

  return response.data;
};