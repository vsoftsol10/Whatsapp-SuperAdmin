import api from "../api/axios";

const API_URL = "/support-tickets";

export const getSupportTickets = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const getSupportTicket = async (id) => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};

export const createSupportTicket = async (data) => {
  const res = await api.post(API_URL, data);
  return res.data;
};

export const updateSupportTicket = async (id, data) => {
  const res = await api.put(`${API_URL}/${id}`, data);

  return res.data;
};

export const assignSupportTicket = async (
  id,
  employeeId
) => {
  const res = await api.patch(
    `${API_URL}/${id}/assign`,
    { employeeId }
  );

  return res.data;
};

export const changeSupportTicketStatus = async (
  id,
  status
) => {
  const res = await api.patch(
    `${API_URL}/${id}/status`,
    { status }
  );

  return res.data;
};

export const deleteSupportTicket = async (id) => {
  const res = await api.delete(`${API_URL}/${id}`);

  return res.data;
};
