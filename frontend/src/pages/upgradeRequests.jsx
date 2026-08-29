import { useEffect, useState } from "react";
import {
  fetchUpgradeRequests,
  approveRequest,
  rejectRequest,
} from "../services/upgradeRequestService";
import PageLoader from "../components/common/PageLoader";

function UpgradeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data = await fetchUpgradeRequests();

      setRequests(data || []);
    } catch (error) {
      console.error("Failed to fetch upgrade requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const result = await approveRequest(
        id,
        "Upgrade approved by Super Admin."
      );

      if (result.success) {
        alert("Upgrade request approved successfully");
        loadRequests();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      const result = await rejectRequest(id, reason);

      if (result.success) {
        alert("Upgrade request rejected");
        loadRequests();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to reject request");
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <PageLoader variant="page" label="Loading upgrade requests..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">
        Upgrade Requests
      </h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-[720px] w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Company
              </th>

              <th className="p-3">
                Current Plan
              </th>

              <th className="p-3">
                Requested Plan
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-6 text-gray-500"
                >
                  No upgrade requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t"
                >
                  <td className="p-3">
                    <div className="font-semibold">
                      {request.company.companyName}
                    </div>

                    <div className="text-sm text-gray-500">
                      {request.company.email}
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    {request.currentPlan.planName}
                  </td>

                  <td className="p-3 text-center">
                    {request.requestedPlan.planName}
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                      {request.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    {request.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(request.id)
                          }
                          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(request.id)
                          }
                          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpgradeRequests;
