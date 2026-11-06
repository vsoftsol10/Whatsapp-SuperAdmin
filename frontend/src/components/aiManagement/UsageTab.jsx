import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { getUsage, getUnanswered, apiError } from "../../api/aiManagementApi";
import { Card, StatCard, Spinner, inputCls, fmtNum, fmtMoney } from "./ui";

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 text-xs shadow">
      <p className="font-semibold text-gray-900">{d.day}</p>
      <p>{fmtNum(d.tokens)} tokens</p>
      <p>{d.messages} answers</p>
      <p>{fmtMoney(d.cost, currency)}</p>
    </div>
  );
}

export default function UsageTab() {
  const [days, setDays] = useState(30);
  const [usage, setUsage] = useState(null);
  const [unanswered, setUnanswered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [u, q] = await Promise.all([getUsage(days), getUnanswered()]);
        if (!cancelled) {
          setUsage(u);
          setUnanswered(q.items);
        }
      } catch (error) {
        if (!cancelled) toast.error(apiError(error, "Could not load usage."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [days]);

  if (loading && !usage) return <Spinner />;
  if (!usage) return null;

  const { month, feedback, currency } = usage;
  const rated = feedback.helpful + feedback.notHelpful;
  const helpfulPct = rated ? Math.round((feedback.helpful / rated) * 100) : null;
  const limitPct =
    month.globalLimit > 0 ? Math.round((month.tokens / month.globalLimit) * 100) : null;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">This month (UTC)</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Tokens used" value={fmtNum(month.tokens)}
            sub={limitPct !== null ? `${limitPct}% of global limit` : "no global limit"} />
          <StatCard label="Cost" value={fmtMoney(month.cost, currency)}
            sub={`${fmtNum(month.promptTokens)} in · ${fmtNum(month.completionTokens)} out`} />
          <StatCard label="Answers" value={fmtNum(month.messages)} sub={`${fmtNum(month.conversations)} conversations`} />
          <StatCard label="Helpful rating"
            value={helpfulPct === null ? "-" : `${helpfulPct}%`}
            sub={`${feedback.helpful} 👍 · ${feedback.notHelpful} 👎 (last ${usage.days} days)`} />
        </div>
      </div>

      <Card
        title="Daily token usage"
        action={
          <select className={`${inputCls} w-auto`} value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }
      >
        {usage.daily.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No usage in this period yet.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usage.daily}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip content={<ChartTooltip currency={currency} />} />
                <Bar dataKey="tokens" fill="#25D366" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Top companies" subtitle={`Last ${usage.days} days`}>
          {usage.topCompanies.length === 0 ? (
            <p className="text-sm text-gray-500">No usage yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2 pr-3">Company</th>
                    <th className="py-2 pr-3">Answers</th>
                    <th className="py-2 pr-3">Tokens</th>
                    <th className="py-2">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usage.topCompanies.map((c) => (
                    <tr key={c.companyId}>
                      <td className="py-2 pr-3 font-medium text-gray-900">{c.companyName}</td>
                      <td className="py-2 pr-3">{fmtNum(c.messages)}</td>
                      <td className="py-2 pr-3">{fmtNum(c.tokens)}</td>
                      <td className="py-2">{fmtMoney(c.cost, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          title="Unanswered questions"
          subtitle={`${usage.unansweredCount} in the last ${usage.days} days. Write documents for these to improve the chatbot.`}
        >
          {unanswered.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing here. The docs cover everything asked so far.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
              {unanswered.map((q) => (
                <li key={q.id} className="py-2 text-sm">
                  <p className="text-gray-900">{q.question || "(question not stored)"}</p>
                  <p className="text-xs text-gray-500">
                    {q.companyName} · {new Date(q.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}