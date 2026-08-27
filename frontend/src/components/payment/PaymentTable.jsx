import { Eye } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";
import PageLoader from "../common/PageLoader";

export default function PaymentTable({
  payments = [],
  loading,
  onView,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <PageLoader label="Loading payments..." />
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <p className="text-gray-500">No payments found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Payment ID</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  {payment.paymentId}
                </td>

                <td className="px-6 py-4">
                  {payment.companyName}
                </td>

                <td className="px-6 py-4">
                  {payment.plan?.planName || "-"}
                </td>

                <td className="px-6 py-4 font-semibold">
                  ₹{Number(payment.totalAmount).toLocaleString("en-IN")}
                </td>

                <td className="px-6 py-4">
                  {payment.paymentMethod}
                </td>

                <td className="px-6 py-4">
                  <PaymentStatusBadge
                    status={payment.paymentStatus}
                  />
                </td>

                <td className="px-6 py-4">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onView(payment)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
