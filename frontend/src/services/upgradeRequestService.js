import {
  getUpgradeRequests,
  approveUpgradeRequest,
  rejectUpgradeRequest,
} from "../api/upgradeRequestApi";

export const fetchUpgradeRequests = async () => {
  const response = await getUpgradeRequests();
  return response.data;
};

export const approveRequest = async (id, remarks) => {
  const response = await approveUpgradeRequest(id, remarks);
  return response.data;
};

export const rejectRequest = async (id, reason) => {
  const response = await rejectUpgradeRequest(id, reason);
  return response.data;
};