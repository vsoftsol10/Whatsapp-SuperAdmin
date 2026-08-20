// import {
//   CreditCard,
//   CircleCheckBig,
//   Clock3,
//   CircleOff
// } from "lucide-react";

// export default function SubscriptionStats({ plans = [] }) {

//   const stats = [
//     {
//       title: "Total Plans",
//       value: plans.length,
//       icon: CreditCard
//     },
//     {
//       title: "Active Plans",
//       value: plans.filter((plan) => plan.status === "ACTIVE").length,
//       icon: CircleCheckBig
//     },
//     {
//       title: "Trial Plans",
//       value: plans.filter((plan) => plan.isTrial === true).length,
//       icon: Clock3
//     },
//     {
//       title: "Inactive Plans",
//       value: plans.filter((plan) => plan.status !== "ACTIVE").length,
//       icon: CircleOff
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

//       {stats.map((item) => {

//         const Icon = item.icon;

//         return (

//           <div
//             key={item.title}
//             className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
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


//               <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">

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
  CreditCard,
  CircleCheckBig,
  Clock3,
  CircleOff
} from "lucide-react";

export default function SubscriptionStats({ stats = {} }) {

  const cards = [
    {
      title: "Total Subscriptions",
      value: stats.totalSubscriptions || 0,
      icon: CreditCard
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions || 0,
      icon: CircleCheckBig
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon || 0,
      icon: Clock3
    },
    {
      title: "Expired Subscriptions",
      value: stats.expiredSubscriptions || 0,
      icon: CircleOff
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

      {cards.map((item) => {

        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
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

              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">

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