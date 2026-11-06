import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { listTenants, updateTenant, apiError } from "../../api/aiManagementApi";
import { Card, Btn, Toggle, Modal, Field, Spinner, inputCls, fmtNum, fmtMoney } from "./ui";

export default function TenantsTab({ config }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (term = search) => {
    try {
      const res = await listTenants(term);
      setTenants(res.tenants);
    } catch (error) {
      toast.error(apiError(error, "Could not load companies."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleToggle = async (tenant, value) => {
    try {
      await updateTenant(tenant.companyId, { isEnabled: value });
      setTenants((list) =>
        list.map((t) => (t.companyId === tenant.companyId ? { ...t, isEnabled: value } : t))
      );
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const openEdit = (t) =>
    setEditing({
      companyId: t.companyId,
      companyName: t.companyName,
      monthlyTokenLimit: t.monthlyTokenLimit ?? "",
      dailyUserMessageLimit: t.dailyUserMessageLimit ?? "",
    });

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTenant(editing.companyId, {
        monthlyTokenLimit: editing.monthlyTokenLimit === "" ? null : Number(editing.monthlyTokenLimit),
        dailyUserMessageLimit: editing.dailyUserMessageLimit === "" ? null : Number(editing.dailyUserMessageLimit),
      });
      toast.success("Limits saved.");
      setEditing(null);
      load();
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="Companies"
      subtitle={`Turn the chatbot on/off per company and set limits. Defaults: ${fmtNum(
        config.defaultMonthlyTokenLimit
      )} tokens/month and ${config.defaultDailyUserMessages} messages/user/day (0 = unlimited).`}
    >
      <input
        className={`${inputCls} mb-4 sm:max-w-sm`}
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Spinner />
      ) : tenants.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No companies found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <tr>
                <th className="py-2 pr-3">Company</th>
                <th className="py-2 pr-3">Chatbot</th>
                <th className="py-2 pr-3">Tokens this month</th>
                <th className="py-2 pr-3">Daily msgs / user</th>
                <th className="py-2 pr-3">Cost</th>
                <th className="py-2 text-right">Limits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants.map((t) => {
                const limit = t.effectiveMonthlyLimit;
                const pct = limit > 0 ? Math.min(100, (t.tokensUsed / limit) * 100) : 0;

                return (
                  <tr key={t.companyId}>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-gray-900">{t.companyName}</p>
                      <p className="text-xs text-gray-500">{t.plan} · {t.companyStatus}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <Toggle checked={t.isEnabled} onChange={(v) => handleToggle(t, v)} label="Chatbot enabled" />
                    </td>
                    <td className="min-w-[180px] py-3 pr-3">
                      <p className="text-gray-800">
                        {fmtNum(t.tokensUsed)} / {limit > 0 ? fmtNum(limit) : "unlimited"}
                        {t.monthlyTokenLimit !== null && (
                          <span className="ml-1 text-xs text-[#25D366]">custom</span>
                        )}
                      </p>
                      {limit > 0 && (
                        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-1.5 rounded-full ${
                              pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-[#25D366]"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-3 text-gray-700">
                      {t.effectiveDailyLimit > 0 ? t.effectiveDailyLimit : "unlimited"}
                    </td>
                    <td className="py-3 pr-3 text-gray-700">{fmtMoney(t.cost, config.currency)}</td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => openEdit(t)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Edit limits">
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={`Limits: ${editing.companyName}`} onClose={() => setEditing(null)}>
          <div className="grid gap-4">
            <Field
              label="Monthly token limit"
              hint={`Leave empty to use the default (${fmtNum(config.defaultMonthlyTokenLimit)}). 0 = unlimited.`}
            >
              <input type="number" min="0" className={inputCls} value={editing.monthlyTokenLimit}
                onChange={(e) => setEditing({ ...editing, monthlyTokenLimit: e.target.value })} />
            </Field>
            <Field
              label="Daily messages per user"
              hint={`Leave empty to use the default (${config.defaultDailyUserMessages}). 0 = unlimited.`}
            >
              <input type="number" min="0" className={inputCls} value={editing.dailyUserMessageLimit}
                onChange={(e) => setEditing({ ...editing, dailyUserMessageLimit: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-2">
              <Btn variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={handleSave} loading={saving}>Save limits</Btn>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}