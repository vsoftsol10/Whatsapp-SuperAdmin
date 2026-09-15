
// import { useEffect, useState } from "react";
// import {
//   Download,
//   RefreshCw,
//   Database,
//   CheckCircle,
//   XCircle,
//   Clock,
//   HardDrive,
//   Loader2,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const API_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// export default function Backups() {
//   const [backups, setBackups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);

//   // ==========================================
//   // GET TOKEN
//   // ==========================================

//   const getToken = () => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("authToken") ||
//       sessionStorage.getItem("token") ||
//       sessionStorage.getItem("authToken")
//     );
//   };

//   // ==========================================
//   // FETCH BACKUPS
//   // ==========================================

//   const fetchBackups = async () => {
//     try {
//       setLoading(true);

//       const token = getToken();

//       if (!token) {
//         toast.error("Authentication token not found.");
//         return;
//       }

//       const response = await fetch(
//         `${API_URL}/super-admin/backups`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to fetch backups."
//         );
//       }

//       setBackups(data.backups || []);
//     } catch (error) {
//       console.error("FETCH BACKUPS ERROR:", error);
//       toast.error(error.message || "Failed to fetch backup history.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // CREATE BACKUP
//   // ==========================================

//   const createBackup = async () => {
//     try {
//       setCreating(true);

//       const token = getToken();

//       if (!token) {
//         toast.error("Authentication token not found.");
//         return;
//       }

//       const response = await fetch(
//         `${API_URL}/super-admin/backups`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to create backup."
//         );
//       }

//       if (data.success) {
//         toast.success("Backup created successfully.");

//         await fetchBackups();
//       } else {
//         toast.error(
//           data.message || "Failed to create backup."
//         );
//       }
//     } catch (error) {
//       console.error("CREATE BACKUP ERROR:", error);
//       toast.error(
//         error.message || "Failed to create backup."
//       );
//     } finally {
//       setCreating(false);
//     }
//   };

//   // ==========================================
//   // DOWNLOAD BACKUP
//   // ==========================================

//   const downloadBackup = async (backup) => {
//     try {
//       const token = getToken();

//       if (!token) {
//         toast.error("Authentication token not found.");
//         return;
//       }

//       const response = await fetch(
//         `${API_URL}/super-admin/backups/${backup.id}/download`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json().catch(() => null);

//         throw new Error(
//           data?.message || "Failed to download backup."
//         );
//       }

//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");

//       link.href = url;

//       link.download =
//         backup.fileName ||
//         `SuperAdmin_Backup_${backup.backupId}.zip`;

//       document.body.appendChild(link);

//       link.click();

//       link.remove();

//       window.URL.revokeObjectURL(url);

//       toast.success("Backup download started.");
//     } catch (error) {
//       console.error("DOWNLOAD BACKUP ERROR:", error);

//       toast.error(
//         error.message || "Failed to download backup."
//       );
//     }
//   };

//   // ==========================================
//   // FORMAT DATE
//   // ==========================================

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };

//   // ==========================================
//   // FORMAT FILE SIZE
//   // ==========================================

//   const formatFileSize = (size) => {
//     if (!size) return "-";

//     const bytes = Number(size);

//     if (bytes < 1024) {
//       return `${bytes} B`;
//     }

//     if (bytes < 1024 * 1024) {
//       return `${(bytes / 1024).toFixed(2)} KB`;
//     }

//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//   };

//   // ==========================================
//   // LOAD BACKUPS
//   // ==========================================

//   useEffect(() => {
//     fetchBackups();
//   }, []);

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">

//       {/* HEADER */}

//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Super Admin Backups
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Create and manage backups of Super Admin data.
//           </p>
//         </div>

//         <div className="flex gap-3">

//           <button
//             type="button"
//             onClick={fetchBackups}
//             disabled={loading}
//             className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             <RefreshCw
//               size={17}
//               className={loading ? "animate-spin" : ""}
//             />

//             Refresh
//           </button>

//           <button
//             type="button"
//             onClick={createBackup}
//             disabled={creating}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {creating ? (
//               <>
//                 <Loader2
//                   size={17}
//                   className="animate-spin"
//                 />

//                 Creating...
//               </>
//             ) : (
//               <>
//                 <Database size={17} />

//                 Create Backup
//               </>
//             )}
//           </button>

//         </div>
//       </div>

//       {/* SUMMARY CARDS */}

//       <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Total Backups
//               </p>

//               <h2 className="mt-1 text-2xl font-bold text-gray-900">
//                 {backups.length}
//               </h2>
//             </div>

//             <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
//               <Database size={22} />
//             </div>

//           </div>
//         </div>

//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Completed
//               </p>

//               <h2 className="mt-1 text-2xl font-bold text-gray-900">
//                 {
//                   backups.filter(
//                     (backup) =>
//                       backup.status === "COMPLETED"
//                   ).length
//                 }
//               </h2>
//             </div>

//             <div className="rounded-lg bg-green-50 p-3 text-green-600">
//               <CheckCircle size={22} />
//             </div>

//           </div>
//         </div>

//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 In Progress
//               </p>

//               <h2 className="mt-1 text-2xl font-bold text-gray-900">
//                 {
//                   backups.filter(
//                     (backup) =>
//                       backup.status === "IN_PROGRESS"
//                   ).length
//                 }
//               </h2>
//             </div>

//             <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
//               <Clock size={22} />
//             </div>

//           </div>
//         </div>

//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Failed
//               </p>

//               <h2 className="mt-1 text-2xl font-bold text-gray-900">
//                 {
//                   backups.filter(
//                     (backup) =>
//                       backup.status === "FAILED"
//                   ).length
//                 }
//               </h2>
//             </div>

//             <div className="rounded-lg bg-red-50 p-3 text-red-600">
//               <XCircle size={22} />
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* BACKUP TABLE */}

//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

//         <div className="border-b border-gray-200 px-5 py-4">

//           <div className="flex items-center gap-2">
//             <HardDrive
//               size={19}
//               className="text-gray-600"
//             />

//             <h2 className="font-semibold text-gray-900">
//               Backup History
//             </h2>
//           </div>

//         </div>

//         {loading ? (
//           <div className="flex min-h-[300px] items-center justify-center">

//             <Loader2
//               size={30}
//               className="animate-spin text-[#25D366]"
//             />

//           </div>
//         ) : backups.length === 0 ? (
//           <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

//             <Database
//               size={42}
//               className="mb-3 text-gray-300"
//             />

//             <h3 className="font-semibold text-gray-700">
//               No backups found
//             </h3>

//             <p className="mt-1 text-sm text-gray-500">
//               Create your first Super Admin backup.
//             </p>

//           </div>
//         ) : (
//           <div className="overflow-x-auto">

//             <table className="w-full min-w-[1100px]">

//               <thead>
//                 <tr className="border-b border-gray-200 bg-gray-50 text-left">

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Backup ID
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Type
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Status
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     File
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Size
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Records
//                   </th>

//                   <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Created
//                   </th>

//                   <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Action
//                   </th>

//                 </tr>
//               </thead>

//               <tbody>

//                 {backups.map((backup) => (

//                   <tr
//                     key={backup.id}
//                     className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
//                   >

//                     {/* BACKUP ID */}

//                     <td className="px-5 py-4">

//                       <div className="font-mono text-sm font-medium text-gray-900">
//                         {backup.backupId}
//                       </div>

//                     </td>

//                     {/* TYPE */}

//                     <td className="px-5 py-4">

//                       <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
//                         {backup.backupType}
//                       </span>

//                     </td>

//                     {/* STATUS */}

//                     <td className="px-5 py-4">

//                       {backup.status === "COMPLETED" && (
//                         <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
//                           <CheckCircle size={13} />
//                           Completed
//                         </span>
//                       )}

//                       {backup.status === "IN_PROGRESS" && (
//                         <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
//                           <Clock size={13} />
//                           In Progress
//                         </span>
//                       )}

//                       {backup.status === "FAILED" && (
//                         <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
//                           <XCircle size={13} />
//                           Failed
//                         </span>
//                       )}

//                     </td>

//                     {/* FILE */}

//                     <td className="px-5 py-4">

//                       <div className="max-w-[260px] truncate text-sm text-gray-700">
//                         {backup.fileName || "-"}
//                       </div>

//                     </td>

//                     {/* SIZE */}

//                     <td className="px-5 py-4 text-sm text-gray-600">
//                       {formatFileSize(backup.fileSize)}
//                     </td>

//                     {/* RECORDS */}

//                     <td className="px-5 py-4">

//                       {backup.status === "COMPLETED" ? (
//                         <div className="text-xs text-gray-600">
//                           <div>
//                             Companies:{" "}
//                             <b>{backup.companiesCount}</b>
//                           </div>

//                           <div>
//                             Subscriptions:{" "}
//                             <b>{backup.subscriptionsCount}</b>
//                           </div>

//                           <div>
//                             Employees:{" "}
//                             <b>{backup.employeesCount}</b>
//                           </div>

//                           <div>
//                             Audit Logs:{" "}
//                             <b>{backup.auditLogsCount}</b>
//                           </div>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-400">
//                           -
//                         </span>
//                       )}

//                     </td>

//                     {/* CREATED */}

//                     <td className="px-5 py-4">

//                       <div className="text-sm text-gray-700">
//                         {formatDate(backup.createdAt)}
//                       </div>

//                     </td>

//                     {/* ACTION */}

//                     <td className="px-5 py-4 text-right">

//                       <button
//                         type="button"
//                         onClick={() =>
//                           downloadBackup(backup)
//                         }
//                         disabled={
//                           backup.status !== "COMPLETED" ||
//                           !backup.fileName
//                         }
//                         className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
//                         title={
//                           backup.status !== "COMPLETED"
//                             ? "Backup is not ready"
//                             : "Download backup"
//                         }
//                       >
//                         <Download size={16} />

//                         Download
//                       </button>

//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>
//         )}

//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  Download,
  RefreshCw,
  Database,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  Plus,
  FileArchive,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Backups() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken")
    );
  };

  // ==========================================
  // FETCH BACKUPS
  // ==========================================

  const fetchBackups = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/super-admin/backups`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch backups."
        );
      }

      setBackups(data.backups || []);
    } catch (error) {
      console.error("FETCH BACKUPS ERROR:", error);

      toast.error(
        error.message || "Failed to fetch backup history."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CREATE BACKUP
  // ==========================================

  const createBackup = async () => {
    try {
      setCreating(true);

      const token = getToken();

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/super-admin/backups`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create backup."
        );
      }

      if (data.success) {
        toast.success("Backup created successfully.");
        await fetchBackups();
      } else {
        toast.error(
          data.message || "Failed to create backup."
        );
      }
    } catch (error) {
      console.error("CREATE BACKUP ERROR:", error);

      toast.error(
        error.message || "Failed to create backup."
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // DOWNLOAD BACKUP
  // ==========================================

  const downloadBackup = async (backup) => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/super-admin/backups/${backup.id}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message || "Failed to download backup."
        );
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        backup.fileName ||
        `SuperAdmin_Backup_${backup.backupId}.zip`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Backup download started.");
    } catch (error) {
      console.error("DOWNLOAD BACKUP ERROR:", error);

      toast.error(
        error.message || "Failed to download backup."
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // FORMAT DATE ONLY
  // ==========================================

  const formatDateOnly = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (size) => {
    if (!size) return "—";

    const bytes = Number(size);

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(
      bytes /
      (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
  };

  // ==========================================
  // SHORT ID
  // ==========================================

  const shortId = (id) => {
    if (!id) return "—";

    return `${String(id).substring(0, 8)}...`;
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          icon: CheckCircle2,
          className:
            "bg-[#dcfce7] text-[#008a3e]",
        };

      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: Clock3,
          className:
            "bg-[#fef3c7] text-[#a16207]",
        };

      case "FAILED":
        return {
          label: "Failed",
          icon: XCircle,
          className:
            "bg-[#fee2e2] text-[#dc2626]",
        };

      default:
        return {
          label: status || "Unknown",
          icon: Clock3,
          className:
            "bg-gray-100 text-gray-600",
        };
    }
  };

  // ==========================================
  // GET LATEST COMPLETED BACKUP
  // ==========================================

  const latestBackup =
    backups
      .filter(
        (backup) => backup.status === "COMPLETED"
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )[0] || null;

  // ==========================================
  // COUNTS
  // ==========================================

  const totalBackups = backups.length;

  const completedBackups = backups.filter(
    (backup) => backup.status === "COMPLETED"
  ).length;

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* TITLE */}

          <div className="flex items-center gap-4">

            {/* <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dcfce7]">
              <Database
                size={28}
                className="text-[#00a63e]"
              />
            </div> */}

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-[30px]">
                Backup 
              </h1>

              <p className="mt-1 text-sm text-[#64748b] sm:text-base">
                Create and manage backups of your CRM data.
              </p>
            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex w-full gap-3 sm:w-auto">

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchBackups}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm font-medium text-[#334155] shadow-sm transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

            {/* CREATE BACKUP */}

            <button
              type="button"
              onClick={createBackup}
              disabled={creating}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00a63e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008f36] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {creating ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />

                  Create Backup
                </>
              )}
            </button>

          </div>
        </div>

        {/* ==================================================
            PROTECTION INFORMATION
        ================================================== */}

        <div className="mb-7 flex items-start gap-4 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-5 sm:px-6">

          <ShieldCheck
            size={23}
            className="mt-0.5 shrink-0 text-[#008a3e]"
          />

          <div className="min-w-0">

            <h3 className="text-sm font-semibold text-[#007a36] sm:text-base">
              Your CRM data is protected
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#008a3e]">
              Backups contain company CRM data only.
              Passwords and WhatsApp access tokens are not included.
            </p>

          </div>

        </div>

        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-[#64748b]">
                  Total Backups
                </p>

                <p className="mt-3 text-3xl font-bold text-[#111827]">
                  {totalBackups}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0fdf4]">
                <Database
                  size={22}
                  className="text-[#00a63e]"
                />
              </div>

            </div>

            <p className="mt-4 text-sm text-[#64748b]">
              All created backups
            </p>

          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-[#64748b]">
                  Completed
                </p>

                <p className="mt-3 text-3xl font-bold text-[#111827]">
                  {completedBackups}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0fdf4]">
                <CheckCircle2
                  size={22}
                  className="text-[#00a63e]"
                />
              </div>

            </div>

            <p className="mt-4 text-sm text-[#64748b]">
              Successfully completed
            </p>

          </div>

          {/* LATEST BACKUP */}

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div className="min-w-0">

                <p className="text-sm font-medium text-[#64748b]">
                  Latest Backup
                </p>

                <p className="mt-3 truncate text-2xl font-bold text-[#111827]">
                  {latestBackup
                    ? formatDateOnly(
                      latestBackup.createdAt
                    )
                    : "—"}
                </p>

              </div>

              <div className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0fdf4]">
                <Database
                  size={22}
                  className="text-[#00a63e]"
                />
              </div>

            </div>

            <p
              className="mt-4 truncate text-sm text-[#64748b]"
              title={
                latestBackup?.fileName || ""
              }
            >
              {latestBackup?.fileName ||
                "No completed backup yet"}
            </p>

          </div>

        </div>

        {/* ==================================================
            BACKUP HISTORY
        ================================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-[#e2e8f0] px-6 py-6">

            <h2 className="text-xl font-semibold text-[#111827]">
              Backup History
            </h2>

            <p className="mt-1 text-sm text-[#64748b] sm:text-base">
              View and download your previous CRM backups.
            </p>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">

              <Loader2
                size={30}
                className="animate-spin text-[#00a63e]"
              />

              <p className="mt-3 text-sm text-[#64748b]">
                Loading backups...
              </p>

            </div>
          ) : backups.length === 0 ? (

            /* ==================================================
                EMPTY
            ================================================== */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f5f9]">
                <FileArchive
                  size={30}
                  className="text-[#94a3b8]"
                />
              </div>

              <h3 className="mt-5 text-base font-semibold text-[#334155]">
                No backups found
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-[#64748b]">
                You haven't created any backups yet.
                Create your first backup to protect your CRM data.
              </p>

              <button
                type="button"
                onClick={createBackup}
                disabled={creating}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#00a63e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008f36]"
              >
                <Plus size={17} />
                Create Backup
              </button>

            </div>
          ) : (

            <>
              {/* ==================================================
                  DESKTOP TABLE
                  NO HORIZONTAL SCROLL
              ================================================== */}

              <div className="hidden w-full lg:block">

                <table className="w-full table-fixed">

                  <colgroup>
                    <col className="w-[30%]" />
                    <col className="w-[10%]" />
                    <col className="w-[18%]" />
                    <col className="w-[18%]" />
                    <col className="w-[10%]" />
                    <col className="w-[14%]" />
                  </colgroup>

                  <thead>

                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">

                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#64748b]">
                        Backup
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#64748b]">
                        Type
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#64748b]">
                        Status
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#64748b]">
                        Created
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#64748b]">
                        Size
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-[#64748b]">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-[#f1f5f9]">

                    {backups.map((backup) => {

                      const status = getStatus(
                        backup.status
                      );

                      const StatusIcon =
                        status.icon;

                      return (
                        <tr
                          key={backup.id}
                          className="transition hover:bg-[#f8fafc]"
                        >

                          {/* BACKUP */}

                          <td className="px-6 py-5">

                            <div className="flex min-w-0 items-center gap-4">

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f1f5f9]">
                                <FileArchive
                                  size={23}
                                  className="text-[#64748b]"
                                />
                              </div>

                              <div className="min-w-0">

                                <p
                                  className="truncate text-sm font-semibold text-[#111827]"
                                  title={
                                    backup.fileName ||
                                    "Backup file"
                                  }
                                >
                                  {backup.fileName ||
                                    "Backup file"}
                                </p>

                                <p className="mt-1 text-xs text-[#64748b]">
                                  ID:{" "}
                                  {shortId(
                                    backup.backupId ||
                                    backup.id
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* TYPE */}

                          <td className="px-4 py-5">

                            <span className="text-sm text-[#334155]">
                              {backup.backupType ===
                                "FULL" ||
                                backup.backupType ===
                                "MANUAL"
                                ? "Manual"
                                : backup.backupType ||
                                "Manual"}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-5">

                            <div className="flex min-w-0 flex-col items-start gap-1">

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                              >

                                <StatusIcon size={14} />

                                {status.label}

                              </span>

                              {backup.status ===
                                "FAILED" &&
                                backup.errorMessage && (
                                  <span
                                    className="max-w-full truncate text-xs text-red-500"
                                    title={
                                      backup.errorMessage
                                    }
                                  >
                                    {
                                      backup.errorMessage
                                    }
                                  </span>
                                )}

                            </div>

                          </td>

                          {/* CREATED */}

                          <td className="px-4 py-5">

                            <span className="whitespace-nowrap text-sm text-[#475569]">
                              {formatDate(
                                backup.createdAt
                              )}
                            </span>

                          </td>

                          {/* SIZE */}

                          <td className="px-4 py-5">

                            <span className="whitespace-nowrap text-sm text-[#334155]">
                              {formatFileSize(
                                backup.fileSize
                              )}
                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-4 py-5 text-right">
                            <button
                              type="button"
                              onClick={() => downloadBackup(backup)}
                              disabled={
                                backup.status !== "COMPLETED" ||
                                !backup.fileName
                              }
                              className="inline-flex min-w-[132px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] shadow-sm transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
                              title={
                                backup.status !== "COMPLETED"
                                  ? "Backup is not ready"
                                  : "Download backup"
                              }
                            >
                              <Download size={17} />
                              Download
                            </button>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

              {/* ==================================================
                  MOBILE / TABLET CARDS
                  NO HORIZONTAL SCROLL
              ================================================== */}

              <div className="divide-y divide-[#f1f5f9] lg:hidden">

                {backups.map((backup) => {

                  const status = getStatus(
                    backup.status
                  );

                  const StatusIcon =
                    status.icon;

                  return (
                    <div
                      key={backup.id}
                      className="p-5 sm:p-6"
                    >

                      {/* TOP */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f5f9]">
                          <FileArchive
                            size={21}
                            className="text-[#64748b]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p
                            className="truncate text-sm font-semibold text-[#111827]"
                            title={
                              backup.fileName ||
                              "Backup file"
                            }
                          >
                            {backup.fileName ||
                              "Backup file"}
                          </p>

                          <p className="mt-1 text-xs text-[#64748b]">
                            ID:{" "}
                            {shortId(
                              backup.backupId ||
                              backup.id
                            )}
                          </p>

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-5 grid grid-cols-2 gap-4">

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                            Type
                          </p>

                          <p className="mt-1 text-sm text-[#334155]">
                            Manual
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                            Status
                          </p>

                          <div className="mt-1">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                            >

                              <StatusIcon size={13} />

                              {status.label}

                            </span>

                          </div>

                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                            Created
                          </p>

                          <p className="mt-1 text-sm text-[#475569]">
                            {formatDate(
                              backup.createdAt
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                            Size
                          </p>

                          <p className="mt-1 text-sm text-[#334155]">
                            {formatFileSize(
                              backup.fileSize
                            )}
                          </p>
                        </div>

                      </div>

                      {/* ERROR */}

                      {backup.status ===
                        "FAILED" &&
                        backup.errorMessage && (
                          <p
                            className="mt-4 text-xs text-red-500"
                            title={
                              backup.errorMessage
                            }
                          >
                            {backup.errorMessage}
                          </p>
                        )}

                      {/* DOWNLOAD */}

                      <button
                        type="button"
                        onClick={() =>
                          downloadBackup(
                            backup
                          )
                        }
                        disabled={
                          backup.status !==
                          "COMPLETED" ||
                          !backup.fileName
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        <Download size={17} />

                        Download

                      </button>

                    </div>
                  );
                })}

              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}