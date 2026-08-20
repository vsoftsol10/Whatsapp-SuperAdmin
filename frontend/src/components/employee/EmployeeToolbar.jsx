import { Search } from "lucide-react";

export default function EmployeeToolbar({
  search,
  setSearch,
  status,
  setStatus
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
        />

      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

    </div>
  );
}