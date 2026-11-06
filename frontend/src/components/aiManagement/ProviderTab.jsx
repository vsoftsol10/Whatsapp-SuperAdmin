import { useState } from "react";
import toast from "react-hot-toast";
import { saveAiConfig, testAiConnection, apiError } from "../../api/aiManagementApi";
import { Card, Field, Toggle, Btn, inputCls } from "./ui";

const NUMBER_FIELDS = [
  "defaultMonthlyTokenLimit",
  "defaultDailyUserMessages",
  "globalMonthlyTokenLimit",
  "inputPricePerM",
  "outputPricePerM",
  "temperature",
  "maxOutputTokens",
  "historyLimit",
  "topK",
];

export default function ProviderTab({ config, providers, onSaved }) {
  const [form, setForm] = useState({
    provider: config.provider,
    model: config.model,
    apiKey: "",
    defaultMonthlyTokenLimit: config.defaultMonthlyTokenLimit,
    defaultDailyUserMessages: config.defaultDailyUserMessages,
    globalMonthlyTokenLimit: config.globalMonthlyTokenLimit,
    inputPricePerM: config.inputPricePerM,
    outputPricePerM: config.outputPricePerM,
    currency: config.currency,
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
    historyLimit: config.historyLimit,
    topK: config.topK,
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const provider = providers.find((p) => p.id === form.provider);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleProvider = (id) => {
    const next = providers.find((p) => p.id === id);
    setForm((f) => ({ ...f, provider: id, model: next?.defaultModel || f.model, apiKey: "" }));
    setTestResult(null);
  };

  const buildPayload = () => {
    const payload = { ...form };
    if (!payload.apiKey.trim()) delete payload.apiKey;
    NUMBER_FIELDS.forEach((k) => (payload[k] = Number(payload[k])));
    return payload;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await saveAiConfig(buildPayload());
      toast.success(res.message || "Saved.");
      set("apiKey", "");
      onSaved(res.config);
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await testAiConnection({
        provider: form.provider,
        model: form.model,
        apiKey: form.apiKey.trim() || undefined,
      });
      setTestResult({ ok: true, text: `Connected in ${res.latencyMs} ms (reply: "${res.reply}")` });
    } catch (error) {
      setTestResult({ ok: false, text: apiError(error, "Connection failed.") });
    } finally {
      setTesting(false);
    }
  };

  const handleSwitch = async (value) => {
    if (
      !value &&
      !window.confirm("Turn the chatbot OFF for every company? The chat widget will disappear.")
    ) {
      return;
    }
    try {
      setSwitching(true);
      const res = await saveAiConfig({ isEnabled: value });
      toast.success(value ? "Chatbot is now ON for all enabled companies." : "Chatbot turned OFF.");
      onSaved(res.config);
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setSwitching(false);
    }
  };

  const handleRemoveKey = async () => {
    if (!window.confirm("Remove the saved API key? The chatbot will stop working.")) return;
    try {
      const res = await saveAiConfig({ removeKey: true, isEnabled: false });
      toast.success("API key removed.");
      onSaved(res.config);
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <div className="space-y-5">
      <Card
        title="Chatbot status"
        subtitle="Master switch. Individual companies can also be turned off in the Companies tab."
        action={
          <Toggle
            checked={config.isEnabled}
            onChange={handleSwitch}
            disabled={switching}
            label="Chatbot enabled"
          />
        }
      >
        <p className="text-sm text-gray-600">
          {config.isEnabled
            ? "The AI Support chatbot is ON."
            : "The AI Support chatbot is OFF. Save a working API key, then switch it on."}
        </p>
      </Card>

      <Card title="AI provider & model" subtitle="One API key is shared by all companies, so set usage limits below.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Provider">
            <select
              className={inputCls}
              value={form.provider}
              onChange={(e) => handleProvider(e.target.value)}
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Model" hint="Pick from the list or type any model name your provider supports.">
            <input
              className={inputCls}
              list="chatbot-models"
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
            />
            <datalist id="chatbot-models">
              {(provider?.models || []).map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="API key"
              hint={
                config.keyUnreadable
                  ? "A key is saved but cannot be read (the encryption secret changed). Enter the key again."
                  : config.hasKey && form.provider === config.provider
                  ? `Saved key: ${config.keyMasked}. Leave blank to keep it.`
                  : provider?.keyUrl
                  ? `Get a key from ${provider.keyUrl}`
                  : ""
              }
            >
              <input
                type="password"
                autoComplete="new-password"
                className={inputCls}
                placeholder={provider?.keyPlaceholder || "API key"}
                value={form.apiKey}
                onChange={(e) => set("apiKey", e.target.value)}
              />
            </Field>
            <p className="mt-1 text-xs text-gray-500">
              The key is stored encrypted and is never shown again or sent to client dashboards.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Btn variant="outline" onClick={handleTest} loading={testing}>
            Test connection
          </Btn>
          {config.hasKey && (
            <Btn variant="outline" onClick={handleRemoveKey}>
              Remove saved key
            </Btn>
          )}
          {testResult && (
            <span className={`text-sm ${testResult.ok ? "text-green-600" : "text-red-600"}`}>
              {testResult.text}
            </span>
          )}
        </div>
      </Card>

      <Card
        title="Usage limits"
        subtitle="Protects your shared key. Use 0 for unlimited. Each company can be given its own limit in the Companies tab."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Default monthly tokens / company">
            <input type="number" min="0" className={inputCls} value={form.defaultMonthlyTokenLimit}
              onChange={(e) => set("defaultMonthlyTokenLimit", e.target.value)} />
          </Field>
          <Field label="Default daily messages / user">
            <input type="number" min="0" className={inputCls} value={form.defaultDailyUserMessages}
              onChange={(e) => set("defaultDailyUserMessages", e.target.value)} />
          </Field>
          <Field label="Global monthly tokens (all companies)">
            <input type="number" min="0" className={inputCls} value={form.globalMonthlyTokenLimit}
              onChange={(e) => set("globalMonthlyTokenLimit", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card
        title="Cost tracking"
        subtitle="Enter your provider's price per 1,000,000 tokens (check their pricing page). Used only to calculate the cost shown in Usage."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Input price / 1M tokens">
            <input type="number" min="0" step="0.0001" className={inputCls} value={form.inputPricePerM}
              onChange={(e) => set("inputPricePerM", e.target.value)} />
          </Field>
          <Field label="Output price / 1M tokens">
            <input type="number" min="0" step="0.0001" className={inputCls} value={form.outputPricePerM}
              onChange={(e) => set("outputPricePerM", e.target.value)} />
          </Field>
          <Field label="Currency">
            <input className={inputCls} maxLength={5} value={form.currency}
              onChange={(e) => set("currency", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Answer behaviour" subtitle="Advanced. The defaults work well for documentation support.">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Creativity (0-1)" hint="Lower = more factual">
            <input type="number" min="0" max="1" step="0.1" className={inputCls} value={form.temperature}
              onChange={(e) => set("temperature", e.target.value)} />
          </Field>
          <Field label="Max answer tokens">
            <input type="number" min="100" max="2000" className={inputCls} value={form.maxOutputTokens}
              onChange={(e) => set("maxOutputTokens", e.target.value)} />
          </Field>
          <Field label="Chat memory (messages)">
            <input type="number" min="0" max="20" className={inputCls} value={form.historyLimit}
              onChange={(e) => set("historyLimit", e.target.value)} />
          </Field>
          <Field label="Doc pieces per answer">
            <input type="number" min="1" max="10" className={inputCls} value={form.topK}
              onChange={(e) => set("topK", e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="flex justify-end">
        <Btn onClick={handleSave} loading={saving}>
          Save settings
        </Btn>
      </div>
    </div>
  );
}