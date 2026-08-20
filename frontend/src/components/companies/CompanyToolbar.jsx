import { Search, Table2, LayoutGrid } from "lucide-react";

export default function CompanyToolbar({
  search,
  setSearch,
  planFilter,
  setPlanFilter,
  view,
  setView
}) {
  const planFilters = [
    "ALL",
    "Trial",
    "Starter",
    "Professional",
    "Enterprise"
  ];

  return (
    <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

      {/* Search + Plan Filters */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative w-full xl:w-[450px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Company ID, Name, Owner or Email..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

        </div>

        {/* Plan Filters */}
        {planFilters.map((plan) => (
          <button
            key={plan}
            onClick={() => setPlanFilter(plan)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              planFilter === plan
                ? "bg-green-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {plan === "ALL" ? "All" : plan}
          </button>
        ))}

      </div>

      {/* Table / Card View */}
      <div className="flex shrink-0 items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">

        {/* Table */}
        <button
          onClick={() => setView("table")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            view === "table"
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Table2 size={18} />
          Table
        </button>

        {/* Card */}
        <button
          onClick={() => setView("card")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            view === "card"
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutGrid size={18} />
          Card
        </button>

      </div>

    </div>
  );
}