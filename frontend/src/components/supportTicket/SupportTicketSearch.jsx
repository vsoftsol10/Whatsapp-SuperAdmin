import { Search } from "lucide-react";

export default function SupportTicketSearch({
  search,
  setSearch,
  priority,
  setPriority,
  status,
  setStatus
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">

      <div className="relative flex-1">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by company or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100"
        />

      </div>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100 md:w-auto md:min-w-[180px]"
      >
        <option value="ALL">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-green-100 md:w-auto md:min-w-[180px]"
      >
        <option value="ALL">All Status</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

    </div>
  );
}
