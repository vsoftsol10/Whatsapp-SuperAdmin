// // import { useState, useEffect } from "react";
// // import { X } from "lucide-react";

// // export default function AddEmployeeModal({
// //   open,
// //   onClose,
// //   onSave,
// //   loading = false
// // }) {
// //   const initialData = {
// //     name: "",
// //     username: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     status: "ACTIVE"
// //   };

// //   const [form, setForm] = useState(initialData);

// //   useEffect(() => {
// //     if (open) {
// //       setForm(initialData);
// //     }
// //   }, [open]);

// //   const handleChange = (e) => {
// //     setForm({
// //       ...form,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     onSave(form);
// //   };

// //   if (!open) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

// //       <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

// //         <div className="flex items-center justify-between border-b px-6 py-5">

// //           <div>

// //             <h2 className="text-xl font-bold text-gray-900">
// //               Add Employee
// //             </h2>

// //             <p className="mt-1 text-sm text-gray-500">
// //               Create a new employee account.
// //             </p>

// //           </div>

// //           <button
// //             onClick={onClose}
// //             className="rounded-lg p-2 hover:bg-gray-100"
// //           >
// //             <X size={20} />
// //           </button>

// //         </div>

// //         <form onSubmit={handleSubmit}>

// //           <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

// //             <div>

// //               <label className="mb-2 block text-sm font-medium">
// //                 Employee Name
// //               </label>

// //               <input
// //                 type="text"
// //                 name="name"
// //                 value={form.name}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366]"
// //               />

// //             </div>

// //             <div>

// //               <label className="mb-2 block text-sm font-medium">
// //                 Username
// //               </label>

// //               <input
// //                 type="text"
// //                 name="username"
// //                 value={form.username}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366]"
// //               />

// //             </div>

// //             <div>

// //               <label className="mb-2 block text-sm font-medium">
// //                 Email
// //               </label>

// //               <input
// //                 type="email"
// //                 name="email"
// //                 value={form.email}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366]"
// //               />

// //             </div>

// //             <div>

// //               <label className="mb-2 block text-sm font-medium">
// //                 Phone
// //               </label>

// //               <input
// //                 type="text"
// //                 name="phone"
// //                 value={form.phone}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366]"
// //               />

// //             </div>

// //             <div className="md:col-span-2">

// //               <label className="mb-2 block text-sm font-medium">
// //                 Address
// //               </label>

// //               <textarea
// //                 rows="3"
// //                 name="address"
// //                 value={form.address}
// //                 onChange={handleChange}
// //                 className="w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-[#25D366]"
// //               />

// //             </div>

// //             <div>

// //               <label className="mb-2 block text-sm font-medium">
// //                 Status
// //               </label>

// //               <select
// //                 name="status"
// //                 value={form.status}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366]"
// //               >
// //                 <option value="ACTIVE">
// //                   Active
// //                 </option>

// //                 <option value="INACTIVE">
// //                   Inactive
// //                 </option>

// //               </select>

// //             </div>

// //           </div>

// //           <div className="flex justify-end gap-3 border-t px-6 py-5">

// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="rounded-xl border px-5 py-2.5 font-medium hover:bg-gray-50"
// //             >
// //               Cancel
// //             </button>

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="rounded-xl bg-[#25D366] px-6 py-2.5 font-semibold text-white hover:bg-[#20bd5a]"
// //             >
// //               {loading ? "Creating..." : "Create Employee"}
// //             </button>

// //           </div>

// //         </form>

// //       </div>

// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { X } from "lucide-react";

// export default function AddEmployeeModal({
//   open,
//   onClose,
//   onSave,
//   loading = false,
// }) {
//   const initialData = {
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     address: "",
//     status: "ACTIVE",
//   };

//   const [form, setForm] = useState(initialData);

//   useEffect(() => {
//     if (open) {
//       setForm(initialData);
//     }
//   }, [open]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(form);
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 bg-white px-7 py-5">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">
//               Add Employee
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Create a new employee account for your CRM platform.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <form
//           id="add-employee-form"
//           onSubmit={handleSubmit}
//           className="flex-1 overflow-y-auto p-7"
//         >

//           {/* Employee ID */}
//           <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
//             <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
//               Employee ID
//             </p>

//             <p className="mt-1 font-semibold text-[#25D366]">
//               Auto Generated
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-5">

//             {/* Employee Name */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Employee Name
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="John Smith"
//                 required
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             {/* Username */}
//             {/* <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Username
//               </label>

//               <input
//                 type="text"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 placeholder="johnsmith"
//                 required
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />
//             </div> */}

//             {/* Email */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="john@email.com"
//                 required
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Phone Number
//               </label>

//               <input
//                 type="text"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="+91 9876543210"
//                 required
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             {/* Address */}
//             <div className="col-span-2">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Address
//               </label>

//               <textarea
//                 rows="4"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 placeholder="Enter employee address"
//                 className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             {/* Status */}
//             <div className="col-span-2">
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Employee Status
//               </label>

//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//               </select>
//             </div>

//           </div>
//         </form>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-7 py-5">

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             form="add-employee-form"
//             disabled={loading}
//             className="rounded-xl bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             {loading ? "Creating..." : "Create Employee"}
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { X, ChevronDown, Search, Check } from "lucide-react";

import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";

const countries = getCountries();

export default function AddEmployeeModal({
  open,
  onClose,
  onSave,
  loading = false,
}) {
  const initialData = {
    name: "",
    email: "",
    countryCode: "IN",
    phone: "",
    address: "",
    status: "ACTIVE",
  };

  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialData);
      setErrors({});
    }
  }, [open]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    // -------------------------
    // NAME
    // -------------------------

    const name = form.name.trim();

    if (!name) {
      newErrors.name = "Employee name is required";
    } else if (name.length < 2) {
      newErrors.name = "Employee name must be at least 2 characters";
    } else if (name.length > 50) {
      newErrors.name = "Employee name cannot exceed 50 characters";
    } else if (!/^[A-Za-z\s.'-]+$/.test(name)) {
      newErrors.name = "Employee name contains invalid characters";
    }

    // -------------------------
    // EMAIL
    // -------------------------

    const email = form.email.trim();

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // -------------------------
    // PHONE
    // -------------------------

    const phone = form.phone.trim();

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else {
      const fullPhoneNumber = `+${getCountryCallingCode(
        form.countryCode
      )}${phone}`;

      if (!isValidPhoneNumber(fullPhoneNumber)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // -------------------------
    // ADDRESS
    // -------------------------

    const address = form.address.trim();

    if (!address) {
      newErrors.address = "Address is required";
    } else if (address.length < 5) {
      newErrors.address = "Please enter a valid address";
    } else if (address.length > 250) {
      newErrors.address = "Address cannot exceed 250 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));

    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handlePhoneBlur = () => {
    const phone = form.phone.trim();

    if (!phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number is required",
      }));
      return;
    }

    const fullPhoneNumber = `+${getCountryCallingCode(
      form.countryCode
    )}${phone}`;

    if (!isValidPhoneNumber(fullPhoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
    }
  };

  const handleCountrySelect = (country) => {
    setForm((prev) => ({
      ...prev,
      countryCode: country,
    }));

    setCountryOpen(false);
    setCountrySearch("");

    if (form.phone) {
      const fullPhoneNumber = `+${getCountryCallingCode(
        country
      )}${form.phone}`;

      if (!isValidPhoneNumber(fullPhoneNumber)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Please enter a valid phone number",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone: "",
        }));
      }
    }
  };

  const filteredCountries = countries.filter((country) => {
    const callingCode = getCountryCallingCode(country);

    const searchValue = `${country} ${callingCode}`.toLowerCase();

    return searchValue.includes(countrySearch.toLowerCase());
  });

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    const fullPhoneNumber = `+${getCountryCallingCode(
      form.countryCode
    )}${form.phone.trim()}`;

    if (!isValid) {
      return;
    }

    const submitData = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
       phone: fullPhoneNumber,
      address: form.address.trim(),
    };

    onSave(submitData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

      <div className="flex h-[720px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-7 py-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Employee
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new employee account for your CRM platform.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* ================= FORM ================= */}

        <form
          id="add-employee-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-7"
          noValidate
        >

          {/* ================= EMPLOYEE ID ================= */}

          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Employee ID
            </p>

            <p className="mt-1 font-semibold text-[#25D366]">
              Auto Generated
            </p>

          </div>

          <div className="grid grid-cols-2 gap-5">

            {/* ================= EMPLOYEE NAME ================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Employee Name{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Smith"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-green-100"
                  }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.name}
                </p>
              )}

            </div>

            {/* ================= EMAIL ================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@email.com"
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-green-100"
                  }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email}
                </p>
              )}

            </div>

            {/* ================= PHONE ================= */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <div className="flex gap-2">

                {/* COUNTRY DROPDOWN */}
                <div className="relative w-32">
                  <button
                    type="button"
                    onClick={() => {
                      setCountryOpen(!countryOpen);
                      setCountrySearch("");
                    }}
                    className="flex h-[50px] w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-400 focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
                  >
                    <span>
                      {form.countryCode}{" "}
                      <span className="text-gray-500">
                        +{getCountryCallingCode(form.countryCode)}
                      </span>
                    </span>

                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${countryOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* COUNTRY LIST */}
                  {countryOpen && (
                    <div className="absolute left-0 top-full z-[100] mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                      {/* SEARCH */}
                      <div className="border-b border-gray-200 p-2">
                        <div className="flex items-center rounded-lg border border-gray-200 px-3">
                          <Search
                            size={16}
                            className="shrink-0 text-gray-400"
                          />

                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) =>
                              setCountrySearch(e.target.value)
                            }
                            placeholder="Search code..."
                            className="w-full border-none px-2 py-2 text-sm outline-none"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* COUNTRY LIST */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-green-50"
                          >
                            <span className="font-medium text-gray-700">
                              {country}
                            </span>

                            <span className="flex items-center gap-2">
                              <span className="text-gray-500">
                                +{getCountryCallingCode(country)}
                              </span>

                              {form.countryCode === country && (
                                <Check
                                  size={16}
                                  className="text-[#25D366]"
                                />
                              )}
                            </span>
                          </button>
                        ))}

                        {filteredCountries.length === 0 && (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No country code found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PHONE INPUT */}
                <div className="flex-1">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    placeholder="9876543210"
                    maxLength={15}
                    className={`h-[50px] w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.phone
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-[#25D366] focus:ring-green-100"
                      }`}
                  />

                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* ================= STATUS ================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Employee Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>
              </select>

            </div>

            {/* ================= ADDRESS ================= */}

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <textarea
                rows="4"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter employee address"
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${errors.address
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-[#25D366] focus:ring-green-100"
                  }`}
              />

              {errors.address && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.address}
                </p>
              )}

            </div>

          </div>

        </form>

        {/* ================= FOOTER ================= */}

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-7 py-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-employee-form"
            disabled={loading}
            className="rounded-xl bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>

        </div>

      </div>

    </div>
  );
}