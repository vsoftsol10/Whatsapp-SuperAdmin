import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CompanyHeader from "../components/companies/CompanyHeader";
import CompanyStats from "../components/companies/CompanyStats";
import CompanyToolbar from "../components/companies/CompanyToolbar";
import CompanyTable from "../components/companies/CompanyTable";
import AddCompanyModal from "../components/companies/AddCompanyModal";
import ViewCompanyModal from "../components/companies/ViewCompanyModal";
import EditCompanyModal from "../components/companies/EditCompanyModal";
import CompanyCardView from "../components/companies/CompanyCardView";
import CompanyPagination from "../components/companies/CompanyPagination";


import {
  getCompanies,
  getCompanyStats,
  getCompanyById,
  createCompany,
  deleteCompany,
  updateCompany,
  changeCompanyStatus
} from "../services/companyService";

export default function CompaniesPage() {

  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [view, setView] = useState("table");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [openMenu, setOpenMenu] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    loadCompanies();
    loadStats();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await getCompanies();
      setCompanies(res.companies);
    } catch (error) {
      console.log(error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getCompanyStats();
      setStats(res.stats);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCompany = async (data) => {
    try {
      const res = await createCompany(data);

      toast.success(
        res.message || "Company created successfully"
      );

      setShowAddModal(false);

      loadCompanies();
      loadStats();

      return res;

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to create company"
      );

      console.log(error);

      // IMPORTANT:
      // Send the error back to AddCompanyModal
      throw error;
    }
  };

  // ---------------- VIEW ----------------

  const handleView = async (company) => {
    try {
      const res = await getCompanyById(company.companyId);

      console.log("VIEW COMPANY RESPONSE:", res);

      setSelectedCompany(res.company);
      setShowViewModal(true);

    } catch (error) {
      console.error("Failed to fetch company details:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch company details"
      );
    }
  };


  const handleEdit = (company) => {

    setSelectedCompany(company);

    setShowEditModal(true);

  };

  // ---------------- EDIT ----------------

  const handleUpdateCompany = async (companyId, data) => {
    try {
      const res = await updateCompany(companyId, data);

      toast.success(
        res.message || "Company updated successfully"
      );

      setShowEditModal(false);
      setSelectedCompany(null);

      loadCompanies();
      loadStats();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update company"
      );
    }
  };

  // ---------------- STATUS ----------------

  const handleStatus = async (company) => {
    const newStatus =
      company.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    try {
      const res = await changeCompanyStatus(
        company.companyId,
        newStatus
      );

      toast.success(
        res.message || "Company status updated"
      );

      loadCompanies();
      loadStats();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update company status"
      );
    }
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (company) => {
    const confirmDelete = window.confirm(
      `Delete ${company.companyName}?`
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteCompany(company.companyId);

      toast.success(
        res.message || "Company deleted successfully"
      );

      loadCompanies();
      loadStats();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete company"
      );
    }
  };

  // ---------------- SEARCH ----------------

  const filteredCompanies = companies.filter((company) => {

    const keyword = search.toLowerCase();

    const matchesSearch =
      company.companyId.toLowerCase().includes(keyword) ||
      company.companyName.toLowerCase().includes(keyword) ||
      company.ownerName.toLowerCase().includes(keyword) ||
      company.email.toLowerCase().includes(keyword);

    const matchesPlan =
      planFilter === "ALL" ||
      company.plan?.toLowerCase() === planFilter.toLowerCase();

    return matchesSearch && matchesPlan;

  });

  // ---------------- PAGINATION ----------------

  const totalPages = Math.ceil(
    filteredCompanies.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (

    <div className="space-y-6 p-6">

      <CompanyHeader
        onAddCompany={() => setShowAddModal(true)}
      />

      <CompanyStats
        stats={stats}
      />

      <CompanyToolbar
        search={search}
        setSearch={setSearch}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        view={view}
        setView={setView}
      />

      {view === "table" ? (
        <CompanyTable
          companies={paginatedCompanies}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onView={handleView}
          onEdit={handleEdit}
          onStatus={handleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <CompanyCardView
          companies={paginatedCompanies}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onView={handleView}
          onEdit={handleEdit}
          onStatus={handleStatus}
          onDelete={handleDelete}
        />
      )}

      <CompanyPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalItems={filteredCompanies.length}
        itemsPerPage={itemsPerPage}
      />

      <AddCompanyModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateCompany}
      />

      <ViewCompanyModal
        open={showViewModal}
        company={selectedCompany}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCompany(null);
        }}
      />

      <EditCompanyModal

        open={showEditModal}

        company={selectedCompany}

        onClose={() => {
          setShowEditModal(false);
          setSelectedCompany(null);
        }}

        onSubmit={handleUpdateCompany}

      />

    </div>

  );

}