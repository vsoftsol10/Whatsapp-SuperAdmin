// import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const navigate=useNavigate();

// export default function SubscriptionHeader({ onCreatePlan }) {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           Subscription Plans
//         </h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage WhatsApp CRM pricing plans, limits and customer subscriptions.
//         </p>
//       </div>

//       <button
//   onClick={()=>navigate("/subscription-plans")}
//   className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
// >
//   Plans
// </button>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

export default function SubscriptionHeader({
  showPlansButton = true
}) {

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Subscription Plans
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage WhatsApp CRM pricing plans, limits and customer subscriptions.
        </p>
      </div>

      {showPlansButton && (
        <button
          onClick={() => navigate("/subscription-plans")}
          className="rounded-xl bg-green-600 px-5 py-3 text-white"
        >
          Plans
        </button>
      )}
    </div>
  );
}