import React, { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";

const AuditLogTable = ({
  auditLogs = [],
  onView,
  onDelete,
}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState("down");

  const menuRef = useRef(null);

  // ==========================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // GET ACTOR NAME
  // ==========================================

  const getActorName = (log) => {
    if (log.actorName) {
      return log.actorName;
    }

    if (log.actorType === "SUPER_ADMIN") {
      return "Super Admin";
    }

    if (log.actorType === "EMPLOYEE") {
      return "Employee";
    }

    return "Unknown";
  };

  // ==========================================
  // GET ACTOR TYPE LABEL
  // Used only for small text below name
  // ==========================================

  const getActorTypeLabel = (actorType) => {
    switch (actorType) {
      case "SUPER_ADMIN":
        return "Super Admin";

      case "EMPLOYEE":
        return "Employee";

      default:
        return "Unknown";
    }
  };

  // ==========================================
  // ACTOR NAME STYLE
  // ==========================================

  const getActorNameStyle = (actorType) => {
    switch (actorType) {
      case "SUPER_ADMIN":
        return "text-purple-700";

      case "EMPLOYEE":
        return "text-blue-700";

      default:
        return "text-gray-600";
    }
  };

  // ==========================================
  // ACTION BADGE STYLE
  // ==========================================

  const getActionBadgeStyle = (action) => {
    switch (action) {
      // ======================================
      // AUTHENTICATION
      // ======================================

      case "LOGIN_SUCCESS":
        return "bg-green-100 text-green-700";

      case "LOGIN_FAILED":
        return "bg-red-100 text-red-700";

      case "PASSWORD_RESET":
        return "bg-orange-100 text-orange-700";

      case "PASSWORD_RESET_REQUESTED":
        return "bg-yellow-100 text-yellow-700";

      // ======================================
      // COMPANY
      // ======================================

      case "COMPANY_CREATED":
        return "bg-emerald-100 text-emerald-700";

      case "COMPANY_UPDATED":
        return "bg-blue-100 text-blue-700";

      case "COMPANY_DELETED":
        return "bg-red-100 text-red-700";

      case "COMPANY_STATUS_CHANGED":
        return "bg-yellow-100 text-yellow-700";

      // ======================================
      // EMPLOYEE
      // ======================================

      case "EMPLOYEE_CREATED":
        return "bg-emerald-100 text-emerald-700";

      case "EMPLOYEE_UPDATED":
        return "bg-blue-100 text-blue-700";

      case "EMPLOYEE_DELETED":
        return "bg-red-100 text-red-700";

      case "EMPLOYEE_STATUS_CHANGED":
        return "bg-yellow-100 text-yellow-700";

      // ======================================
      // SUPPORT TICKET
      // ======================================

      case "SUPPORT_TICKET_CREATED":
        return "bg-emerald-100 text-emerald-700";

      case "SUPPORT_TICKET_UPDATED":
        return "bg-blue-100 text-blue-700";

      case "SUPPORT_TICKET_DELETED":
        return "bg-red-100 text-red-700";

      case "SUPPORT_TICKET_ASSIGNED":
        return "bg-purple-100 text-purple-700";

      case "SUPPORT_TICKET_STATUS_CHANGED":
        return "bg-yellow-100 text-yellow-700";

      // ======================================
      // DEFAULT
      // ======================================

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ==========================================
  // FORMAT ACTION NAME
  // ==========================================

  const formatAction = (action) => {
    if (!action) {
      return "-";
    }

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ==========================================
  // FORMAT ENTITY NAME
  // ==========================================

  const formatEntityType = (entityType) => {
    if (!entityType) {
      return "-";
    }

    return entityType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ==========================================
  // TOGGLE 3-DOT MENU
  // ==========================================

  const toggleMenu = (event, id, index) => {
    event.stopPropagation();

    // Close if already open
    if (openMenu === id) {
      setOpenMenu(null);
      return;
    }

    // Open upward for last two rows
    if (index >= auditLogs.length - 2) {
      setMenuPosition("up");
    } else {
      setMenuPosition("down");
    }

    setOpenMenu(id);
  };

  // ==========================================
  // NO DATA
  // ==========================================

  if (!auditLogs.length) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-center text-gray-500">
          No audit logs found
        </p>
      </div>
    );
  }

  // ==========================================
  // TABLE
  // ==========================================

  return (
    <div className="relative w-full overflow-visible rounded-xl bg-white shadow-sm">

      <table className="min-w-[900px] w-full table-fixed text-left text-sm">

        {/* ======================================
            TABLE HEADER
        ====================================== */}

        <thead className="border-b border-gray-200 bg-gray-50">

          <tr>

            {/* DATE */}

            <th className="w-[17%] px-4 py-4 font-semibold text-gray-600">
              Date & Time
            </th>

            {/* ACTOR */}

            <th className="w-[20%] px-4 py-4 font-semibold text-gray-600">
              Actor
            </th>

            {/* ACTION */}

            <th className="w-[16%] px-4 py-4 font-semibold text-gray-600">
              Action
            </th>

            {/* ENTITY */}

            <th className="w-[13%] px-4 py-4 font-semibold text-gray-600">
              Entity
            </th>

            {/* DESCRIPTION */}

            <th className="w-[27%] px-4 py-4 font-semibold text-gray-600">
              Description
            </th>

            {/* MORE */}

            <th className="w-[7%] px-4 py-4 text-center font-semibold text-gray-600">
              More
            </th>

          </tr>

        </thead>

        {/* ======================================
            TABLE BODY
        ====================================== */}

        <tbody className="divide-y divide-gray-100">

          {auditLogs.map((log, index) => (

            <tr
              key={log.id}
              className="transition hover:bg-gray-50"
            >

              {/* =================================
                  DATE & TIME
              ================================= */}

              <td className="px-4 py-4 text-gray-600">

                <div
                  className="truncate"
                  title={
                    log.createdAt
                      ? new Date(
                          log.createdAt
                        ).toLocaleString()
                      : "-"
                  }
                >
                  {log.createdAt
                    ? new Date(
                        log.createdAt
                      ).toLocaleString()
                    : "-"}
                </div>

              </td>

              {/* =================================
                  ACTOR
              ================================= */}

              <td className="px-4 py-4">

                <div className="flex min-w-0 flex-col">

                  {/* ACTOR NAME */}

                  <span
                    className={`max-w-[180px] truncate text-sm font-semibold ${getActorNameStyle(
                      log.actorType
                    )}`}
                    title={getActorName(log)}
                  >
                    {getActorName(log)}
                  </span>

                  {/* ACTOR TYPE */}

                  <span
                    className="mt-0.5 text-xs text-gray-400"
                    title={getActorTypeLabel(log.actorType)}
                  >
                    {getActorTypeLabel(log.actorType)}
                  </span>

                </div>

              </td>

              {/* =================================
                  ACTION
              ================================= */}

              <td className="px-4 py-4">

                <span
                  className={`inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-xs font-semibold ${getActionBadgeStyle(
                    log.action
                  )}`}
                  title={log.action || "-"}
                >
                  {formatAction(log.action)}
                </span>

              </td>

              {/* =================================
                  ENTITY
              ================================= */}

              <td className="px-4 py-4">

                <span
                  className="inline-block max-w-full truncate rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                  title={
                    log.entityType || "-"
                  }
                >
                  {formatEntityType(
                    log.entityType
                  )}
                </span>

              </td>

              {/* =================================
                  DESCRIPTION
              ================================= */}

              <td className="px-4 py-4">

                <p
                  className="truncate text-gray-600"
                  title={
                    log.description || ""
                  }
                >
                  {log.description || "-"}
                </p>

              </td>

              {/* =================================
                  MORE MENU
              ================================= */}

              <td className="relative px-4 py-4 text-center">

                <div
                  className="relative inline-block"
                  ref={
                    openMenu === log.id
                      ? menuRef
                      : null
                  }
                >

                  {/* 3 DOT BUTTON */}

                  <button
                    type="button"
                    onClick={(event) =>
                      toggleMenu(
                        event,
                        log.id,
                        index
                      )
                    }
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                    title="More options"
                  >
                    <MoreVertical size={19} />
                  </button>

                  {/* DROPDOWN */}

                  {openMenu === log.id && (

                    <div
                      className={`
                        absolute
                        right-0
                        z-[9999]
                        w-36
                        overflow-hidden
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        py-1
                        text-left
                        shadow-xl
                        ${
                          menuPosition === "up"
                            ? "bottom-full mb-2"
                            : "top-full mt-2"
                        }
                      `}
                    >

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() => {

                          setOpenMenu(null);

                          if (onView) {
                            onView(log);
                          }

                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                      >

                        <Eye
                          size={16}
                          className="text-gray-500"
                        />

                        <span>
                          View
                        </span>

                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => {

                          setOpenMenu(null);

                          if (onDelete) {
                            onDelete(log);
                          }

                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                      >

                        <Trash2 size={16} />

                        <span>
                          Delete
                        </span>

                      </button>

                    </div>

                  )}

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default AuditLogTable;
