

// import { useEffect, useState } from "react";
// import { X, PlusCircle } from "lucide-react";

// import { addTicketNote } from "../../services/supportTicketNoteService";

// export default function EditSupportTicketModal({
//   open,
//   ticket,
//   onClose,
//   onUpdate,
//   employees = [],
//   loading = false,
// }) {

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     status: "OPEN",
//     employeeId: "",
//   });

//   // Progress Note
//   const [note, setNote] = useState("");
//   const [addingNote, setAddingNote] = useState(false);

//   useEffect(() => {
//     if (ticket) {
//       setForm({
//         title: ticket.title || "",
//         description: ticket.description || "",
//         priority: ticket.priority || "MEDIUM",
//         status: ticket.status || "OPEN",
//         employeeId: ticket.employeeId || "",
//       });

//       setNote("");
//     }
//   }, [ticket]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };
  

//   const handleAddNote = async () => {
//     if (!note.trim()) return;

//     try {
//       setAddingNote(true);

//       await addTicketNote(ticket.id, {
//         note,
//         createdById: "admin",
//         createdByName: "Super Admin",
//       });

//       alert("Progress note added successfully.");

//       setNote("");
//     } catch (error) {
//       console.log(error);
//       alert("Failed to add note");
//     } finally {
//       setAddingNote(false);
//     }
//   };

// const handleSubmit = (e) => {
//   e.preventDefault();

//   onUpdate(ticket.id, {
//     title: form.title,
//     description: form.description,
//     priority: form.priority,
//     status: form.status,
//     employeeId: form.employeeId || null,
//   });
// };

//   if (!open || !ticket) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

//       <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

//         {/* Header */}

//         <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">
//               Edit Support Ticket
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Update ticket details and add progress notes.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-2 transition hover:bg-gray-100"
//           >
//             <X size={22} />
//           </button>

//         </div>

//         {/* Form */}

//         <form
//           id="edit-ticket-form"
//           onSubmit={handleSubmit}
//           className="flex-1 overflow-y-auto px-8 py-7"
//         >

//           {/* Ticket ID */}

//           <div className="mb-7 rounded-xl border border-green-200 bg-green-50 px-5 py-4">

//             <p className="text-xs uppercase tracking-wider text-gray-500">
//               Ticket ID
//             </p>

//             <p className="mt-1 text-lg font-semibold text-[#25D366]">
//               #{ticket.id}
//             </p>

//           </div>

//           {/* Form */}

//           <div className="grid grid-cols-2 gap-6">

//             {/* Title */}

//             <div className="col-span-2">

//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Ticket Title
//               </label>

//               <input
//                 type="text"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />

//             </div>

//             {/* Description */}

//             <div className="col-span-2">

//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Description
//               </label>

//               <textarea
//                 rows={5}
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 required
//                 className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               />

//             </div>

//             {/* Priority */}

//             <div>

//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Priority
//               </label>

//               <select
//                 name="priority"
//                 value={form.priority}
//                 onChange={handleChange}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="LOW">Low</option>
//                 <option value="MEDIUM">Medium</option>
//                 <option value="HIGH">High</option>
//                 <option value="URGENT">Urgent</option>
//               </select>

//             </div>

//             {/* Status */}

//             <div>

//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Status
//               </label>

//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="OPEN">Open</option>
//                 <option value="IN_PROGRESS">In Progress</option>
//                 <option value="RESOLVED">Resolved</option>
//                 <option value="CLOSED">Closed</option>
//               </select>

//             </div>

//           </div>

//           {/* Assign Employee */}

//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Assign Employee
//             </label>

//             <select
//               name="employeeId"
//               value={form.employeeId}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//             >
//               <option value="">
//                 Unassigned
//               </option>

//               {employees.map((employee) => (
//                 <option
//                   key={employee.id}
//                   value={employee.id}
//                 >
//                   {employee.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Progress Notes */}

//           <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">

//             <div className="flex items-center justify-between">

//               <div>

//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Progress Update
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-500">
//                   Add an internal work update. These notes will appear in the
//                   View Ticket page.
//                 </p>

//               </div>

//               <PlusCircle
//                 className="text-[#25D366]"
//                 size={28}
//               />

//             </div>

//             <textarea
//               rows={4}
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Example: Contacted customer, verified issue, waiting for logs..."
//               className="mt-5 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
//             />

//             <div className="mt-5 flex justify-end">

//               <button
//                 type="button"
//                 onClick={handleAddNote}
//                 disabled={addingNote || !note.trim()}
//                 className="rounded-xl bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {addingNote ? "Adding..." : "Add Progress Note"}
//               </button>

//             </div>

//           </div>

//         </form>
//         {/* Footer */}

//         <div className="flex items-center justify-between border-t border-gray-200 bg-white px-8 py-5">

//           <div>
//             <p className="text-sm text-gray-500">
//               Progress notes are saved immediately.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">

//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               form="edit-ticket-form"
//               disabled={loading}
//               className="rounded-xl bg-[#25D366] px-7 py-3 font-semibold text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "Updating..." : "Update Ticket"}
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";

import { addTicketNote } from "../../services/supportTicketNoteService";

export default function EditSupportTicketModal({
  open,
  ticket,
  onClose,
  onUpdate,
  employees = [],
  loading = false,
}) {
  const initialData = {
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "OPEN",
    employeeId: "",
  };

  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Progress Note
  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // =========================
  // LOAD TICKET DATA
  // =========================

  useEffect(() => {
    if (open && ticket) {
      setForm({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "MEDIUM",
        status: ticket.status || "OPEN",
        employeeId: ticket.employeeId || "",
      });

      setErrors({});
      setNote("");
    }
  }, [open, ticket]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear only the field being edited
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
    // TITLE
    // -------------------------

    const title = form.title.trim();

    if (!title) {
      newErrors.title = "Ticket title is required";
    } else if (title.length < 3) {
      newErrors.title =
        "Ticket title must be at least 3 characters";
    } else if (title.length > 150) {
      newErrors.title =
        "Ticket title cannot exceed 150 characters";
    }

    // -------------------------
    // DESCRIPTION
    // -------------------------

    const description = form.description.trim();

    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description =
        "Description must be at least 10 characters";
    } else if (description.length > 1000) {
      newErrors.description =
        "Description cannot exceed 1000 characters";
    }

    // -------------------------
    // PRIORITY
    // -------------------------

    const validPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ];

    if (!form.priority) {
      newErrors.priority = "Priority is required";
    } else if (!validPriorities.includes(form.priority)) {
      newErrors.priority = "Invalid priority";
    }

    // -------------------------
    // STATUS
    // -------------------------

    const validStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    if (!form.status) {
      newErrors.status = "Status is required";
    } else if (!validStatuses.includes(form.status)) {
      newErrors.status = "Invalid ticket status";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // ADD PROGRESS NOTE
  // =========================

  const handleAddNote = async () => {
    if (!note.trim()) return;

    try {
      setAddingNote(true);

      await addTicketNote(ticket.id, {
        note: note.trim(),
        createdById: "admin",
        createdByName: "Super Admin",
      });

      alert("Progress note added successfully.");

      setNote("");
    } catch (error) {
      console.log(error);
      alert("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    onUpdate(ticket.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      employeeId: form.employeeId || null,
    });
  };

  if (!open || !ticket) return null;

  // =========================
  // INPUT CLASS
  // =========================

  const inputClass = (fieldName) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[fieldName]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-[#25D366] focus:ring-green-100"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Support Ticket
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update ticket details and add progress notes.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* ================= FORM ================= */}

        <form
          id="edit-ticket-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto px-8 py-7"
        >

          {/* ================= TICKET ID ================= */}

          <div className="mb-7 rounded-xl border border-green-200 bg-green-50 px-5 py-4">

            <p className="text-xs uppercase tracking-wider text-gray-500">
              Ticket ID
            </p>

            <p className="mt-1 text-lg font-semibold text-[#25D366]">
              #{ticket.id}
            </p>

          </div>

          {/* ================= TICKET FIELDS ================= */}

          <div className="grid grid-cols-2 gap-6">

            {/* ================= TITLE ================= */}

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Ticket Title{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Webhook not working"
                maxLength={150}
                aria-invalid={!!errors.title}
                className={inputClass("title")}
              />

              {errors.title && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.title}
                </p>
              )}

            </div>

            {/* ================= DESCRIPTION ================= */}

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue..."
                maxLength={1000}
                aria-invalid={!!errors.description}
                className={`${inputClass(
                  "description"
                )} resize-none`}
              />

              <div className="mt-1 flex items-center justify-between">

                {errors.description ? (
                  <p className="text-sm text-red-500">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-gray-400">
                  {form.description.length}/1000
                </span>

              </div>

            </div>

            {/* ================= PRIORITY ================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priority{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                aria-invalid={!!errors.priority}
                className={inputClass("priority")}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {errors.priority && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.priority}
                </p>
              )}

            </div>

            {/* ================= STATUS ================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status{" "}
                <span className="font-bold text-red-500">*</span>
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                aria-invalid={!!errors.status}
                className={inputClass("status")}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              {errors.status && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.status}
                </p>
              )}

            </div>

          </div>

          {/* ================= ASSIGN EMPLOYEE ================= */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Assign Employee
            </label>

            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
            >

              <option value="">
                Unassigned
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ))}

            </select>

          </div>

          {/* ================= PROGRESS NOTES ================= */}

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-gray-900">
                  Progress Update
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add an internal work update. These notes will
                  appear in the View Ticket page.
                </p>

              </div>

              <PlusCircle
                className="text-[#25D366]"
                size={28}
              />

            </div>

            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Example: Contacted customer, verified issue, waiting for logs..."
              className="mt-5 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
            />

            <div className="mt-5 flex justify-end">

              <button
                type="button"
                onClick={handleAddNote}
                disabled={addingNote || !note.trim()}
                className="rounded-xl bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addingNote
                  ? "Adding..."
                  : "Add Progress Note"}
              </button>

            </div>

          </div>

        </form>

        {/* ================= FOOTER ================= */}

        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-8 py-5">

          <div>
            <p className="text-sm text-gray-500">
              Progress notes are saved immediately.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="edit-ticket-form"
              disabled={loading}
              className="rounded-xl bg-[#25D366] px-7 py-3 font-semibold text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Ticket"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}