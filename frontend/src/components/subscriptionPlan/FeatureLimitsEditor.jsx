import { Copy } from "lucide-react";

// ---------------------------------------------------------------------
// Helpers used by the plan modal
// ---------------------------------------------------------------------

// Form state for one feature: { enabled, unlimited, limit }
// `source` is the saved config of a plan (or undefined for a new plan).
export function buildFormConfig(catalog, source) {
  const form = {};

  catalog.forEach((f) => {
    const saved = source?.[f.key];

    if (saved) {
      const enabled = f.type === "limit" ? true : saved.enabled !== false;
      const unlimited =
        enabled && f.type !== "toggle" && (saved.limit === null || saved.limit === undefined);

      form[f.key] = {
        enabled,
        unlimited,
        limit:
          enabled && !unlimited && saved.limit !== undefined && saved.limit !== null
            ? String(saved.limit)
            : f.defaultLimit !== null && f.defaultLimit !== undefined
              ? String(f.defaultLimit)
              : "",
      };
    } else {
      form[f.key] = {
        enabled: f.defaultOn !== false,
        unlimited: f.type !== "toggle" && (f.defaultLimit === null || f.defaultLimit === undefined),
        limit:
          f.defaultLimit !== null && f.defaultLimit !== undefined
            ? String(f.defaultLimit)
            : "",
      };
    }
  });

  return form;
}

// Checks the form. Returns an error message or null.
export function validateFormConfig(catalog, form) {
  for (const f of catalog) {
    const row = form[f.key];
    if (!row || f.type === "toggle") continue;
    if (f.type !== "limit" && !row.enabled) continue;
    if (row.unlimited) continue;

    const text = String(row.limit ?? "").trim();
    const n = Number(text);

    if (text === "" || !Number.isInteger(n) || n < 0) {
      return `${f.label}: enter a whole number or tick Unlimited`;
    }
    if (f.key === "users" && n < 1) {
      return "Users: the limit must be at least 1";
    }
    if (f.type === "toggle+limit" && n === 0) {
      return `${f.label}: turn the switch off instead of using 0`;
    }
  }
  return null;
}

// Converts the form state to what the backend expects.
export function toPayloadConfig(catalog, form) {
  const payload = {};

  catalog.forEach((f) => {
    const row = form[f.key];
    if (!row) return;

    if (f.type === "toggle") {
      payload[f.key] = { enabled: !!row.enabled };
      return;
    }

    if (f.type !== "limit" && !row.enabled) {
      payload[f.key] = { enabled: false };
      return;
    }

    payload[f.key] = {
      enabled: true,
      limit: row.unlimited ? null : Number(row.limit),
    };
  });

  return payload;
}

// ---------------------------------------------------------------------
// The "Features & Limits" section
// ---------------------------------------------------------------------

export default function FeatureLimitsEditor({
  catalog,
  value,
  onChange,
  copyPlans = [],
  onCopyFrom,
  loading = false,
}) {
  if (loading) {
    return (
      <p className="mt-4 text-sm text-gray-500">Loading features...</p>
    );
  }

  if (!catalog || catalog.length === 0) {
    return (
      <p className="mt-4 text-sm text-red-500">
        Could not load the feature list. Close this window and try again.
      </p>
    );
  }

  const groups = [];
  catalog.forEach((f) => {
    let group = groups.find((g) => g.name === f.group);
    if (!group) {
      group = { name: f.group, items: [] };
      groups.push(group);
    }
    group.items.push(f);
  });

  const update = (key, patch) => onChange(key, patch);

  return (
    <div>
      {copyPlans.length > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <Copy size={16} className="text-gray-500" />
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onCopyFrom(Number(e.target.value));
                e.target.value = "";
              }
            }}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
          >
            <option value="">Copy features & limits from another plan...</option>
            {copyPlans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.planName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 space-y-5">
        {groups.map((group) => (
          <div key={group.name}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {group.name}
            </p>

            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
              {group.items.map((f) => {
                const row = value[f.key];
                if (!row) return null;

                const hasSwitch = f.type !== "limit";
                const hasLimit = f.type !== "toggle";
                const on = hasSwitch ? row.enabled : true;

                return (
                  <div
                    key={f.key}
                    className="flex flex-wrap items-center gap-3 px-4 py-3"
                  >
                    {/* Switch */}
                    {hasSwitch ? (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        onClick={() => update(f.key, { enabled: !row.enabled })}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          on ? "bg-[#25D366]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                            on ? "left-[22px]" : "left-0.5"
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="w-11 shrink-0 text-center text-xs font-medium text-gray-400">
                        Always
                      </span>
                    )}

                    {/* Label */}
                    <span
                      className={`min-w-[150px] flex-1 text-sm font-medium ${
                        on ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {f.label}
                    </span>

                    {/* Limit (hidden when the switch is off) */}
                    {hasLimit && on && (
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          value={row.unlimited ? "" : row.limit}
                          disabled={row.unlimited}
                          placeholder={row.unlimited ? "Unlimited" : "Limit"}
                          onChange={(e) => update(f.key, { limit: e.target.value })}
                          className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#25D366] focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                        />

                        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={row.unlimited}
                            onChange={(e) =>
                              update(f.key, { unlimited: e.target.checked })
                            }
                            className="h-4 w-4 accent-[#25D366]"
                          />
                          Unlimited
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 