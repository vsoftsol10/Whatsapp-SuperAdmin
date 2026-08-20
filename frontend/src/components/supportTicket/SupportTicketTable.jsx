import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SupportTicketTable({
  tickets = [],
  loading,
  onView,
  onEdit,
  onAssign,
  onStatus,
  onDelete
}) {

  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  const getPriorityStyle = (priority) => {

    if (priority === "LOW")
      return "bg-green-100 text-green-700";

    if (priority === "MEDIUM")
      return "bg-yellow-100 text-yellow-700";

    if (priority === "HIGH")
      return "bg-orange-100 text-orange-700";

    if (priority === "URGENT")
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";

  };

  const getStatusStyle = (status) => {

    if (status === "OPEN")
      return "bg-yellow-100 text-yellow-700";

    if (status === "IN_PROGRESS")
      return "bg-blue-100 text-blue-700";

    if (status === "RESOLVED")
      return "bg-green-100 text-green-700";

    if (status === "CLOSED")
      return "bg-gray-200 text-gray-700";

    return "bg-gray-100 text-gray-700";

  };

  if (loading) {

    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        Loading tickets...
      </div>
    );

  }

  if (tickets.length === 0) {

    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        No support tickets found.
      </div>
    );

  }

  return (

    <div
      ref={menuRef}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Ticket ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Company
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Title
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Priority
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Assigned To
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Created
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {tickets.map((ticket) => (

              <tr
                key={ticket.id}
                className="hover:bg-gray-50"
              >

                <td className="px-6 py-4 font-semibold">
                  #{ticket.id}
                </td>

                <td className="px-6 py-4">
                  {ticket.company?.companyName}
                </td>

                <td className="px-6 py-4">
                  {ticket.title}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(ticket.status)}`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>

                </td>

                <td className="px-6 py-4">

                  {ticket.assignedTo
                    ? ticket.assignedTo.name
                    : "-"}

                </td>

                <td className="px-6 py-4">

                  {new Date(
                    ticket.createdAt
                  ).toLocaleDateString("en-IN")}

                </td>

                <td className="relative px-6 py-4 text-center">

                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === ticket.id
                          ? null
                          : ticket.id
                      )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === ticket.id && (

                    <div className="absolute right-6 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onView(ticket);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onEdit(ticket);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onDelete(ticket);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}