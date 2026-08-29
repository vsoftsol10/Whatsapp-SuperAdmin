import {
  LifeBuoy,
  Building2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function SupportTicketTable({
  tickets = [],
}) {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "URGENT":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700";

      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";

      case "RESOLVED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <LifeBuoy
              size={22}
              className="text-[#25D366]"
            />
          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Recent Support Tickets
            </h2>

            <p className="text-sm text-gray-500">
              Latest customer support requests
            </p>

          </div>

        </div>

        <div className="rounded-full bg-green-50 px-4 py-2">

          <span className="text-sm font-semibold text-[#25D366]">
            {tickets.length} Tickets
          </span>

        </div>

      </div>

      {/* Table */}

      {tickets.length > 0 ? (
        <div className="overflow-x-auto">

          <table className="min-w-[680px] w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Company
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Priority
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-t border-gray-100 transition hover:bg-green-50/40"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">

                        <Building2
                          size={18}
                          className="text-[#25D366]"
                        />

                      </div>

                      <div>

                        <p className="font-medium text-gray-900">
                          {ticket.companyName}
                        </p>

                        <p className="text-xs text-gray-400">
                          Company
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-5">

                    <p className="font-medium text-gray-800">
                      {ticket.subject}
                    </p>

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">

          <CheckCircle2
            size={55}
            className="mb-4 text-gray-300"
          />

          <h3 className="text-lg font-semibold text-gray-700">
            No Support Tickets
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            New support requests will appear here.
          </p>

        </div>
      )}
    </div>
  );
}
