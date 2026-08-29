import { Plus } from "lucide-react";

export default function SupportTicketHeader({
  onAddTicket
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Support Tickets
        </h1>

        <p className="mt-2 text-gray-500">
          Manage customer support tickets.
        </p>

      </div>

      <button
        onClick={onAddTicket}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:bg-[#1fb85a] md:w-auto"
      >
        <Plus size={20} />

        Add Ticket
      </button>

    </div>
  );
}
