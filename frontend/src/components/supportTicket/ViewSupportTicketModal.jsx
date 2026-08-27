// import {
//   X,
//   Building2,
//   BadgeCheck,
//   AlertTriangle,
//   User,
//   Calendar,
//   FileText,
// } from "lucide-react";

// export default function ViewSupportTicketModal({
//   open,
//   ticket,
//   onClose,
// }) {
//   if (!open || !ticket) return null;

//   const getPriorityStyle = (priority) => {
//     if (priority === "LOW") return "bg-blue-100 text-blue-700";
//     if (priority === "MEDIUM") return "bg-yellow-100 text-yellow-700";
//     if (priority === "HIGH") return "bg-orange-100 text-orange-700";
//     if (priority === "URGENT") return "bg-red-100 text-red-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   const getStatusStyle = (status) => {
//     if (status === "OPEN") return "bg-blue-100 text-blue-700";
//     if (status === "IN_PROGRESS") return "bg-yellow-100 text-yellow-700";
//     if (status === "RESOLVED") return "bg-green-100 text-green-700";
//     if (status === "CLOSED") return "bg-gray-100 text-gray-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

//       <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

//         {/* Header */}

//         <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">

//           <div>

//             <h2 className="text-xl font-bold text-gray-900">
//               Support Ticket Details
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               View complete support ticket information.
//             </p>

//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 transition hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>

//         </div>

//         {/* Body */}

//         <div className="flex-1 overflow-y-auto p-6">

//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

//             <InfoCard
//               icon={<BadgeCheck size={18} />}
//               label="Ticket ID"
//               value={`#${ticket.id}`}
//             />

//             <InfoCard
//               icon={<Building2 size={18} />}
//               label="Company"
//               value={ticket.company?.companyName || "-"}
//             />

//             {/* Title */}

//             <div className="md:col-span-2">

//               <div className="rounded-xl border border-gray-200 p-4">

//                 <div className="mb-2 flex items-center gap-2">

//                   <FileText
//                     size={18}
//                     className="text-green-600"
//                   />

//                   <p className="font-semibold text-gray-700">
//                     Title
//                   </p>

//                 </div>

//                 <p className="text-sm text-gray-600">
//                   {ticket.title}
//                 </p>

//               </div>

//             </div>

//             {/* Description */}

//             <div className="md:col-span-2">

//               <div className="rounded-xl border border-gray-200 p-4">

//                 <div className="mb-2 flex items-center gap-2">

//                   <FileText
//                     size={18}
//                     className="text-green-600"
//                   />

//                   <p className="font-semibold text-gray-700">
//                     Description
//                   </p>

//                 </div>

//                 <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
//                   {ticket.description}
//                 </p>

//               </div>

//             </div>

//             {/* Priority */}

//             <div className="rounded-xl border border-gray-200 p-4">

//               <div className="mb-2 flex items-center gap-2">

//                 <AlertTriangle
//                   size={18}
//                   className="text-green-600"
//                 />

//                 <p className="text-sm font-medium text-gray-600">
//                   Priority
//                 </p>

//               </div>

//               <span
//                 className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
//                   ticket.priority
//                 )}`}
//               >
//                 {ticket.priority}
//               </span>

//             </div>

//             {/* Status */}

//             <div className="rounded-xl border border-gray-200 p-4">

//               <div className="mb-2 flex items-center gap-2">

//                 <BadgeCheck
//                   size={18}
//                   className="text-green-600"
//                 />

//                 <p className="text-sm font-medium text-gray-600">
//                   Status
//                 </p>

//               </div>

//               <span
//                 className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
//                   ticket.status
//                 )}`}
//               >
//                 {ticket.status.replace("_", " ")}
//               </span>

//             </div>

//             <InfoCard
//               icon={<User size={18} />}
//               label="Assigned Employee"
//               value={ticket.assignedTo?.name || "Unassigned"}
//             />

//             <InfoCard
//               icon={<User size={18} />}
//               label="Employee Username"
//               value={ticket.assignedTo?.username || "-"}
//             />

//             <InfoCard
//               icon={<Calendar size={18} />}
//               label="Created At"
//               value={new Date(ticket.createdAt).toLocaleString("en-IN")}
//             />

//             <InfoCard
//               icon={<Calendar size={18} />}
//               label="Updated At"
//               value={new Date(ticket.updatedAt).toLocaleString("en-IN")}
//             />

//           </div>

//         </div>

//         {/* Footer */}

//         <div className="flex justify-end border-t border-gray-200 bg-white px-6 py-5">

//           <button
//             onClick={onClose}
//             className="rounded-xl bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#20bd5a]"
//           >
//             Close
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

// function InfoCard({ icon, label, value }) {
//   return (
//     <div className="rounded-xl border border-gray-200 p-4">

//       <div className="mb-2 flex items-center gap-2 text-green-600">

//         {icon}

//         <p className="text-sm font-medium text-gray-600">
//           {label}
//         </p>

//       </div>

//       <p className="break-words text-base font-semibold text-gray-900">
//         {value || "-"}
//       </p>

//     </div>
//   );
// }

import {
  X,
  Building2,
  BadgeCheck,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import PageLoader from "../common/PageLoader";

import { useEffect, useState } from "react";

import { getTicketNotes } from "../../services/supportTicketNoteService";

export default function ViewSupportTicketModal({
  open,
  ticket,
  onClose,
}) {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    if (open && ticket?.id) {
      loadNotes();
    }
  }, [open, ticket]);

  const loadNotes = async () => {
    try {
      setLoadingNotes(true);

      const data = await getTicketNotes(ticket.id);

      setNotes(data.notes || []);
    } catch (error) {
      console.log(error);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  if (!open || !ticket) return null;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "LOW":
        return "bg-blue-100 text-blue-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "URGENT":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* ================= Header ================= */}

        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-7 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Support Ticket Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View complete ticket information and progress updates.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= Body ================= */}

        <div className="flex-1 overflow-y-auto p-7">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Ticket ID */}

            <InfoCard
              icon={<BadgeCheck size={18} />}
              label="Ticket ID"
              value={`#${ticket.id}`}
            />

            {/* Company */}

            <InfoCard
              icon={<Building2 size={18} />}
              label="Company"
              value={ticket.company?.companyName || "-"}
            />

            {/* Assigned Employee */}

            <InfoCard
              icon={<User size={18} />}
              label="Assigned Employee"
              value={ticket.assignedTo?.name || "Unassigned"}
            />

            {/* Username */}

            <InfoCard
              icon={<User size={18} />}
              label="Employee Username"
              value={ticket.assignedTo?.username || "-"}
            />

            {/* Created */}

            <InfoCard
              icon={<Calendar size={18} />}
              label="Created At"
              value={
                ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString("en-IN")
                  : "-"
              }
            />

            {/* Updated */}

            <InfoCard
              icon={<Calendar size={18} />}
              label="Last Updated"
              value={
                ticket.updatedAt
                  ? new Date(ticket.updatedAt).toLocaleString("en-IN")
                  : "-"
              }
            />

            {/* Priority */}

            <div className="rounded-xl border border-gray-200 p-5">

              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle
                  size={18}
                  className="text-[#25D366]"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Priority
                </span>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                  ticket.priority
                )}`}
              >
                {ticket.priority || "-"}
              </span>

            </div>

            {/* Status */}

            <div className="rounded-xl border border-gray-200 p-5">

              <div className="mb-3 flex items-center gap-2">
                <BadgeCheck
                  size={18}
                  className="text-[#25D366]"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Status
                </span>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                  ticket.status
                )}`}
              >
                {ticket.status
                  ? ticket.status.replace(/_/g, " ")
                  : "-"}
              </span>

            </div>
                        {/* =========================
                Ticket Title
            ========================= */}

            <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-3 flex items-center gap-2">
                <FileText
                  size={18}
                  className="text-[#25D366]"
                />

                <span className="font-semibold text-gray-800">
                  Ticket Title
                </span>
              </div>

              <p className="text-gray-700">
                {ticket.title || "-"}
              </p>

            </div>

            {/* =========================
                Description
            ========================= */}

            <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-3 flex items-center gap-2">
                <FileText
                  size={18}
                  className="text-[#25D366]"
                />

                <span className="font-semibold text-gray-800">
                  Description
                </span>
              </div>

              <p className="whitespace-pre-wrap leading-7 text-gray-600">
                {ticket.description || "-"}
              </p>

            </div>

            {/* =========================
                Ticket Updates
            ========================= */}

            <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-green-100 p-2">

                    <MessageSquare
                      size={20}
                      className="text-[#25D366]"
                    />

                  </div>

                  <div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      Ticket Updates
                    </h3>

                    <p className="text-sm text-gray-500">
                      Progress updates added by the support team.
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#25D366]">
                  {notes.length} Update{notes.length !== 1 ? "s" : ""}
                </span>

              </div>

              {/* Timeline Body */}

              <div className="max-h-[350px] overflow-y-auto p-5">
                {loadingNotes ? (

                  <PageLoader label="Loading ticket updates..." className="py-2" />

                ) : notes.length === 0 ? (

                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">

                      <MessageSquare
                        size={26}
                        className="text-[#25D366]"
                      />

                    </div>

                    <h4 className="mt-4 text-lg font-semibold text-gray-800">
                      No Updates Available
                    </h4>

                    <p className="mt-2 text-sm text-gray-500">
                      No progress updates have been added for this ticket.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-6">

                    {notes.map((item, index) => (

                      <div
                        key={item.id}
                        className="relative pl-10"
                      >

                        {/* Timeline Line */}

                        {index !== notes.length - 1 && (

                          <div className="absolute left-[13px] top-8 h-full w-[2px] bg-gray-200" />

                        )}

                        {/* Timeline Dot */}

                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] shadow-md">

                          <MessageSquare
                            size={13}
                            className="text-white"
                          />

                        </div>

                        {/* Update Card */}

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                          <div className="flex flex-wrap items-center justify-between gap-3">

                            <div>

                              <h4 className="font-semibold text-gray-900">
                                {item.createdByName || "System"}
                              </h4>

                              <p className="text-xs text-gray-500">
                                Support Team Update
                              </p>

                            </div>

                            <span className="text-xs text-gray-500">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleString("en-IN")
                                : "-"}
                            </span>

                          </div>

                          <div className="mt-4 rounded-lg bg-gray-50 p-4">

                            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                              {item.note}
                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>
                    </div>

        {/* ================= Footer ================= */}

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-7 py-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Close
          </button>

        </div>

      </div>
    </div>
    </div>
  );
}
/* ==========================================================
   Info Card Component
========================================================== */

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="mb-3 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-[#25D366]">
          {icon}
        </div>

        <span className="text-sm font-medium text-gray-600">
          {label}
        </span>

      </div>

      <p className="break-words text-base font-semibold text-gray-900">
        {value || "-"}
      </p>

    </div>
  );
}
