// import { MoreVertical } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// export default function SupportTicketTable({
//   tickets = [],
//   loading,
//   onView,
//   onEdit,
//   onAssign,
//   onStatus,
//   onDelete
// }) {

//   const [openMenu, setOpenMenu] = useState(null);

//   const menuRef = useRef(null);

//   useEffect(() => {

//     const handleClickOutside = (e) => {

//       if (
//         menuRef.current &&
//         !menuRef.current.contains(e.target)
//       ) {
//         setOpenMenu(null);
//       }

//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );

//     return () =>
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );

//   }, []);

//   const getPriorityStyle = (priority) => {

//     if (priority === "LOW")
//       return "bg-green-100 text-green-700";

//     if (priority === "MEDIUM")
//       return "bg-yellow-100 text-yellow-700";

//     if (priority === "HIGH")
//       return "bg-orange-100 text-orange-700";

//     if (priority === "URGENT")
//       return "bg-red-100 text-red-700";

//     return "bg-gray-100 text-gray-700";

//   };

//   const getStatusStyle = (status) => {

//     if (status === "OPEN")
//       return "bg-yellow-100 text-yellow-700";

//     if (status === "IN_PROGRESS")
//       return "bg-blue-100 text-blue-700";

//     if (status === "RESOLVED")
//       return "bg-green-100 text-green-700";

//     if (status === "CLOSED")
//       return "bg-gray-200 text-gray-700";

//     return "bg-gray-100 text-gray-700";

//   };

//   if (loading) {

//     return (
//       <div className="rounded-2xl bg-white p-10 text-center shadow">
//         Loading tickets...
//       </div>
//     );

//   }

//   if (tickets.length === 0) {

//     return (
//       <div className="rounded-2xl bg-white p-10 text-center shadow">
//         No support tickets found.
//       </div>
//     );

//   }

//   return (

//     <div
//       ref={menuRef}
//       className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
//     >

//       <div className="overflow-x-auto">

//         <table className="min-w-full">

//           <thead className="bg-gray-50">

//             <tr>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Ticket ID
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Company
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Title
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Priority
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Status
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Assigned To
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Created
//               </th>

//               <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
//                 Action
//               </th>

//             </tr>

//           </thead>

//           <tbody className="divide-y divide-gray-100">

//             {tickets.map((ticket) => (

//               <tr
//                 key={ticket.id}
//                 className="hover:bg-gray-50"
//               >

//                 <td className="px-6 py-4 font-semibold">
//                   #{ticket.id}
//                 </td>

//                 <td className="px-6 py-4">
//                   {ticket.company?.companyName}
//                 </td>

//                 <td className="px-6 py-4">
//                   {ticket.title}
//                 </td>

//                 <td className="px-6 py-4">

//                   <span
//                     className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(ticket.priority)}`}
//                   >
//                     {ticket.priority}
//                   </span>

//                 </td>

//                 <td className="px-6 py-4">

//                   <span
//                     className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(ticket.status)}`}
//                   >
//                     {ticket.status.replace("_", " ")}
//                   </span>

//                 </td>

//                 <td className="px-6 py-4">

//                   {ticket.assignedTo
//                     ? ticket.assignedTo.name
//                     : "-"}

//                 </td>

//                 <td className="px-6 py-4">

//                   {new Date(
//                     ticket.createdAt
//                   ).toLocaleDateString("en-IN")}

//                 </td>

//                 <td className="relative px-6 py-4 text-center">

//                   <button
//                     onClick={() =>
//                       setOpenMenu(
//                         openMenu === ticket.id
//                           ? null
//                           : ticket.id
//                       )
//                     }
//                     className="rounded-lg p-2 hover:bg-gray-100"
//                   >
//                     <MoreVertical size={18} />
//                   </button>

//                   {openMenu === ticket.id && (

//                     <div className="absolute right-6 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

//                       <button
//                         onClick={() => {
//                           setOpenMenu(null);
//                           onView(ticket);
//                         }}
//                         className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
//                       >
//                         View
//                       </button>

//                       <button
//                         onClick={() => {
//                           setOpenMenu(null);
//                           onEdit(ticket);
//                         }}
//                         className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => {
//                           setOpenMenu(null);
//                           onDelete(ticket);
//                         }}
//                         className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
//                       >
//                         Delete
//                       </button>

//                     </div>

//                   )}

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//     </div>

//   );

// }

import { MoreVertical } from "lucide-react";
import PageLoader from "../common/PageLoader";
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

  // Ref only for the currently opened action menu
  const menuRef = useRef(null);

  // =========================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // =========================

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

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // CLOSE MENU WHEN ESC IS PRESSED
  // =========================

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =========================
  // PRIORITY STYLE
  // =========================

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

  // =========================
  // STATUS STYLE
  // =========================

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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <PageLoader label="Loading tickets..." />
      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        No support tickets found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* =========================
              HEADER
          ========================= */}

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

          {/* =========================
              BODY
          ========================= */}

          <tbody className="divide-y divide-gray-100">

            {tickets.map((ticket, index) => {

              const isMenuOpen =
                openMenu === ticket.id;

              // Open upward for last two rows
              const isLastTwoRows =
                index >= tickets.length - 2;

              return (

                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50"
                >

                  {/* TICKET ID */}

                  <td className="px-6 py-4 font-semibold">
                    #{ticket.id}
                  </td>

                  {/* COMPANY */}

                  <td className="px-6 py-4">
                    {ticket.company?.companyName}
                  </td>

                  {/* TITLE */}

                  <td className="px-6 py-4">
                    {ticket.title}
                  </td>

                  {/* PRIORITY */}

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>

                  </td>

                  {/* ASSIGNED TO */}

                  <td className="px-6 py-4">

                    {ticket.assignedTo
                      ? ticket.assignedTo.name
                      : "-"}

                  </td>

                  {/* CREATED */}

                  <td className="px-6 py-4">

                    {new Date(
                      ticket.createdAt
                    ).toLocaleDateString("en-IN")}

                  </td>

                  {/* ACTION */}

                  <td className="relative px-6 py-4 text-center">

                    {/* =========================
                        ACTION MENU CONTAINER
                    ========================= */}

                    <div
                      ref={
                        isMenuOpen
                          ? menuRef
                          : null
                      }
                      className="relative inline-flex"
                    >

                      {/* THREE DOT BUTTON */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setOpenMenu(
                            isMenuOpen
                              ? null
                              : ticket.id
                          );
                        }}
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                        aria-label="Ticket actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* =========================
                          ACTION POPUP
                      ========================= */}

                      {isMenuOpen && (

                        <div
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className={`
                            absolute
                            right-0
                            z-[9999]
                            w-48
                            overflow-hidden
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            shadow-xl

                            ${
                              isLastTwoRows
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
                              onView(ticket);
                            }}
                            className="block w-full px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                          >
                            View
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenu(null);
                              onEdit(ticket);
                            }}
                            className="block w-full px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenu(null);
                              onDelete(ticket);
                            }}
                            className="block w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </div>

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
