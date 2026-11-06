import api from "./axios";

// ---------- Settings ----------
export const getAiConfig = async () => (await api.get("/ai-management/config")).data;
export const saveAiConfig = async (payload) =>
  (await api.patch("/ai-management/config", payload)).data;
export const testAiConnection = async (payload) =>
  (await api.post("/ai-management/config/test", payload)).data;

// ---------- Knowledge base ----------
export const listDocs = async () => (await api.get("/ai-management/docs")).data;
export const getDoc = async (id) => (await api.get(`/ai-management/docs/${id}`)).data;
export const createDoc = async (payload) =>
  (await api.post("/ai-management/docs", payload)).data;
export const updateDoc = async (id, payload) =>
  (await api.patch(`/ai-management/docs/${id}`, payload)).data;
export const deleteDoc = async (id) =>
  (await api.delete(`/ai-management/docs/${id}`)).data;
export const reindexDocs = async () =>
  (await api.post("/ai-management/docs/reindex")).data;
export const testChat = async (question) =>
  (await api.post("/ai-management/docs/test-chat", { question })).data;

// ---------- Companies ----------
export const listTenants = async (search = "") =>
  (await api.get("/ai-management/tenants", { params: { search } })).data;
export const updateTenant = async (companyId, payload) =>
  (await api.patch(`/ai-management/tenants/${companyId}`, payload)).data;

// ---------- Usage ----------
export const getUsage = async (days = 30) =>
  (await api.get("/ai-management/usage", { params: { days } })).data;
export const getUnanswered = async () =>
  (await api.get("/ai-management/unanswered")).data;

export const apiError = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || fallback;