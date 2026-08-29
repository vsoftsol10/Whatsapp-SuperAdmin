import { useEffect, useState } from "react";

import {
    getAuditLogs,
    getAuditLogById,
    deleteAuditLog,
} from "../services/auditLogService";

import AuditLogTable from "../components/auditlog/AuditLogTable";
import AuditLogFilters from "../components/auditlog/AuditLogFilters";
import PageLoader from "../components/common/PageLoader";
import Pagination from "../components/common/Pagination";

import {
    X,
    Trash2,
} from "lucide-react";

export default function AuditLogsPage() {

    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [entityType, setEntityType] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // ==========================================
    // VIEW MODAL
    // ==========================================

    const [selectedLog, setSelectedLog] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // ==========================================
    // DELETE MODAL
    // ==========================================

    const [deleteLog, setDeleteLog] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


    // ==========================================
    // FETCH AUDIT LOGS
    // ==========================================

    useEffect(() => {
        fetchAuditLogs();
    }, []);


    const fetchAuditLogs = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAuditLogs();

            setAuditLogs(response.auditLogs || []);

        } catch (error) {

            console.error(
                "Failed to fetch audit logs:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load audit logs"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // VIEW AUDIT LOG
    // ==========================================

    const handleView = async (log) => {

        try {

            setViewLoading(true);

            const response = await getAuditLogById(log.id);

            setSelectedLog(response.auditLog);

        } catch (error) {

            console.error(
                "Failed to fetch audit log:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load audit log"
            );

        } finally {

            setViewLoading(false);

        }

    };


    // ==========================================
    // OPEN DELETE MODAL
    // ==========================================

    const handleDelete = (log) => {

        setDeleteLog(log);

    };


    // ==========================================
    // CONFIRM DELETE
    // ==========================================

    const confirmDelete = async () => {

        if (!deleteLog) {
            return;
        }

        try {

            setDeleteLoading(true);

            await deleteAuditLog(deleteLog.id);

            // Remove deleted log from frontend
            setAuditLogs((previousLogs) =>
                previousLogs.filter(
                    (log) => log.id !== deleteLog.id
                )
            );

            // Close modal
            setDeleteLog(null);

        } catch (error) {

            console.error(
                "Failed to delete audit log:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete audit log"
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    // ==========================================
    // FILTER LOGS
    // ==========================================

    const filteredLogs = auditLogs.filter((log) => {

        const searchText = search
            .toLowerCase()
            .trim();

        const matchesSearch =
            !searchText ||
            log.description?.toLowerCase().includes(searchText) ||
            log.action?.toLowerCase().includes(searchText) ||
            log.entityType?.toLowerCase().includes(searchText) ||
            log.actorType?.toLowerCase().includes(searchText) ||
            log.actorId?.toLowerCase().includes(searchText);

        const matchesAction =
            !action || log.action === action;

        const matchesEntity =
            !entityType || log.entityType === entityType;


        const logDate = log.createdAt
            ? new Date(log.createdAt)
            : null;

        const matchesFromDate =
            !fromDate ||
            (logDate &&
                logDate >= new Date(`${fromDate}T00:00:00`));

        const matchesToDate =
            !toDate ||
            (logDate &&
                logDate <= new Date(`${toDate}T23:59:59.999`));

        return (
            matchesSearch &&
            matchesAction &&
            matchesEntity &&
            matchesFromDate &&
            matchesToDate
        );

    });


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages = Math.ceil(
        filteredLogs.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedLogs =
        filteredLogs.slice(
            startIndex,
            startIndex + itemsPerPage
        );


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    useEffect(() => {
        setCurrentPage(1);
    }, [search, action, entityType, fromDate, toDate]);

    const clearFilters = () => {

        setSearch("");
        setAction("");
        setEntityType("");
        setFromDate("");
        setToDate("");

    };

    return (

        <div className="p-4 sm:p-6">

            {/* ========================================== */}
            {/* HEADER */}
            {/* ========================================== */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Audit Logs
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Track important activities performed in the system.
                </p>

            </div>


            {/* ========================================== */}
            {/* FILTERS */}
            {/* ========================================== */}

            <AuditLogFilters
                search={search}
                setSearch={setSearch}
                action={action}
                setAction={setAction}
                entityType={entityType}
                setEntityType={setEntityType}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                onClear={clearFilters}
            />


            {/* ========================================== */}
            {/* LOADING */}
            {/* ========================================== */}

            {loading && (

                <div className="rounded-xl bg-white p-6 shadow">
                    <PageLoader label="Loading audit logs..." />

                </div>

            )}


            {/* ========================================== */}
            {/* ERROR */}
            {/* ========================================== */}

            {!loading && error && (

                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-red-500">
                        {error}
                    </p>

                </div>

            )}


            {/* ========================================== */}
            {/* TABLE */}
            {/* ========================================== */}

            {!loading && !error && (

                <>
                    <AuditLogTable
                        auditLogs={paginatedLogs}
                        onView={handleView}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        totalItems={filteredLogs.length}
                        itemsPerPage={itemsPerPage}
                        itemName="audit logs"
                    />
                </>

            )}


            {/* ================================================= */}
            {/* VIEW AUDIT LOG MODAL */}
            {/* ================================================= */}

            {selectedLog && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b px-6 py-4">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Audit Log Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Complete activity information
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedLog(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* Content */}

                        <div className="max-h-[70vh] overflow-y-auto p-6">

                            {viewLoading ? (

                                <PageLoader label="Loading audit log..." />

                            ) : (

                                <div className="space-y-5">


                                    {/* Date */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Date & Time
                                        </p>

                                        <p className="mt-1 text-sm text-gray-800">
                                            {selectedLog.createdAt
                                                ? new Date(
                                                    selectedLog.createdAt
                                                ).toLocaleString()
                                                : "-"}
                                        </p>

                                    </div>


                                    {/* Actor */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Actor
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {selectedLog.actorType || "-"}
                                        </p>

                                        <p className="mt-1 break-all text-xs text-gray-500">
                                            {selectedLog.actorId || "-"}
                                        </p>

                                    </div>


                                    {/* Action */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Action
                                        </p>

                                        <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {selectedLog.action || "-"}
                                        </span>

                                    </div>


                                    {/* Entity */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Entity
                                        </p>

                                        <p className="mt-1 text-sm text-gray-800">
                                            {selectedLog.entityType || "-"}
                                        </p>

                                    </div>


                                    {/* Entity ID */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Entity ID
                                        </p>

                                        <p className="mt-1 break-all text-sm text-gray-800">
                                            {selectedLog.entityId || "-"}
                                        </p>

                                    </div>


                                    {/* Company ID */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Company ID
                                        </p>

                                        <p className="mt-1 text-sm text-gray-800">
                                            {selectedLog.companyId || "-"}
                                        </p>

                                    </div>


                                    {/* Description */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Description
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-gray-700">
                                            {selectedLog.description || "-"}
                                        </p>

                                    </div>


                                    {/* Old Value */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Old Value
                                        </p>

                                        <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700">
                                            {selectedLog.oldValue
                                                ? JSON.stringify(
                                                    selectedLog.oldValue,
                                                    null,
                                                    2
                                                )
                                                : "-"}
                                        </pre>

                                    </div>


                                    {/* New Value */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            New Value
                                        </p>

                                        <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700">
                                            {selectedLog.newValue
                                                ? JSON.stringify(
                                                    selectedLog.newValue,
                                                    null,
                                                    2
                                                )
                                                : "-"}
                                        </pre>

                                    </div>


                                    {/* IP Address */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            IP Address
                                        </p>

                                        <p className="mt-1 text-sm text-gray-800">
                                            {selectedLog.ipAddress || "-"}
                                        </p>

                                    </div>


                                    {/* User Agent */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            User Agent
                                        </p>

                                        <p className="mt-1 break-all text-xs text-gray-600">
                                            {selectedLog.userAgent || "-"}
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* Footer */}

                        <div className="flex justify-end border-t px-6 py-4">

                            <button
                                type="button"
                                onClick={() => setSelectedLog(null)}
                                className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* DELETE CONFIRMATION MODAL */}
            {/* ================================================= */}

            {deleteLog && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b px-6 py-4">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Delete Audit Log
                            </h2>

                            <button
                                type="button"
                                onClick={() => setDeleteLog(null)}
                                disabled={deleteLoading}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* Content */}

                        <div className="px-6 py-7">

                            <div className="mb-4 flex justify-center">

                                <div className="rounded-full bg-red-100 p-4">

                                    <Trash2
                                        size={26}
                                        className="text-red-600"
                                    />

                                </div>

                            </div>

                            <p className="text-center text-gray-700">
                                Are you sure you want to delete this audit log?
                            </p>

                            <p className="mt-2 text-center text-sm text-gray-500">
                                This action cannot be undone.
                            </p>

                        </div>


                        {/* Footer */}

                        <div className="flex justify-end gap-3 border-t px-6 py-4">

                            <button
                                type="button"
                                onClick={() => setDeleteLog(null)}
                                disabled={deleteLoading}
                                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <Trash2 size={16} />

                                {deleteLoading
                                    ? "Deleting..."
                                    : "Delete"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}
