import { useEffect, useState } from "react";

import { getAuditLogs } from "../services/auditLogService";

import AuditLogTable from "../components/auditlog/AuditLogTable";
import AuditLogFilters from "../components/auditlog/AuditLogFilters";

export default function AuditLogsPage() {

    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [entityType, setEntityType] = useState("");

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

    const filteredLogs = auditLogs.filter((log) => {

        const searchText = search.toLowerCase();

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

        return (
            matchesSearch &&
            matchesAction &&
            matchesEntity
        );
    });

    return (
        <div className="p-6">

            {/* Header */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Audit Logs
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Track important activities performed in the system.
                </p>

            </div>

            <AuditLogFilters
                search={search}
                setSearch={setSearch}
                action={action}
                setAction={setAction}
                entityType={entityType}
                setEntityType={setEntityType}
                onClear={() => {
                    setSearch("");
                    setAction("");
                    setEntityType("");
                }}
            />

            {/* Loading */}

            {loading && (
                <div className="rounded-xl bg-white p-6 shadow">
                    <p className="text-gray-500">
                        Loading audit logs...
                    </p>
                </div>
            )}

            {/* Error */}

            {!loading && error && (
                <div className="rounded-xl bg-white p-6 shadow">
                    <p className="text-red-500">
                        {error}
                    </p>
                </div>
            )}

            {/* Table */}

            {!loading && !error && (
                <AuditLogTable
                    auditLogs={filteredLogs}
                />
            )}

        </div>
    );
}