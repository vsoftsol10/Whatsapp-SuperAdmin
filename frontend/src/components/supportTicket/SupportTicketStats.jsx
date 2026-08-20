// import {
//   AlertCircle,
//   Clock3,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// export default function SupportTicketStats({
//   tickets = [],
// }) {
//   const open = tickets.filter(
//     (ticket) => ticket.status === "OPEN"
//   ).length;

//   const inProgress = tickets.filter(
//     (ticket) => ticket.status === "IN_PROGRESS"
//   ).length;

//   const resolved = tickets.filter(
//     (ticket) => ticket.status === "RESOLVED"
//   ).length;

//   const closed = tickets.filter(
//     (ticket) => ticket.status === "CLOSED"
//   ).length;

//   const cards = [
//     {
//       title: "Open",
//       value: open,
//       icon: AlertCircle,
//     },
//     {
//       title: "In Progress",
//       value: inProgress,
//       icon: Clock3,
//     },
//     {
//       title: "Resolved",
//       value: resolved,
//       icon: CheckCircle2,
//     },
//     {
//       title: "Closed",
//       value: closed,
//       icon: XCircle,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 gap-5 mb-6 sm:grid-cols-2 xl:grid-cols-4">

//       {cards.map((item) => {

//         const Icon = item.icon;

//         return (

//           <div
//             key={item.title}
//             className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
//           >

//             <div className="flex items-center justify-between">

//               <div>

//                 <p className="text-sm font-medium text-gray-500">
//                   {item.title}
//                 </p>

//                 <h2 className="mt-2 text-3xl font-bold text-gray-900">
//                   {item.value}
//                 </h2>

//               </div>

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10">

//                 <Icon
//                   size={24}
//                   className="text-[#25D366]"
//                 />

//               </div>

//             </div>

//           </div>

//         );

//       })}

//     </div>
//   );
// }

import {
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  ListChecks,
} from "lucide-react";

export default function SupportTicketStats({
  tickets = [],
}) {

  const total = tickets.length;

  const open = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgress = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolved = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const closed = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;

  const cards = [
    {
      title: "Total Tickets",
      value: total,
      icon: ListChecks,
    },
    {
      title: "Open",
      value: open,
      icon: AlertCircle,
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Clock3,
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle2,
    },
    {
      title: "Closed",
      value: closed,
      icon: XCircle,
    },
  ];

  return (

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

      {cards.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {item.value}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10">

                <Icon
                  size={24}
                  className="text-[#25D366]"
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}