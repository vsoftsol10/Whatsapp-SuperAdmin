// import { useState, useEffect } from "react";
// import { X, Plus, Trash2 } from "lucide-react";

// export default function AddSubscriptionPlanModal({
//   open,
//   onClose,
//   onSubmit,
//   editPlan = null,
// }) {
//   const initialForm = {
//     planName: "",
//     price: "",
//     durationDays: "30",
//     maxUsers: "",
//     maxCustomers: "",
//     maxCampaigns: "",
//     maxTemplates: "",
//     maxFacebookPages: "",
//     maxInstagramAccounts: "",
//     maxWebsiteIntegrations: "",
//     maxAppIntegrations: "",
//     features: [],
//     isTrial: false,
//     isCustom: false,
//     status: "ACTIVE",
//   };

//   const [form, setForm] = useState(initialForm);
//   const [featureInput, setFeatureInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!open) return;

//     if (editPlan) {
//       setForm({
//         planName: editPlan.planName || "",
//         price: editPlan.price?.toString() || "",
//         durationDays: editPlan.durationDays?.toString() || "30",
//         maxUsers: editPlan.maxUsers?.toString() || "",
//         maxCustomers: editPlan.maxCustomers?.toString() || "",
//         maxCampaigns: editPlan.maxCampaigns?.toString() || "",
//         maxTemplates: editPlan.maxTemplates?.toString() || "",
//         maxFacebookPages: editPlan.maxFacebookPages?.toString() ?? "",
//         maxInstagramAccounts: editPlan.maxInstagramAccounts?.toString() ?? "",
//         maxWebsiteIntegrations: editPlan.maxWebsiteIntegrations?.toString() ?? "",
//         maxAppIntegrations: editPlan.maxAppIntegrations?.toString() ?? "",
//         features: editPlan.features || [],
//         isTrial: editPlan.isTrial || false,
//         isCustom: editPlan.isCustom || false,
//         status: editPlan.status || "ACTIVE",
//       });
//     } else {
//       setForm(initialForm);
//     }

//     setFeatureInput("");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, editPlan]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const addFeature = () => {
//     const value = featureInput.trim();

//     if (!value) return;

//     if (form.features.includes(value)) {
//       setFeatureInput("");
//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       features: [...prev.features, value],
//     }));

//     setFeatureInput("");
//   };

//   const removeFeature = (index) => {
//     setForm((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//   };

//   const handleFeatureKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       addFeature();
//     }
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     if (!form.planName.trim()) {
//       alert("Please enter a plan name");
//       return;
//     }

//     let payload;

//     if (form.isCustom) {
//       if (form.features.length === 0) {
//         alert("Please add at least one feature for the custom plan");
//         return;
//       }

//       // Custom plan: only name, status and features.
//       // Backend fills price / duration / limits automatically.
//       payload = {
//         planName: form.planName.trim(),
//         isCustom: true,
//         features: form.features,
//         status: form.status,
//       };
//     } else {
//       payload = {
//         planName: form.planName.trim(),
//         price: Number(form.price || 0),
//         durationDays: Number(form.durationDays),
//         maxUsers: Number(form.maxUsers),
//         maxCustomers: Number(form.maxCustomers),
//         maxCampaigns: Number(form.maxCampaigns),
//         maxTemplates: Number(form.maxTemplates),
//         maxFacebookPages: Number(form.maxFacebookPages || 0),
//         maxInstagramAccounts: Number(form.maxInstagramAccounts || 0),
//         maxWebsiteIntegrations: Number(form.maxWebsiteIntegrations || 0),
//         maxAppIntegrations: Number(form.maxAppIntegrations || 0),
//         features: form.features,
//         isTrial: form.isTrial,
//         isCustom: false,
//         status: form.status,
//       };
//     }

//     try {
//       setLoading(true);

//       await onSubmit(payload);

//       setFeatureInput("");

//       if (!editPlan) {
//         setForm(initialForm);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (loading) return;

//     setForm(initialForm);
//     setFeatureInput("");
//     onClose();
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
//       <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">
//               {editPlan
//                 ? "Edit Subscription Plan"
//                 : "Create Subscription Plan"}
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               {form.isCustom
//                 ? "Custom plan: add features only. No price or limits."
//                 : "Configure pricing, limits and plan features."}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={loading}
//             className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex-1 overflow-y-auto p-6"
//         >
//           {/* Custom plan toggle */}
//           <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
//             <input
//               type="checkbox"
//               name="isCustom"
//               checked={form.isCustom}
//               onChange={handleChange}
//               className="mt-1 h-4 w-4 accent-[#25D366]"
//             />

//             <span>
//               <span className="block text-sm font-semibold text-gray-900">
//                 Custom plan
//               </span>
//               <span className="block text-sm text-gray-500">
//                 No fixed price, duration or limits. Only features are listed,
//                 and customers contact sales for pricing.
//               </span>
//             </span>
//           </label>

//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Plan Name
//               </label>

//               <input
//                 type="text"
//                 name="planName"
//                 value={form.planName}
//                 onChange={handleChange}
//                 placeholder={form.isCustom ? "Enterprise" : "Professional"}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
//                 required
//               />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Status
//               </label>

//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
//               >
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//               </select>
//             </div>

//             {!form.isCustom && (
//               <>
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">
//                     Price (₹)
//                   </label>

//                   <input
//                     type="number"
//                     min="0"
//                     name="price"
//                     value={form.price}
//                     onChange={handleChange}
//                     disabled={form.isTrial}
//                     className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none disabled:bg-gray-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">
//                     Duration (Days)
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     name="durationDays"
//                     value={form.durationDays}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
//                   />
//                 </div>
//               </>
//             )}

//           </div>

//           {/* Limits (hidden for custom plans) */}
//           {!form.isCustom && (
//             <div className="mt-6">

//               <h3 className="text-lg font-semibold">
//                 Usage Limits
//               </h3>

//               <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

//                 <LimitInput
//                   label="Maximum Users"
//                   name="maxUsers"
//                   value={form.maxUsers}
//                   onChange={handleChange}
//                   placeholder="20"
//                 />

//                 <LimitInput
//                   label="Maximum Customers"
//                   name="maxCustomers"
//                   value={form.maxCustomers}
//                   onChange={handleChange}
//                   placeholder="10000"
//                 />

//                 <LimitInput
//                   label="Maximum Campaigns"
//                   name="maxCampaigns"
//                   value={form.maxCampaigns}
//                   onChange={handleChange}
//                   placeholder="-1"
//                 />

//                 <LimitInput
//                   label="Maximum Templates"
//                   name="maxTemplates"
//                   value={form.maxTemplates}
//                   onChange={handleChange}
//                   placeholder="20"
//                 />

//                 <LimitInput
//                   label="Facebook Pages"
//                   name="maxFacebookPages"
//                   value={form.maxFacebookPages}
//                   onChange={handleChange}
//                   placeholder="1"
//                 />

//                 <LimitInput
//                   label="Instagram Accounts"
//                   name="maxInstagramAccounts"
//                   value={form.maxInstagramAccounts}
//                   onChange={handleChange}
//                   placeholder="1"
//                 />

//                 <LimitInput
//                   label="Website Integrations"
//                   name="maxWebsiteIntegrations"
//                   value={form.maxWebsiteIntegrations}
//                   onChange={handleChange}
//                   placeholder="1"
//                 />

//                 <LimitInput
//                   label="App Integrations"
//                   name="maxAppIntegrations"
//                   value={form.maxAppIntegrations}
//                   onChange={handleChange}
//                   placeholder="0"
//                 />

//               </div>

//             </div>
//           )}

//           {/* Features */}

//           <div className="mt-6">

//             <h3 className="text-lg font-semibold">
//               Features
//             </h3>

//             <div className="mt-4 flex gap-3">

//               <input
//                 value={featureInput}
//                 onChange={(e) =>
//                   setFeatureInput(e.target.value)
//                 }
//                 onKeyDown={handleFeatureKeyDown}
//                 placeholder="Example : Shared Inbox"
//                 className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
//               />

//               <button
//                 type="button"
//                 onClick={addFeature}
//                 className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
//               >
//                 <Plus size={18} />
//                 Add
//               </button>

//             </div>

//             {form.features.length > 0 && (
//               <div className="mt-4 space-y-2">

//                 {form.features.map((feature, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3"
//                   >
//                     <span>{feature}</span>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         removeFeature(index)
//                       }
//                       className="text-red-500"
//                     >
//                       <Trash2 size={17} />
//                     </button>

//                   </div>
//                 ))}

//               </div>
//             )}

//           </div>

//         </form>

//         <div className="flex justify-end gap-3 border border-gray-300 px-6 py-5">

//           <button
//             type="button"
//             onClick={handleClose}
//             className="rounded-xl border border-gray-400 px-6 py-3"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={loading}
//             className="rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#1fb85a]"
//           >
//             {loading
//               ? editPlan
//                 ? "Updating..."
//                 : "Creating..."
//               : editPlan
//                 ? "Update Plan"
//                 : "Create Plan"}
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }

// function LimitInput({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
// }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-medium text-gray-700">
//         {label}
//       </label>

//       <input
//         type="number"
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//       />
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import FeatureLimitsEditor, {
  buildFormConfig,
  validateFormConfig,
  toPayloadConfig,
} from "./FeatureLimitsEditor";
import { getFeatureCatalog } from "../../services/subscriptionPlanService";

export default function AddSubscriptionPlanModal({
  open,
  onClose,
  onSubmit,
  editPlan = null,
  plans = [],
}) {
  const initialForm = {
    planName: "",
    price: "",
    durationDays: "30",
    features: [],
    isTrial: false,
    isCustom: false,
    status: "ACTIVE",
  };

  const [form, setForm] = useState(initialForm);
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [featureForm, setFeatureForm] = useState({});

  useEffect(() => {
    if (!open) return;

    if (editPlan) {
      setForm({
        planName: editPlan.planName || "",
        price: editPlan.price?.toString() || "",
        durationDays: editPlan.durationDays?.toString() || "30",
        features: editPlan.features || [],
        isTrial: editPlan.isTrial || false,
        isCustom: editPlan.isCustom || false,
        status: editPlan.status || "ACTIVE",
      });
    } else {
      setForm(initialForm);
    }

    setFeatureInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editPlan]);

  // Load the feature list (from the backend catalog) every time the modal opens
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadCatalog = async () => {
      try {
        setCatalogLoading(true);

        const data = await getFeatureCatalog();
        if (cancelled) return;

        const list = data.features || [];
        setCatalog(list);
        setFeatureForm(buildFormConfig(list, editPlan?.featureConfig));
      } catch (error) {
        console.log(error);
        if (!cancelled) setCatalog([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    };

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [open, editPlan]);

  const handleFeatureChange = (key, patch) => {
    setFeatureForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const handleCopyFrom = (planId) => {
    const source = plans.find((p) => p.id === planId);
    if (!source) return;

    setFeatureForm(buildFormConfig(catalog, source.featureConfig));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    if (form.features.includes(value)) {
      setFeatureInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      features: [...prev.features, value],
    }));

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.planName.trim()) {
      alert("Please enter a plan name");
      return;
    }

    let payload;

    if (form.isCustom) {
      if (form.features.length === 0) {
        alert("Please add at least one feature for the custom plan");
        return;
      }

      // Custom plan: only name, status and features.
      // Backend fills price / duration / limits automatically.
      payload = {
        planName: form.planName.trim(),
        isCustom: true,
        features: form.features,
        status: form.status,
      };
    } else {
      if (catalog.length === 0) {
        alert("Feature list is not loaded. Please close and open this window again.");
        return;
      }

      const featureError = validateFormConfig(catalog, featureForm);
      if (featureError) {
        alert(featureError);
        return;
      }

      // The backend fills the old limit columns from featureConfig
      payload = {
        planName: form.planName.trim(),
        price: Number(form.price || 0),
        durationDays: Number(form.durationDays),
        featureConfig: toPayloadConfig(catalog, featureForm),
        features: form.features,
        isTrial: form.isTrial,
        isCustom: false,
        status: form.status,
      };
    }

    try {
      setLoading(true);

      await onSubmit(payload);

      setFeatureInput("");

      if (!editPlan) {
        setForm(initialForm);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setForm(initialForm);
    setFeatureInput("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editPlan
                ? "Edit Subscription Plan"
                : "Create Subscription Plan"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {form.isCustom
                ? "Custom plan: add features only. No price or limits."
                : "Configure pricing, limits and plan features."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6"
        >
          {/* Custom plan toggle */}
          <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <input
              type="checkbox"
              name="isCustom"
              checked={form.isCustom}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-[#25D366]"
            />

            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Custom plan
              </span>
              <span className="block text-sm text-gray-500">
                No fixed price, duration or limits. Only features are listed,
                and customers contact sales for pricing.
              </span>
            </span>
          </label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Plan Name
              </label>

              <input
                type="text"
                name="planName"
                value={form.planName}
                onChange={handleChange}
                placeholder={form.isCustom ? "Enterprise" : "Professional"}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {!form.isCustom && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    disabled={form.isTrial}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="durationDays"
                    value={form.durationDays}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
                  />
                </div>
              </>
            )}

          </div>

          {/* Features & Limits (hidden for custom plans) */}
          {!form.isCustom && (
            <div className="mt-6">

              <h3 className="text-lg font-semibold">
                Features & Limits
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Switch features on or off for this plan and set a limit where
                it applies.
              </p>

              <FeatureLimitsEditor
                catalog={catalog}
                value={featureForm}
                onChange={handleFeatureChange}
                loading={catalogLoading}
                copyPlans={plans.filter(
                  (p) => !p.isCustom && p.id !== editPlan?.id
                )}
                onCopyFrom={handleCopyFrom}
              />

            </div>
          )}

          {/* Features */}

          <div className="mt-6">

            <h3 className="text-lg font-semibold">
              Plan Highlights
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Text points shown on the plan card and the landing page.
            </p>

            <div className="mt-4 flex gap-3">

              <input
                value={featureInput}
                onChange={(e) =>
                  setFeatureInput(e.target.value)
                }
                onKeyDown={handleFeatureKeyDown}
                placeholder="Example : Shared Inbox"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 outline-none"
              />

              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
              >
                <Plus size={18} />
                Add
              </button>

            </div>

            {form.features.length > 0 && (
              <div className="mt-4 space-y-2">

                {form.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3"
                  >
                    <span>{feature}</span>

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(index)
                      }
                      className="text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

        </form>

        <div className="flex justify-end gap-3 border border-gray-300 px-6 py-5">

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-gray-400 px-6 py-3"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#1fb85a]"
          >
            {loading
              ? editPlan
                ? "Updating..."
                : "Creating..."
              : editPlan
                ? "Update Plan"
                : "Create Plan"}
          </button>

        </div>

      </div>
    </div>
  );
}
