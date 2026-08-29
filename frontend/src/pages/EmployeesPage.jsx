import { useEffect, useState } from "react";
import EmployeeHeader from "../components/employee/EmployeeHeader";
import EmployeeToolbar from "../components/employee/EmployeeToolbar";
import EmployeeTable from "../components/employee/EmployeeTable";
import AddEmployeeModal from "../components/employee/AddEmployeeModal";
import ViewEmployeeModal from "../components/employee/ViewEmployeeModal";
import EditEmployeeModal from "../components/employee/EditEmployeeModal";
import Pagination from "../components/common/Pagination";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { toast } from "react-hot-toast";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  changeEmployeeStatus
} from "../services/employeeService";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [openAdd, setOpenAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openView, setOpenView] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const res = await getEmployees();

      setEmployees(res.employees || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  const handleCreateEmployee = async (data) => {
    try {
      setSaving(true);

      await createEmployee(data);

      toast.success("Employee created successfully!");

      setOpenAdd(false);

      loadEmployees();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create employee."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {

    const matchesSearch =
      employee.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      employee.username
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      employee.email
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "ALL" ||
      employee.status === status;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      setDeleteLoading(true);

      await deleteEmployee(employeeToDelete.employeeId);

      toast.success("Employee deleted successfully!");

      loadEmployees();
      setEmployeeToDelete(null);
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete employee."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangeStatus = async (employee) => {
    try {
      const newStatus =
        employee.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      await changeEmployeeStatus(
        employee.employeeId,
        {
          status: newStatus
        }
      );

      toast.success(
        `Employee ${newStatus.toLowerCase()} successfully`
      );

      loadEmployees();

    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
        "Failed to update employee status"
      );
    }
  };

  const handleUpdateEmployee = async (id, data) => {
    try {
      setEditLoading(true);

      await updateEmployee(id, data);

      toast.success("Employee updated successfully!");

      setOpenEdit(false);
      setSelectedEmployee(null);

      loadEmployees();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update employee."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ---------------- PAGINATION ----------------

  const totalPages = Math.ceil(
    filteredEmployees.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (
    <div className="space-y-6 p-4 sm:p-6">

      <EmployeeHeader
        onAddEmployee={() => setOpenAdd(true)}
      />

      <EmployeeToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <EmployeeTable
        employees={paginatedEmployees}
        loading={loading}
        onView={(employee) => {
          setSelectedEmployee(employee);
          setOpenView(true);
        }}
        onEdit={(employee) => {
          setSelectedEmployee(employee);
          setOpenEdit(true);
        }}
        onStatus={handleChangeStatus}
        onDelete={handleDeleteEmployee}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddEmployeeModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleCreateEmployee}
        loading={saving}
      />

      <ViewEmployeeModal
        open={openView}
        employee={selectedEmployee}
        onClose={() => {
          setOpenView(false);
          setSelectedEmployee(null);
        }}
      />

      <EditEmployeeModal
        open={openEdit}
        employee={selectedEmployee}
        onClose={() => {
          setOpenEdit(false);
          setSelectedEmployee(null);
        }}
        onUpdate={handleUpdateEmployee}
        loading={editLoading}
      />

      <ConfirmationModal
        open={Boolean(employeeToDelete)}
        message="Are you sure you want to delete this employee?"
        itemName={employeeToDelete?.name}
        onCancel={() => setEmployeeToDelete(null)}
        onConfirm={confirmDeleteEmployee}
        loading={deleteLoading}
      />

    </div>
  );
}
