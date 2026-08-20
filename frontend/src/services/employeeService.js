import api from "../api/axios";

const API_URL = "/employees";

export const getEmployees = async () => {
  const res = await api.get(API_URL);

  return res.data;
};

export const getEmployee = async (id) => {
  const res = await api.get(`${API_URL}/${id}`);

  return res.data;
};

export const createEmployee = async (data) => {
  const res = await api.post(API_URL, data);

  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await api.put(`${API_URL}/${id}`, data);

  return res.data;
};

export const deleteEmployee = async (employeeId) => {
  const res = await api.delete(`${API_URL}/${employeeId}`);

  return res.data;
};

export const changeEmployeeStatus = async (id,data) => {
const res = await api.patch(`${API_URL}/${id}/status`, data);

return res.data;
};