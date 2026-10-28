import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  MessageCircle,
  MessagesSquare,
  Camera,
  Bot,
  Cpu,
  Send,
  Sparkles,
  Search,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import PageLoader from "../components/common/PageLoader";
import UsageStatusBadge from "../components/companyUsage/UsageStatusBadge";
import CompanyUsageDetailDrawer from "../components/companyUsage/CompanyUsageDetailDrawer";
import { getCompanyUsage } from "../services/companyUsageService";
import { fmt, compact } from "../components/companyUsage/usageFormat";

const PAGE_SIZE = 10;

const FILTERS = [
  { value: "ALL", label: "All companies" },
  { value: "WA_CONNECTED", label: "WhatsApp connected" },
  { value: "WA_NOT_CONNECTED", label: "WhatsApp not connected" },
  { value: "FB_CONNECTED", label: "Facebook connected" },
  { value: "IG_CONNECTED", label: "Instagram connected" },
  { value: "AI_ON", label: "AI auto-reply on" },
  { value: "AI_ERROR", label: "AI has an error" },
];

const matchesFilter = (company, filter) => {
  switch (filter) {
    case "WA_CONNECTED":
      return company.whatsapp.status === "CONNECTED";
    case "WA_NOT_CONNECTED":
      return company.whatsapp.status !== "CONNECTED";
    case "FB_CONNECTED":
      return company.facebook.status === "CONNECTED";
    case "IG_CONNECTED":
      return company.instagram.status === "CONNECTED";
    case "AI_ON":
      return company.ai.enabled;
    case "AI_ERROR":
      return !!company.ai.lastError;
    default:
      return true;
  }
};

const planColor = (plan) => {
  switch (plan) {
    case "Trial":
      return "bg-yellow-100 text-yellow-700";
    case "Starter":
      return "bg-blue-100 text-blue-700";
    case "Professional":
      return "bg-green-100 text-green-700";
    case "Enterprise":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const th =
  "px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

export default function CompanyUsagePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);

      const response = await getCompanyUsage();

      setData(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load company usage"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const companies = useMemo(() => data?.companies || [], [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return companies.filter((company) => {
      if (!matchesFilter(company, filter)) return false;
      if (!term) return true;

      return [company.companyName, company.companyId, company.email, company.plan]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [companies, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return <PageLoader variant="page" label="Loading company usage..." />;
  }

  const summary = data?.summary || {};

  const cards = [
    {
      title: "WhatsApp Connected",
      value: `${fmt(summary.whatsappConnected)} / ${fmt(summary.totalCompanies)}`,
      icon: MessageCircle,
    },
    {
      title: "Facebook Connected",
      value: `${fmt(summary.facebookConnected)} / ${fmt(summary.totalCompanies)}`,
      icon: MessagesSquare,
    },
    {
      title: "Instagram Connected",
      value: `${fmt(summary.instagramConnected)} / ${fmt(summary.totalCompanies)}`,
      icon: Camera,
    },
    {
      title: "AI Auto-Reply On",
      value: `${fmt(summary.aiEnabled)} / ${fmt(summary.totalCompanies)}`,
      icon: Bot,
    },
    {
      title: "AI Replies This Month",
      value: fmt(summary.aiRepliesThisMonth),
      icon: Sparkles,
    },
    {
      title: "AI Tokens This Month",
      value: compact(summary.aiTokensThisMonth),
      icon: Cpu,
    },
    {
      title: "Campaign Messages This Month",
      value: fmt(summary.messagesSentThisMonth),
      icon: Send,
    },
    {
      title: "Total Companies",
      value: fmt(summary.totalCompanies),
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ---------- header ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Company Usage</h1>
          <p className="mt-1 text-gray-500">
            Connections, campaigns, templates and AI usage of every company
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {data && data.aiTrackingReady === false && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <p>
            AI usage numbers are not available yet because the AiUsageLog table
            was not found. Add it to the schema, run{" "}
            <code className="rounded bg-amber-100 px-1">npx prisma db push</code>{" "}
            and <code className="rounded bg-amber-100 px-1">npx prisma generate</code>,
            then refresh. Everything else on this page works normally.
          </p>
        </div>
      )}

      {/* ---------- summary cards ---------- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ---------- toolbar ---------- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by company, ID, email or plan"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#25D366]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#25D366]"
        >
          {FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- table ---------- */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className={th}>Company</th>
                <th className={th}>WhatsApp</th>
                <th className={th}>Facebook</th>
                <th className={th}>Instagram</th>
                <th className={th}>Campaigns</th>
                <th className={th}>Templates</th>
                <th className={th}>AI (this month)</th>
                <th className={`${th} text-right`}>Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No companies found
                  </td>
                </tr>
              )}

              {visible.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  {/* company */}
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {company.companyName}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {company.companyId}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${planColor(
                          company.plan
                        )}`}
                      >
                        {company.plan}
                      </span>
                    </div>
                  </td>

                  {/* whatsapp */}
                  <td className="px-4 py-4">
                    <UsageStatusBadge status={company.whatsapp.status} />
                    {company.whatsapp.businessName && (
                      <p className="mt-1 text-xs text-gray-500">
                        {company.whatsapp.businessName}
                      </p>
                    )}
                    {company.whatsapp.phone && (
                      <p className="text-xs text-gray-400">
                        {company.whatsapp.phone}
                      </p>
                    )}
                  </td>

                  {/* facebook */}
                  <td className="px-4 py-4">
                    <UsageStatusBadge status={company.facebook.status} />
                    {company.facebook.name && (
                      <p className="mt-1 text-xs text-gray-500">
                        {company.facebook.name}
                      </p>
                    )}
                  </td>

                  {/* instagram */}
                  <td className="px-4 py-4">
                    <UsageStatusBadge status={company.instagram.status} />
                    {company.instagram.name && (
                      <p className="mt-1 text-xs text-gray-500">
                        {company.instagram.name}
                      </p>
                    )}
                  </td>

                  {/* campaigns */}
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {fmt(company.campaigns.total)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fmt(company.campaigns.startedThisMonth)} this month ·{" "}
                      {fmt(company.campaigns.messagesSentThisMonth)} msgs
                    </p>
                  </td>

                  {/* templates */}
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {fmt(company.templates.total)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fmt(company.templates.approved)} approved ·{" "}
                      {fmt(company.templates.pending)} pending ·{" "}
                      {fmt(company.templates.rejected)} rejected
                    </p>
                  </td>

                  {/* ai */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          company.ai.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {company.ai.enabled ? "On" : "Off"}
                      </span>

                      {company.ai.lastError && (
                        <span
                          title={company.ai.lastError}
                          className="inline-flex items-center gap-1 text-xs text-red-600"
                        >
                          <TriangleAlert size={12} /> Error
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {fmt(company.ai.repliesThisMonth)} replies ·{" "}
                      {compact(company.ai.tokensThisMonth)} tokens
                    </p>
                  </td>

                  {/* action */}
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedId(company.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
          <span>
            {filtered.length === 0
              ? "0 companies"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length}`}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {selectedId && (
        <CompanyUsageDetailDrawer
          companyId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
