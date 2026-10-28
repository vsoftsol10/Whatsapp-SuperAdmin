const STYLES = {
  CONNECTED: "bg-green-100 text-green-700",
  RECONNECT_NEEDED: "bg-amber-100 text-amber-700",
  DISCONNECTED: "bg-red-100 text-red-700",
  NOT_CONNECTED: "bg-gray-100 text-gray-600",
};

const LABELS = {
  CONNECTED: "Connected",
  RECONNECT_NEEDED: "Reconnect needed",
  DISCONNECTED: "Disconnected",
  NOT_CONNECTED: "Not connected",
};

export default function UsageStatusBadge({ status }) {
  const key = status || "NOT_CONNECTED";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
        STYLES[key] || STYLES.NOT_CONNECTED
      }`}
    >
      {LABELS[key] || key}
    </span>
  );
}
