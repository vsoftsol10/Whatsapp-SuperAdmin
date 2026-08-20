

import { Bell } from "lucide-react";

export default function SubscriptionTable({ subscriptions = [], loading, onNotify }) {
  const getStatusStyle = (status) => {
    if (status === "ACTIVE") return "bg-green-100 text-green-700";
    if (status === "TRIAL") return "bg-yellow-100 text-yellow-700";
    if (status === "EXPIRED") return "bg-red-100 text-red-700";
    if (status === "CANCELLED") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  const getDaysLeft = (subscription) => {
    if (subscription.isExpired) {
      return "Expired";
    }

    if (subscription.remainingDays === 0) {
      return "Expires Today";
    }

    return `${subscription.remainingDays} Days`;
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">Loading subscriptions...</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No subscriptions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Company
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Plan
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Start Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Expiry Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Days Left
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Last Reminder
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {subscription.company?.companyName || "Unknown Company"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {subscription.company?.email || "-"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-800">
                    {subscription.plan?.planName || "-"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {subscription.startDate
                    ? new Date(subscription.startDate).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {subscription.expiryDate
                    ? new Date(subscription.expiryDate).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700">

                  </span>{getDaysLeft(subscription)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {subscription.reminders?.length > 0
                    ? new Date(
                      subscription.reminders[0].sentAt
                    ).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      subscription.status
                    )}`}
                  >
                    {subscription.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onNotify?.(subscription)}
                    title="Send Reminder"
                    className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-green-50 hover:text-green-600"
                  >
                    <Bell size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

