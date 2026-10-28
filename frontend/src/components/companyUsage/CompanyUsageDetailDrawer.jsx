import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  X,
  MessageCircle,
  MessagesSquare,
  Camera,
  TriangleAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import PageLoader from "../common/PageLoader";
import UsageStatusBadge from "./UsageStatusBadge";
import { getCompanyUsageDetail } from "../../services/companyUsageService";
import {
  fmt,
  compact,
  fmtDate,
  fmtDateTime,
  AI_TYPE_LABELS,
  CHANNEL_LABELS,
} from "./usageFormat";

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5">
    <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>
    {children}
  </section>
);

const Tile = ({ label, value, hint }) => (
  <div className="rounded-lg bg-gray-50 p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
  </div>
);

const Chip = ({ label, value }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
    {label}
    <b className="text-gray-900">{fmt(value)}</b>
  </span>
);

const statusColor = (status) => {
  switch (status) {
    case "COMPLETED":
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "FAILED":
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "SENDING":
    case "SCHEDULED":
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const StatusPill = ({ status }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColor(
      status
    )}`}
  >
    {status}
  </span>
);

const ConnectionCard = ({ icon: Icon, title, status, name, since, extra }) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 font-medium text-gray-900">
        <Icon size={16} className="text-[#25D366]" />
        {title}
      </div>
      <UsageStatusBadge status={status} />
    </div>

    <p className="mt-3 text-sm text-gray-700">{name || "-"}</p>

    {extra && <p className="mt-1 text-xs text-gray-500">{extra}</p>}

    {since && status === "CONNECTED" && (
      <p className="mt-1 text-xs text-gray-400">Since {fmtDate(since)}</p>
    )}
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const row = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 text-xs shadow">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-gray-600">{fmt(row.calls)} AI calls</p>
      <p className="text-gray-600">{fmt(row.tokens)} tokens</p>
    </div>
  );
};

export default function CompanyUsageDetailDrawer({ companyId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const response = await getCompanyUsageDetail(companyId);

        if (!cancelled) setDetail(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load company details"
        );

        if (!cancelled) onClose();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ai = detail?.ai;
  const typeKeys = ai
    ? Array.from(
        new Set([
          ...Object.keys(ai.month.byType || {}),
          ...Object.keys(ai.all.byType || {}),
        ])
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* panel */}
      <div className="relative flex h-full w-full max-w-3xl flex-col bg-gray-50 shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {detail?.company?.companyName || "Company"}
            </h2>

            {detail && (
              <p className="mt-1 text-sm text-gray-500">
                {detail.company.companyId} · {detail.company.plan} ·{" "}
                {detail.company.status} · expires{" "}
                {fmtDate(detail.company.expiryDate)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {loading && <PageLoader label="Loading details..." />}

          {!loading && detail && (
            <>
              {/* ---------- connections ---------- */}
              <Section title="Connections">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <ConnectionCard
                    icon={MessageCircle}
                    title="WhatsApp"
                    status={detail.whatsapp.status}
                    name={
                      detail.whatsapp.businessName ||
                      detail.whatsapp.phone ||
                      null
                    }
                    extra={
                      detail.whatsapp.phone && detail.whatsapp.businessName
                        ? `${detail.whatsapp.phone}${
                            detail.whatsapp.isCoexistence
                              ? " · also on phone (coexistence)"
                              : ""
                          }`
                        : detail.whatsapp.isCoexistence
                        ? "Also on phone (coexistence)"
                        : null
                    }
                    since={detail.whatsapp.connectedAt}
                  />

                  <ConnectionCard
                    icon={MessagesSquare}
                    title="Facebook"
                    status={detail.facebook.status}
                    name={detail.facebook.name}
                    since={detail.facebook.connectedAt}
                  />

                  <ConnectionCard
                    icon={Camera}
                    title="Instagram"
                    status={detail.instagram.status}
                    name={detail.instagram.name}
                    since={detail.instagram.connectedAt}
                  />
                </div>

                {Object.keys(detail.conversations).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(detail.conversations).map(
                      ([channel, count]) => (
                        <Chip
                          key={channel}
                          label={`${CHANNEL_LABELS[channel] || channel} chats`}
                          value={count}
                        />
                      )
                    )}
                  </div>
                )}
              </Section>

              {/* ---------- ai usage ---------- */}
              <Section title="AI usage">
                {!detail.aiTrackingReady && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                    <TriangleAlert size={14} className="mt-0.5 shrink-0" />
                    AI usage table not found yet. Run prisma db push, then
                    refresh.
                  </div>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      ai.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Auto-reply {ai.enabled ? "on" : "off"}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      ai.leadCaptureEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Lead capture {ai.leadCaptureEnabled ? "on" : "off"}
                  </span>

                  {ai.all.lastUsedAt && (
                    <span className="text-xs text-gray-500">
                      Last used {fmtDateTime(ai.all.lastUsedAt)}
                    </span>
                  )}
                </div>

                {ai.lastError && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                    <b>Last AI error</b>
                    {ai.lastErrorAt ? ` (${fmtDateTime(ai.lastErrorAt)})` : ""}:{" "}
                    {ai.lastError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Tile
                    label="Auto-replies this month"
                    value={fmt(ai.month.autoReplies)}
                  />
                  <Tile
                    label="AI calls this month"
                    value={fmt(ai.month.calls)}
                    hint="replies + lead capture + tests"
                  />
                  <Tile
                    label="Tokens this month"
                    value={compact(ai.month.tokens)}
                    hint={`${compact(ai.month.inputTokens)} in · ${compact(
                      ai.month.outputTokens
                    )} out`}
                  />
                  <Tile
                    label="Tokens all time"
                    value={compact(ai.all.tokens)}
                    hint={`${fmt(ai.all.calls)} calls`}
                  />
                </div>

                {typeKeys.length > 0 && (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                          <th className="py-2 pr-3 font-semibold">Type</th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Calls (month)
                          </th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Tokens (month)
                          </th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Calls (all)
                          </th>
                          <th className="py-2 text-right font-semibold">
                            Tokens (all)
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {typeKeys.map((type) => (
                          <tr key={type}>
                            <td className="py-2 pr-3 text-gray-800">
                              {AI_TYPE_LABELS[type] || type}
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(ai.month.byType[type]?.calls)}
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(ai.month.byType[type]?.tokens)}
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(ai.all.byType[type]?.calls)}
                            </td>
                            <td className="py-2 text-right">
                              {fmt(ai.all.byType[type]?.tokens)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="mb-2 mt-6 text-sm font-medium text-gray-700">
                  AI calls per day (last 30 days)
                </p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ai.daily}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => value.slice(5)}
                        tick={{ fontSize: 11 }}
                        interval={4}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="calls" fill="#25D366" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Section>

              {/* ---------- campaigns ---------- */}
              <Section title="Campaigns">
                <div className="flex flex-wrap gap-2">
                  <Chip label="Total" value={detail.campaigns.total} />
                  <Chip label="Completed" value={detail.campaigns.completed} />
                  <Chip label="Scheduled" value={detail.campaigns.scheduled} />
                  <Chip label="Sending" value={detail.campaigns.sending} />
                  <Chip label="Draft" value={detail.campaigns.draft} />
                  <Chip label="Failed" value={detail.campaigns.failed} />
                </div>

                {detail.campaigns.recent.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                          <th className="py-2 pr-3 font-semibold">Campaign</th>
                          <th className="py-2 pr-3 font-semibold">Status</th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Recipients
                          </th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Sent
                          </th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Read
                          </th>
                          <th className="py-2 pr-3 text-right font-semibold">
                            Failed
                          </th>
                          <th className="py-2 font-semibold">Date</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {detail.campaigns.recent.map((campaign) => (
                          <tr key={campaign.id}>
                            <td className="py-2 pr-3 text-gray-800">
                              {campaign.name}
                            </td>
                            <td className="py-2 pr-3">
                              <StatusPill status={campaign.status} />
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(campaign.totalRecipients)}
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(campaign.sentCount)}
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(campaign.readCount)}
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {fmt(campaign.failedCount)}
                            </td>
                            <td className="py-2 text-gray-500">
                              {fmtDate(
                                campaign.startedAt ||
                                  campaign.scheduledAt ||
                                  campaign.createdAt
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>

              {/* ---------- templates ---------- */}
              <Section title="Templates">
                <div className="flex flex-wrap gap-2">
                  <Chip label="Total" value={detail.templates.total} />
                  <Chip label="Approved" value={detail.templates.approved} />
                  <Chip label="Pending" value={detail.templates.pending} />
                  <Chip label="Rejected" value={detail.templates.rejected} />
                  <Chip label="Draft" value={detail.templates.draft} />
                </div>

                {detail.templates.recent.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                          <th className="py-2 pr-3 font-semibold">Template</th>
                          <th className="py-2 pr-3 font-semibold">Category</th>
                          <th className="py-2 pr-3 font-semibold">Language</th>
                          <th className="py-2 pr-3 font-semibold">Status</th>
                          <th className="py-2 font-semibold">Created</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {detail.templates.recent.map((template) => (
                          <tr key={template.id}>
                            <td className="py-2 pr-3 text-gray-800">
                              {template.name}
                              {template.rejectionReason && (
                                <p className="text-xs text-red-600">
                                  {template.rejectionReason}
                                </p>
                              )}
                            </td>
                            <td className="py-2 pr-3 text-gray-600">
                              {template.category}
                            </td>
                            <td className="py-2 pr-3 text-gray-600">
                              {template.language}
                            </td>
                            <td className="py-2 pr-3">
                              <StatusPill status={template.status} />
                            </td>
                            <td className="py-2 text-gray-500">
                              {fmtDate(template.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
