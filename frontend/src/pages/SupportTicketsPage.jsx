
import { useEffect, useMemo, useState } from "react";
import SupportTicketHeader from "../components/supportTicket/SupportTicketHeader";
import SupportTicketStats from "../components/supportTicket/SupportTicketStats";
import SupportTicketSearch from "../components/supportTicket/SupportTicketSearch";
import SupportTicketTable from "../components/supportTicket/SupportTicketTable";
import AddSupportTicketModal from "../components/supportTicket/AddSupportTicketModal";
import ViewSupportTicketModal from "../components/supportTicket/ViewSupportTicketModal";
import EditSupportTicketModal from "../components/supportTicket/EditSupportTicketModal";
import { toast } from "react-hot-toast";
import Pagination from "../components/common/Pagination";

import {
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket
} from "../services/supportTicketService";

import { getCompanies } from "../services/companyService";
import { getEmployees } from "../services/employeeService";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        ticketRes,
        companyRes,
        employeeRes
      ] = await Promise.all([
        getSupportTickets(),
        getCompanies(),
        getEmployees()
      ]);

      setTickets(ticketRes.tickets || []);
      setCompanies(companyRes.companies || []);
      setEmployees(employeeRes.employees || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, priority, status]);

  const handleCreateTicket = async (data) => {
    try {
      setSaving(true);

      await createSupportTicket(data);

      toast.success("Support ticket created successfully!");

      setOpenAdd(false);

      loadData();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create ticket."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTicket = async (id, data) => {
    try {
      setEditLoading(true);

      await updateSupportTicket(id, data);

      toast.success("Support ticket updated successfully!");

      setOpenEdit(false);
      setSelectedTicket(null);

      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update ticket."
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTicket = async (ticket) => {
    const confirmDelete = window.confirm(
      `Delete ticket #${ticket.id}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteSupportTicket(ticket.id);

      toast.success("Ticket deleted successfully!");

      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete ticket."
      );
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        ticket.company?.companyName
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesPriority =
        priority === "ALL" ||
        ticket.priority === priority;

      const matchesStatus =
        status === "ALL" ||
        ticket.status === status;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    tickets,
    search,
    priority,
    status
  ]);

  // ---------------- PAGINATION ----------------

  const totalPages = Math.ceil(
    filteredTickets.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedTickets =
    filteredTickets.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (
    <div className="space-y-6">

      <SupportTicketHeader
        onAddTicket={() => setOpenAdd(true)}
      />

      <SupportTicketStats
        tickets={tickets}
      />

      {/* <SupportTicketFilter
      search={search}
      setSearch={setSearch}
    /> */}

      <SupportTicketSearch
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
      />

      <SupportTicketTable
        tickets={paginatedTickets}
        loading={loading}
        onView={(ticket) => {
          setSelectedTicket(ticket);
          setOpenView(true);
        }}
        onEdit={(ticket) => {
          setSelectedTicket(ticket);
          setOpenEdit(true);
        }}
        onAssign={(ticket) => {
          console.log(ticket);
        }}
        onDelete={handleDeleteTicket}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddSupportTicketModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleCreateTicket}
        companies={companies}
        employees={employees}
        loading={saving}
      />

      <ViewSupportTicketModal
        open={openView}
        ticket={selectedTicket}
        onClose={() => {
          setOpenView(false);
          setSelectedTicket(null);
        }}
      />

      <EditSupportTicketModal
        open={openEdit}
        ticket={selectedTicket}
        companies={companies}
        employees={employees}
        onClose={() => {
          setOpenEdit(false);
          setSelectedTicket(null);
        }}
        onUpdate={handleUpdateTicket}
        loading={editLoading}
      />

    </div>
  );
}