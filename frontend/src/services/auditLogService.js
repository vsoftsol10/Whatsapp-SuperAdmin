import api from "../api/axios";

// ==========================================
// GET ALL AUDIT LOGS
// ==========================================

export const getAuditLogs = async () => {
  const response = await api.get("/audit-logs");

  return response.data;
};


// ==========================================
// GET SINGLE AUDIT LOG
// ==========================================

export const getAuditLogById = async (id) => {
  const response = await api.get(`/audit-logs/${id}`);

  return response.data;
};


// ==========================================
// DELETE AUDIT LOG
// ==========================================

export const deleteAuditLog = async (id) => {
  const response = await api.delete(`/audit-logs/${id}`);

  return response.data;
};