export const fmt = (value) => Number(value || 0).toLocaleString("en-IN");

// 1250 -> 1.3K, 2400000 -> 2.4M
export const compact = (value) => {
  const n = Number(value || 0);

  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;

  return String(n);
};

export const fmtDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export const fmtDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export const AI_TYPE_LABELS = {
  WHATSAPP_REPLY: "WhatsApp auto-reply",
  SOCIAL_REPLY: "Facebook / Instagram auto-reply",
  LEAD_CAPTURE: "Lead capture",
  TEST: "Test button",
};

export const CHANNEL_LABELS = {
  WHATSAPP: "WhatsApp",
  MESSENGER: "Messenger",
  INSTAGRAM: "Instagram",
};