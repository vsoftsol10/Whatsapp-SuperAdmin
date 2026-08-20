import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AddSupportTicketModal({
  open,
  onClose,
  onSubmit,
  companies = [],
  employees = [],
  loading = false
}) {

  const initialData = {
    companyId: "",
    employeeId: "",
    title: "",
    description: "",
    priority: "MEDIUM"
  };

  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initialData);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(form);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.companyId) {
      newErrors.companyId = "Company is required";
    }

    if (!form.title.trim()) {
      newErrors.title = "Ticket title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Ticket title must be at least 3 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters";
    }

    if (!form.priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              Add Support Ticket
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new support ticket.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <form
          id="add-ticket-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-7"
        >

          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

            <p className="text-xs uppercase tracking-wide text-gray-500">
              Ticket ID
            </p>

            <p className="mt-1 font-semibold text-[#25D366]">
              Auto Generated
            </p>

          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Company <span className="text-red-500">*</span>
              </label>

              <select
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
              >
                <option value="">
                  Select Company
                </option>

                {companies.map((company) => (

                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.companyName}
                  </option>

                ))}

              </select>
              {errors.companyId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.companyId}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Assign Employee
              </label>

              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
              >

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

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Ticket Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Webhook not working"
                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366] ${errors.title
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title}
                </p>
              )}

            </div>

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="5"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue..."
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-[#25D366] ${errors.description
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Priority <span className="text-red-500">*</span>
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[#25D366] ${errors.priority
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {errors.priority && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.priority}
                </p>
              )}

            </div>

          </div>

        </form>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-200 px-7 py-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-ticket-form"
            disabled={loading}
            className="rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#20bd5a]"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>

        </div>

      </div>

    </div>
  );
}