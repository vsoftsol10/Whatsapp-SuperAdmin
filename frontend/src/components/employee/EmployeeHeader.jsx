import { Plus } from "lucide-react";

export default function EmployeeHeader({ onAddEmployee }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Employees
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage employee accounts and access.
        </p>

      </div>

      <button
        onClick={onAddEmployee}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a] sm:w-auto"
      >
        <Plus size={18} />
        Add Employee
      </button>

    </div>
  );
}
