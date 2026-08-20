import { Search } from "lucide-react";

export default function SubscriptionToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter
}) {
  const statusFilters = [
    "ALL",
    "ACTIVE",
    "EXPIRED"
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      {/* Search */}
      <div className="relative w-full sm:w-[600px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company, email or plan..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />

      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">

        {statusFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              statusFilter === filter
                ? "bg-green-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter === "ALL"
              ? "All"
              : filter === "ACTIVE"
                ? "Active"
                : "Expired"}
          </button>
        ))}

      </div>

    </div>
  );
}