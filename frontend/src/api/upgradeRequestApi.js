import apiClient from "./axios";

export const getUpgradeRequests = async () => {
  const response = await apiClient.get(
    "/superadmin/upgrade-requests"
  );
  return response.data;
};

export const approveUpgradeRequest = async (id, remarks) => {
  const response = await apiClient.patch(
    `/superadmin/upgrade-requests/${id}/approve`,
    {
      remarks,
    }
  );
  return response.data;
};

export const rejectUpgradeRequest = async (
  id,
  rejectionReason
) => {
  const response = await apiClient.patch(
    `/superadmin/upgrade-requests/${id}/reject`,
    {
      rejectionReason,
    }
  );
  return response.data;
};