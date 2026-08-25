// import React from "react";

// export default function AuditLogTable({ auditLogs }) {

//   return (
//     <div className="overflow-hidden rounded-xl bg-white shadow">

//       <div className="overflow-x-auto">

//         <table className="w-full">

//           <thead className="bg-gray-50">

//             <tr>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Date & Time
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Actor
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Action
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Entity
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
//                 Description
//               </th>

//             </tr>

//           </thead>

//           <tbody className="divide-y divide-gray-100">

//             {auditLogs.length === 0 ? (

//               <tr>

//                 <td
//                   colSpan="5"
//                   className="px-6 py-10 text-center text-gray-500"
//                 >
//                   No audit logs found.
//                 </td>

//               </tr>

//             ) : (

//               auditLogs.map((log) => (

//                 <tr
//                   key={log.id}
//                   className="hover:bg-gray-50"
//                 >

//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {new Date(
//                       log.createdAt
//                     ).toLocaleString()}
//                   </td>

//                   <td className="px-6 py-4">

//                     <div className="text-sm font-medium text-gray-800">
//                       {log.actorType || "UNKNOWN"}
//                     </div>

//                     <div className="text-xs text-gray-400">
//                       {log.actorId || "-"}
//                     </div>

//                   </td>

//                   <td className="px-6 py-4">

//                     <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
//                       {log.action}
//                     </span>

//                   </td>

//                   <td className="px-6 py-4 text-sm text-gray-600">

//                     {log.entityType}

//                     {log.entityId && (
//                       <span className="ml-1 text-xs text-gray-400">
//                         #{log.entityId}
//                       </span>
//                     )}

//                   </td>

//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {log.description || "-"}
//                   </td>

//                 </tr>

//               ))

//             )}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }

import React from "react";

const AuditLogTable = ({ auditLogs = [] }) => {
  if (!auditLogs.length) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-center text-gray-500">
          No audit logs found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">

      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm">

          <thead className="bg-gray-50 text-gray-600">

            <tr>

              <th className="px-6 py-4 font-semibold">
                Date
              </th>

              <th className="px-6 py-4 font-semibold">
                Actor
              </th>

              <th className="px-6 py-4 font-semibold">
                Action
              </th>

              <th className="px-6 py-4 font-semibold">
                Entity
              </th>

              <th className="px-6 py-4 font-semibold">
                Description
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {auditLogs.map((log) => (

              <tr
                key={log.id}
                className="hover:bg-gray-50"
              >

                {/* Date */}

                <td className="px-6 py-4 text-gray-600">
                  {log.createdAt
                    ? new Date(
                        log.createdAt
                      ).toLocaleString()
                    : "-"}
                </td>

                {/* Actor */}

                <td className="px-6 py-4">

                  <div className="font-medium text-gray-900">
                    {log.actorType || "Unknown"}
                  </div>

                  <div className="text-xs text-gray-500">
                    {log.actorId || "-"}
                  </div>

                </td>

                {/* Action */}

                <td className="px-6 py-4">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {log.action || "-"}
                  </span>

                </td>

                {/* Entity */}

                <td className="px-6 py-4 text-gray-600">
                  {log.entityType || "-"}
                </td>

                {/* Description */}

                <td className="px-6 py-4 text-gray-600">
                  {log.description || "-"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AuditLogTable;