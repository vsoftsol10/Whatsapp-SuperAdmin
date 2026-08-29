
import { MoreVertical } from "lucide-react";
import CompanyActionMenu from "./CompanyActionMenu";

export default function CompanyTable({
  companies,
  openMenu,
  setOpenMenu,
  onView,
  onEdit,
  onStatus,
  onDelete,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "INACTIVE":
        return "bg-gray-100 text-gray-700";

      case "EXPIRED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Trial":
        return "bg-yellow-100 text-yellow-700";

      case "Starter":
        return "bg-blue-100 text-blue-700";

      case "Professional":
        return "bg-green-100 text-green-700";

      case "Enterprise":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className="
        overflow-visible
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full">

          {/* =========================
              HEADER
          ========================= */}

          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Company
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Company ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Owner
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Plan
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Expiry
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>

            </tr>
          </thead>

          {/* =========================
              BODY
          ========================= */}

          <tbody className="divide-y divide-gray-100">

            {companies.map((company, index) => {

              const isMenuOpen =
                openMenu === company.companyId;

              // Last two rows should open upward
              const isLastRow =
                index >= companies.length - 2;

              return (
                <tr
                  key={company.companyId}
                  className="
                    transition
                    hover:bg-gray-50
                  "
                >

                  {/* =========================
                      COMPANY
                  ========================= */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-green-100
                          font-bold
                          text-green-700
                        "
                      >
                        {company.companyName?.charAt(0)}
                      </div>

                      <div>

                        <p className="font-semibold text-gray-900">
                          {company.companyName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {company.email}
                        </p>

                      </div>

                    </div>
                  </td>

                  {/* =========================
                      COMPANY ID
                  ========================= */}

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-800">
                      {company.companyId}
                    </span>
                  </td>

                  {/* =========================
                      OWNER
                  ========================= */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {company.ownerName}
                  </td>

                  {/* =========================
                      PLAN
                  ========================= */}

                  <td className="px-6 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${getPlanColor(company.plan)}
                      `}
                    >
                      {company.plan}
                    </span>
                  </td>

                  {/* =========================
                      STATUS
                  ========================= */}

                  <td className="px-6 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${getStatusColor(company.status)}
                      `}
                    >
                      {company.status}
                    </span>
                  </td>

                  {/* =========================
                      EXPIRY
                  ========================= */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {company.expiryDate
                      ? new Date(
                          company.expiryDate
                        ).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  {/* =========================
                      ACTION
                  ========================= */}

                  <td
                    className="
                      relative
                      px-6
                      py-4
                      text-right
                    "
                  >

                    <div className="relative inline-flex">

                      {/* Three dots */}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          setOpenMenu(
                            isMenuOpen
                              ? null
                              : company.companyId
                          );
                        }}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-lg
                          p-2
                          text-gray-600
                          transition
                          hover:bg-gray-100
                        "
                        aria-label="Company actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* =========================
                          ACTION MENU
                      ========================= */}

                      {isMenuOpen && (
                        <CompanyActionMenu
                          company={company}
                          onView={onView}
                          onEdit={onEdit}
                          onStatus={onStatus}
                          onDelete={onDelete}
                          onClose={() =>
                            setOpenMenu(null)
                          }
                          isLastRow={isLastRow}
                        />
                      )}

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>
      </div>
    </div>
  );
}
