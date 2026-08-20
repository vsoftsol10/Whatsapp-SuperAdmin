import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EmployeeTable({
  employees = [],
  loading,
  onView,
  onEdit,
  onStatus,
  onDelete
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const getStatusStyle = (status) => {
    if (status === "ACTIVE")
      return "bg-green-100 text-green-700";

    if (status === "INACTIVE")
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-20 text-center shadow-sm">
        <p className="text-gray-500">
          Loading employees...
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-20 text-center shadow-sm">
        <p className="text-gray-500">
          No employees found.
        </p>
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
                Employee ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Name
              </th>


              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Status
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

            {employees.map((employee) => (

              <tr
                key={employee.id}
                className="hover:bg-gray-50"
              >

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {employee.employeeId}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {employee.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {employee.email}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {employee.phone}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(
                    employee.createdAt
                  ).toLocaleDateString("en-IN")}
                </td>

                <td className="relative px-6 py-4 text-center">

                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === employee.id
                          ? null
                          : employee.id
                      )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === employee.id && (

                    <div className="absolute right-6 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onView(employee);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onEdit(employee);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onStatus(employee);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                      >
                        {employee.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onDelete(employee);
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