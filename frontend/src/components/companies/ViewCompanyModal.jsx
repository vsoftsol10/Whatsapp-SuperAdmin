// import {
//   X,
//   Building2,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   CreditCard
// } from "lucide-react";


// export default function ViewCompanyModal({
//   open,
//   company,
//   onClose
// }) {


//   if (!open || !company) return null;


//   return (

//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5">


//       <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">


//         {/* Header */}

//         <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">


//           <div className="flex items-center gap-3">


//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">

//               <Building2 size={23} />

//             </div>


//             <div>

//               <h2 className="text-xl font-semibold text-gray-900">
//                 Company Details
//               </h2>


//               <p className="mt-1 text-sm text-gray-500">
//                 View company information
//               </p>

//             </div>


//           </div>



//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//           >

//             <X size={20} />

//           </button>


//         </div>




//         {/* Body */}

//         <div className="flex-1 overflow-y-auto p-7">


//           <div className="grid grid-cols-2 gap-5">



//             <ViewField
//               icon={<Building2 size={18} />}
//               label="Company ID"
//               value={company.companyId}
//             />


//             <ViewField
//               icon={<Building2 size={18} />}
//               label="Company Name"
//               value={company.companyName}
//             />


//             <ViewField
//               icon={<User size={18} />}
//               label="Owner Name"
//               value={company.ownerName}
//             />


//             <ViewField
//               icon={<Mail size={18} />}
//               label="Email Address"
//               value={company.email}
//             />


//             <ViewField
//               icon={<Phone size={18} />}
//               label="Phone Number"
//               value={company.phone}
//             />


//             <ViewField
//               icon={<CreditCard size={18} />}
//               label="Subscription Plan"
//               value={company.plan}
//             />


//             <ViewField
//               icon={<Calendar size={18} />}
//               label="Expiry Date"
//               value={
//                 new Date(company.expiryDate)
//                   .toLocaleDateString()
//               }
//             />


//             <ViewField
//               icon={<Calendar size={18} />}
//               label="Status"
//               value={company.status}
//             />


//           </div>




//           {/* Address */}

//           <div className="mt-5">


//             <label className="mb-2 block text-sm font-medium text-gray-700">

//               <span className="flex items-center gap-2">

//                 <MapPin size={17} className="text-green-600" />

//                 Address

//               </span>

//             </label>



//             <div className="min-h-[100px] rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">

//               {company.address || "No address available"}

//             </div>


//           </div>



//         </div>

//         {/* Subscription History */}

//         <div className="mt-7">

//           <div className="mb-4 flex items-center gap-2">

//             <CreditCard
//               size={20}
//               className="text-green-600"
//             />

//             <h3 className="text-lg font-semibold text-gray-900">
//               Subscription History
//             </h3>

//           </div>

//           {company.subscriptions &&
//             company.subscriptions.length > 0 ? (

//             <div className="space-y-4">

//               {company.subscriptions.map((subscription) => (

//                 <div
//                   key={subscription.id}
//                   className="rounded-xl border border-gray-200 bg-gray-50 p-5"
//                 >

//                   <div className="flex items-center justify-between">

//                     <div>

//                       <p className="text-xs font-medium uppercase text-gray-500">
//                         Plan
//                       </p>

//                       <p className="mt-1 text-lg font-semibold text-gray-900">
//                         {subscription.plan?.planName || "-"}
//                       </p>

//                     </div>

//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-semibold ${subscription.status === "ACTIVE"
//                           ? "bg-green-100 text-green-700"
//                           : subscription.status === "EXPIRED"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                     >
//                       {subscription.status}
//                     </span>

//                   </div>


//                   <div className="mt-4 grid grid-cols-2 gap-4">

//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Start Date
//                       </p>

//                       <p className="mt-1 text-sm font-medium text-gray-800">
//                         {new Date(
//                           subscription.startDate
//                         ).toLocaleDateString()}
//                       </p>

//                     </div>


//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Expiry Date
//                       </p>

//                       <p className="mt-1 text-sm font-medium text-gray-800">
//                         {new Date(
//                           subscription.expiryDate
//                         ).toLocaleDateString()}
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           ) : (

//             <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">

//               <p className="text-sm text-gray-500">
//                 No subscription history available
//               </p>

//             </div>

//           )}

//         </div>

//         {/* Footer */}

//         <div className="flex justify-end border-t border-gray-200 px-7 py-5">


//           <button

//             onClick={onClose}

//             className="rounded-xl bg-[#25D366] px-7 py-3 font-medium text-white transition hover:bg-[#1fb85a]"
//           >

//             Close

//           </button>


//         </div>



//       </div>


//     </div>

//   );

// }





// function ViewField({
//   icon,
//   label,
//   value
// }) {


//   return (

//     <div>


//       <label className="mb-2 block text-sm font-medium text-gray-700">

//         <span className="flex items-center gap-2">

//           <span className="text-green-600">
//             {icon}
//           </span>

//           {label}

//         </span>


//       </label>



//       <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800">

//         {value || "-"}

//       </div>


//     </div>

//   );

// }

import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";

export default function ViewCompanyModal({
  open,
  company,
  onClose,
}) {
  if (!open || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Building2 size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Company Details
              </h2>

              <p className="text-xs text-gray-500">
                View company information and subscription history
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ================= COMPANY INFORMATION ================= */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Building2
                size={19}
                className="text-green-600"
              />

              <h3 className="text-base font-semibold text-gray-900">
                Company Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <ViewField
                icon={<Building2 size={17} />}
                label="Company ID"
                value={company.companyId}
              />

              <ViewField
                icon={<Building2 size={17} />}
                label="Company Name"
                value={company.companyName}
              />

              <ViewField
                icon={<User size={17} />}
                label="Owner Name"
                value={company.ownerName}
              />

              <ViewField
                icon={<Mail size={17} />}
                label="Email Address"
                value={company.email}
              />

              <ViewField
                icon={<Phone size={17} />}
                label="Phone Number"
                value={company.phone}
              />

              <ViewField
                icon={<CreditCard size={17} />}
                label="Current Plan"
                value={
                  company.plan ||
                  company.subscription?.plan?.planName ||
                  "-"
                }
              />

              <ViewField
                icon={<Calendar size={17} />}
                label="Expiry Date"
                value={
                  company.expiryDate
                    ? new Date(
                        company.expiryDate
                      ).toLocaleDateString()
                    : "-"
                }
              />

              <ViewField
                icon={<Calendar size={17} />}
                label="Company Status"
                value={company.status}
              />

            </div>

            {/* ================= ADDRESS ================= */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <MapPin
                    size={17}
                    className="text-green-600"
                  />

                  Address
                </span>
              </label>

              <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {company.address || "No address available"}
              </div>
            </div>
          </div>

          {/* ================= DIVIDER ================= */}
          <div className="my-6 border-t border-gray-200" />

          {/* ================= SUBSCRIPTION HISTORY ================= */}
          <div>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard
                  size={19}
                  className="text-green-600"
                />

                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Subscription History
                  </h3>

                  <p className="text-xs text-gray-500">
                    Previous and current subscription plans
                  </p>
                </div>
              </div>

              {company.subscriptions?.length > 0 && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {company.subscriptions.length}{" "}
                  {company.subscriptions.length === 1
                    ? "Subscription"
                    : "Subscriptions"}
                </span>
              )}
            </div>

            {company.subscriptions &&
            company.subscriptions.length > 0 ? (

              <div className="space-y-2">

                {company.subscriptions.map(
                  (subscription, index) => {

                    const planName =
                      subscription.plan?.planName ||
                      subscription.planName ||
                      "-";

                    const status =
                      subscription.status || "-";

                    return (
                      <div
                        key={
                          subscription.id ||
                          `${planName}-${index}`
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-gray-300 hover:bg-gray-100"
                      >

                        {/* TOP ROW */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          {/* PLAN */}
                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm">
                              <CreditCard size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                Plan
                              </p>

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {planName}
                              </p>
                            </div>

                          </div>

                          {/* STATUS */}
                          <SubscriptionStatus
                            status={status}
                          />

                        </div>

                        {/* DATES */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-gray-200 pt-3">

                          <SubscriptionDate
                            label="Start Date"
                            value={
                              subscription.startDate
                                ? new Date(
                                    subscription.startDate
                                  ).toLocaleDateString()
                                : "-"
                            }
                          />

                          <SubscriptionDate
                            label="Expiry Date"
                            value={
                              subscription.expiryDate
                                ? new Date(
                                    subscription.expiryDate
                                  ).toLocaleDateString()
                                : "-"
                            }
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center">
                <CreditCard
                  size={28}
                  className="mx-auto mb-2 text-gray-300"
                />

                <p className="text-sm font-medium text-gray-500">
                  No subscription history available
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Subscription records will appear here
                  when available.
                </p>
              </div>

            )}

          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#25D366] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1fb85a]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


/* =====================================================
   VIEW FIELD
===================================================== */

function ViewField({
  icon,
  label,
  value,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        <span className="flex items-center gap-2">
          <span className="text-green-600">
            {icon}
          </span>

          {label}
        </span>
      </label>

      <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800">
        {value || "-"}
      </div>
    </div>
  );
}


/* =====================================================
   SUBSCRIPTION STATUS
===================================================== */

function SubscriptionStatus({ status }) {
  let statusClass =
    "bg-gray-100 text-gray-700";

  if (status === "ACTIVE") {
    statusClass =
      "bg-green-100 text-green-700";
  } else if (status === "EXPIRED") {
    statusClass =
      "bg-red-100 text-red-700";
  } else if (status === "INACTIVE") {
    statusClass =
      "bg-yellow-100 text-yellow-700";
  } else if (status === "CANCELLED") {
    statusClass =
      "bg-gray-200 text-gray-700";
  }

  return (
    <span
      className={`w-fit shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
    >
      {status}
    </span>
  );
}


/* =====================================================
   SUBSCRIPTION DATE
===================================================== */

function SubscriptionDate({
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2">
      <Calendar
        size={14}
        className="text-gray-400"
      />

      <div>
        <p className="text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="text-xs font-medium text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}

