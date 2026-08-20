// import { useState } from "react";
// import { X, Plus, Trash2 } from "lucide-react";

// export default function AddSubscriptionPlanModal({ open,onClose,onSubmit }) {
//   const initialForm = {
//     planName: "",
//     price: "",
//     durationDays: "30",
//     maxUsers: "",
//     maxContacts: "",
//     maxCampaigns: "",
//     maxBots: "",
//     features: [],
//     isTrial: false,
//     status: "ACTIVE"
//   };

//   const [form,setForm] = useState(initialForm);
//   const [featureInput,setFeatureInput] = useState("");
//   const [loading,setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name,value,type,checked } = e.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleTrialChange = (e) => {
//     const checked = e.target.checked;

//     setForm((previous) => ({
//       ...previous,
//       isTrial: checked,
//       price: checked ? "0" : previous.price,
//       durationDays: checked ? "14" : previous.durationDays
//     }));
//   };

//   const addFeature = () => {
//     const newFeature = featureInput.trim();

//     if (!newFeature) return;

//     if (form.features.includes(newFeature)) {
//       setFeatureInput("");
//       return;
//     }

//     setForm((previous) => ({
//       ...previous,
//       features: [...previous.features,newFeature]
//     }));

//     setFeatureInput("");
//   };

//   const removeFeature = (index) => {
//     setForm((previous) => ({
//       ...previous,
//       features: previous.features.filter((_,featureIndex) => featureIndex !== index)
//     }));
//   };

//   const handleFeatureKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       addFeature();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.planName.trim()) {
//       alert("Please enter a plan name");
//       return;
//     }

//     if (!form.durationDays || Number(form.durationDays) <= 0) {
//       alert("Please enter a valid duration");
//       return;
//     }

//     if (form.maxUsers === "" || form.maxContacts === "" || form.maxCampaigns === "" || form.maxBots === "") {
//       alert("Please enter all plan limits");
//       return;
//     }

//     const planData = {
//       planName: form.planName.trim(),
//       price: Number(form.price || 0),
//       durationDays: Number(form.durationDays),
//       maxUsers: Number(form.maxUsers),
//       maxContacts: Number(form.maxContacts),
//       maxCampaigns: Number(form.maxCampaigns),
//       maxBots: Number(form.maxBots),
//       features: form.features,
//       isTrial: form.isTrial,
//       status: form.status
//     };

//     try {
//       setLoading(true);

//       await onSubmit(planData);

//       setForm(initialForm);
//       setFeatureInput("");

//     } catch (error) {
//       console.error("Create subscription plan error:",error);
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

//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">Create Subscription Plan</h2>
//             <p className="mt-1 text-sm text-gray-500">Configure pricing, limits, and plan features.</p>
//           </div>

//           <button type="button" onClick={handleClose} disabled={loading} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">

//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Plan Name</label>
//               <input type="text" name="planName" value={form.planName} onChange={handleChange} placeholder="Professional" required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100" />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Plan Status</label>
//               <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100">
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Price (₹)</label>
//               <input type="number" min="0" name="price" value={form.price} onChange={handleChange} disabled={form.isTrial} placeholder="2999" required={!form.isTrial} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100" />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Duration (Days)</label>
//               <input type="number" min="1" name="durationDays" value={form.durationDays} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100" />
//             </div>

//           </div>

//           <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-900">Free Trial Plan</h3>
//                 <p className="mt-1 text-xs text-gray-500">Enable this when the plan is offered free for a limited period.</p>
//               </div>

//               <label className="relative inline-flex cursor-pointer items-center">
//                 <input type="checkbox" checked={form.isTrial} onChange={handleTrialChange} className="peer sr-only" />
//                 <div className="h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-[#25D366] after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"></div>
//               </label>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-base font-semibold text-gray-900">Usage Limits</h3>
//             <p className="mt-1 text-sm text-gray-500">Use -1 for unlimited campaigns or bots.</p>

//             <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

//               <LimitInput label="Maximum Users" name="maxUsers" value={form.maxUsers} onChange={handleChange} placeholder="20" />

//               <LimitInput label="Maximum Contacts" name="maxContacts" value={form.maxContacts} onChange={handleChange} placeholder="10000" />

//               <LimitInput label="Maximum Campaigns" name="maxCampaigns" value={form.maxCampaigns} onChange={handleChange} placeholder="-1 for unlimited" />

//               <LimitInput label="Maximum Bots" name="maxBots" value={form.maxBots} onChange={handleChange} placeholder="5" />

//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-base font-semibold text-gray-900">Plan Features</h3>
//             <p className="mt-1 text-sm text-gray-500">Add features manually for this plan.</p>

//             <div className="mt-4 flex gap-3">
//               <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={handleFeatureKeyDown} placeholder="Example: WhatsApp Shared Inbox" className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100" />

//               <button type="button" onClick={addFeature} className="flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-700">
//                 <Plus size={17} />
//                 Add
//               </button>
//             </div>

//             {form.features.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 {form.features.map((feature,index) => (
//                   <div key={`${feature}-${index}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
//                     <span className="text-sm text-gray-700">{feature}</span>

//                     <button type="button" onClick={() => removeFeature(index)} className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>

//         </form>

//         <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-5">
//           <button type="button" onClick={handleClose} disabled={loading} className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed">
//             Cancel
//           </button>

//           <button type="button" onClick={handleSubmit} disabled={loading} className="rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-60">
//             {loading ? "Creating..." : "Create Plan"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// function LimitInput({ label,name,value,onChange,placeholder }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
//       <input type="number" name={name} value={value} onChange={onChange} placeholder={placeholder} required className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100" />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function AddSubscriptionPlanModal({
  open,
  onClose,
  onSubmit,
  editPlan = null,
}) {
  const initialForm = {
    planName: "",
    price: "",
    durationDays: "30",
    maxUsers: "",
    maxCustomers: "",
    maxCampaigns: "",
    maxTemplates: "",
    features: [],
    isTrial: false,
    status: "ACTIVE",
  };

  const [form, setForm] = useState(initialForm);
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editPlan) {
      setForm({
        planName: editPlan.planName || "",
        price: editPlan.price?.toString() || "",
        durationDays: editPlan.durationDays?.toString() || "30",
        maxUsers: editPlan.maxUsers?.toString() || "",
        maxCustomers: editPlan.maxCustomers?.toString() || "",
        maxCampaigns: editPlan.maxCampaigns?.toString() || "",
        maxTemplates: editPlan.maxTemplates?.toString() || "",
        features: editPlan.features || [],
        isTrial: editPlan.isTrial || false,
        status: editPlan.status || "ACTIVE",
      });
    } else {
      setForm(initialForm);
    }

    setFeatureInput("");
  }, [open, editPlan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTrialChange = (e) => {
    const checked = e.target.checked;

    setForm((prev) => ({
      ...prev,
      isTrial: checked,
      price: checked ? "0" : prev.price,
      durationDays: checked ? "14" : prev.durationDays,
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

    const payload = {
      planName: form.planName.trim(),
      price: Number(form.price || 0),
      durationDays: Number(form.durationDays),
      maxUsers: Number(form.maxUsers),
      maxCustomers: Number(form.maxCustomers),
      maxCampaigns: Number(form.maxCampaigns),
      maxTemplates: Number(form.maxTemplates),
      features: form.features,
      isTrial: form.isTrial,
      status: form.status,
    };

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
              Configure pricing, limits and plan features.
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
                placeholder="Professional"
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

          </div>



          {/* Limits */}

          <div className="mt-6">

            <h3 className="text-lg font-semibold">
              Usage Limits
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

              <LimitInput
                label="Maximum Users"
                name="maxUsers"
                value={form.maxUsers}
                onChange={handleChange}
                placeholder="20"
              />

              <LimitInput
                label="Maximum Customers"
                name="maxCustomers"
                value={form.maxCustomers}
                onChange={handleChange}
                placeholder="10000"
              />

              <LimitInput
                label="Maximum Campaigns"
                name="maxCampaigns"
                value={form.maxCampaigns}
                onChange={handleChange}
                placeholder="-1"
              />

              <LimitInput
                label="Maximum Templates"
                name="maxTemplates"
                value={form.maxTemplates}
                onChange={handleChange}
                placeholder="20"
              />

            </div>

          </div>

          {/* Features */}

          <div className="mt-6">

            <h3 className="text-lg font-semibold">
              Features
            </h3>

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
function LimitInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}