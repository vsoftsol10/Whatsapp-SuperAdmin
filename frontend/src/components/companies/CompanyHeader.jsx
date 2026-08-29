import { Plus } from "lucide-react";

export default function CompanyHeader({ onAddCompany }) {

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Companies
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage all companies using your WhatsApp CRM platform.
        </p>
      </div>

      <button
        onClick={onAddCompany}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 sm:w-auto"
      >
        <Plus size={18} />
        Add Company
      </button>

    </div>
  );

}
