import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bot } from "lucide-react";
import { getAiConfig, apiError } from "../api/aiManagementApi";
import { Spinner } from "../components/aiManagement/ui";
import ProviderTab from "../components/aiManagement/ProviderTab";
import InstructionsTab from "../components/aiManagement/InstructionsTab";
import KnowledgeBaseTab from "../components/aiManagement/KnowledgeBaseTab";
import TenantsTab from "../components/aiManagement/TenantsTab";
import UsageTab from "../components/aiManagement/UsageTab";

const TABS = [
  { id: "provider", label: "Provider & Model" },
  { id: "instructions", label: "Instructions" },
  { id: "knowledge", label: "Knowledge Base" },
  { id: "tenants", label: "Companies" },
  { id: "usage", label: "Usage & Cost" },
];

export default function AiManagementPage() {
  const [tab, setTab] = useState("provider");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setData(await getAiConfig());
      } catch (error) {
        toast.error(apiError(error, "Could not load AI settings."));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaved = (config) => setData((d) => ({ ...d, config }));

  if (loading) return <Spinner />;

  if (!data) {
    return <p className="p-6 text-sm text-red-600">Could not load AI settings. Please refresh.</p>;
  }

  const { config, providers, defaultInstructions } = data;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#25D366]/10 p-2.5 text-[#25D366]">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">AI Management</h1>
            <p className="text-sm text-gray-500">
              Control the AI Support chatbot shown inside every client dashboard.
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            config.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
          }`}
        >
          {config.isEnabled ? "Chatbot ON" : "Chatbot OFF"}
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? "border-[#25D366] text-[#25D366]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "provider" && (
        <ProviderTab config={config} providers={providers} onSaved={handleSaved} />
      )}
      {tab === "instructions" && (
        <InstructionsTab
          config={config}
          defaultInstructions={defaultInstructions}
          onSaved={handleSaved}
        />
      )}
      {tab === "knowledge" && <KnowledgeBaseTab />}
      {tab === "tenants" && <TenantsTab config={config} />}
      {tab === "usage" && <UsageTab />}
    </div>
  );
}