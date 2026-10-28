// ============================================================
// COMPANY USAGE (Super Admin)
// ------------------------------------------------------------
// Read-only overview of every company: WhatsApp / Facebook /
// Instagram connection, campaigns, templates and AI usage.
//
// Only counts and statuses are returned. Message text and access
// tokens are never selected.
// ============================================================

const prisma = require("../config/prisma");

// "This month" and the daily chart follow Indian time (IST, UTC+5:30)
const IST_OFFSET_MS = 330 * 60 * 1000;

const AI_REPLY_TYPES = ["WHATSAPP_REPLY", "SOCIAL_REPLY"];

const getMonthStart = () => {
  const ist = new Date(Date.now() + IST_OFFSET_MS);
  const startAsUtc = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1);
  return new Date(startAsUtc - IST_OFFSET_MS);
};

// The AiUsageLog table is new. If it has not been created yet, the page
// must still work, so every AI query goes through this wrapper.
const aiQuery = async (state, run, fallback) => {
  try {
    if (!prisma.aiUsageLog) {
      state.ready = false;
      return fallback;
    }
    return await run();
  } catch (error) {
    state.ready = false;
    console.error("Company usage (AI) query failed:", error.message);
    return fallback;
  }
};

// ------------------------------------------------------------
// helpers
// ------------------------------------------------------------

const emptyAi = () => ({
  autoReplies: 0,
  calls: 0,
  tokens: 0,
  inputTokens: 0,
  outputTokens: 0,
  byType: {},
  lastUsedAt: null,
});

// rows come from groupBy(["companyId", "type"])
const foldUsage = (rows) => {
  const map = new Map();

  for (const row of rows) {
    const current = map.get(row.companyId) || emptyAi();

    const calls = row._count?._all || 0;
    const tokens = row._sum?.totalTokens || 0;

    current.calls += calls;
    current.tokens += tokens;
    current.inputTokens += row._sum?.inputTokens || 0;
    current.outputTokens += row._sum?.outputTokens || 0;
    current.byType[row.type] = { calls, tokens };

    if (AI_REPLY_TYPES.includes(row.type)) current.autoReplies += calls;

    const last = row._max?.createdAt;
    if (last && (!current.lastUsedAt || last > current.lastUsedAt)) {
      current.lastUsedAt = last;
    }

    map.set(row.companyId, current);
  }

  return map;
};

const WHATSAPP_RANK = { CONNECTED: 3, DISCONNECTED: 2, NOT_CONNECTED: 1 };
const SOCIAL_RANK = { CONNECTED: 3, RECONNECT_NEEDED: 2, DISCONNECTED: 1 };

const byRankThenRecent = (rank) => (a, b) =>
  (rank[b.status] || 0) - (rank[a.status] || 0) ||
  new Date(b.updatedAt) - new Date(a.updatedAt);

const buildWhatsapp = (accounts = []) => {
  if (accounts.length === 0) {
    return { status: "NOT_CONNECTED", accounts: 0, connectedAccounts: 0 };
  }

  const main = [...accounts].sort(byRankThenRecent(WHATSAPP_RANK))[0];

  return {
    status: main.status,
    businessName: main.whatsappBusinessName || null,
    phone: main.displayPhoneNumber || null,
    isCoexistence: !!main.isCoexistence,
    connectedAt: main.connectedAt,
    disconnectedAt: main.disconnectedAt,
    accounts: accounts.length,
    connectedAccounts: accounts.filter((a) => a.status === "CONNECTED").length,
  };
};

// kind = "facebook" | "instagram"
const buildSocial = (pages = [], kind) => {
  const list = pages.filter((page) =>
    kind === "facebook"
      ? page.connectionType !== "INSTAGRAM_LOGIN"
      : !!page.instagramAccountId
  );

  if (list.length === 0) return { status: "NOT_CONNECTED", count: 0 };

  const main = [...list].sort(byRankThenRecent(SOCIAL_RANK))[0];

  return {
    status: main.status,
    name:
      kind === "facebook"
        ? main.pageName || null
        : main.instagramUsername
        ? `@${main.instagramUsername}`
        : null,
    connectedAt: main.connectedAt,
    disconnectedAt: main.disconnectedAt,
    count: list.length,
  };
};

// rows come from groupBy(["companyId", "status"])
const foldStatusCounts = (rows) => {
  const map = new Map();

  for (const row of rows) {
    const current = map.get(row.companyId) || { total: 0, byStatus: {} };
    const count = row._count?._all || 0;

    current.total += count;
    current.byStatus[row.status] = (current.byStatus[row.status] || 0) + count;

    map.set(row.companyId, current);
  }

  return map;
};

const campaignSummary = (entry) => {
  const s = entry?.byStatus || {};
  return {
    total: entry?.total || 0,
    completed: s.COMPLETED || 0,
    scheduled: s.SCHEDULED || 0,
    sending: s.SENDING || 0,
    draft: s.DRAFT || 0,
    failed: s.FAILED || 0,
  };
};

const templateSummary = (entry) => {
  const s = entry?.byStatus || {};
  return {
    total: entry?.total || 0,
    approved: s.APPROVED || 0,
    pending: s.PENDING || 0,
    rejected: s.REJECTED || 0,
    draft: s.DRAFT || 0,
    byStatus: s,
  };
};

const companySelect = {
  id: true,
  companyId: true,
  companyName: true,
  logo: true,
  ownerName: true,
  email: true,
  phone: true,
  plan: true,
  status: true,
  expiryDate: true,
  createdAt: true,
};

// ------------------------------------------------------------
// LIST: one row per company
// ------------------------------------------------------------

const getUsageList = async () => {
  const monthStart = getMonthStart();
  const ai = { ready: true };

  const [
    companies,
    whatsappAccounts,
    socialPages,
    campaignRows,
    campaignMonthRows,
    templateRows,
    aiSettings,
    aiMonthRows,
    aiAllRows,
  ] = await Promise.all([
    prisma.company.findMany({
      select: companySelect,
      orderBy: { createdAt: "desc" },
    }),

    prisma.whatsAppAccount.findMany({
      select: {
        companyId: true,
        status: true,
        whatsappBusinessName: true,
        displayPhoneNumber: true,
        isCoexistence: true,
        connectedAt: true,
        disconnectedAt: true,
        updatedAt: true,
      },
    }),

    prisma.facebookPage.findMany({
      select: {
        companyId: true,
        pageName: true,
        instagramAccountId: true,
        instagramUsername: true,
        connectionType: true,
        status: true,
        connectedAt: true,
        disconnectedAt: true,
        updatedAt: true,
      },
    }),

    prisma.campaign.groupBy({
      by: ["companyId", "status"],
      _count: { _all: true },
    }),

    // campaigns that started this month and the messages they sent
    prisma.campaign.groupBy({
      by: ["companyId"],
      where: { startedAt: { gte: monthStart } },
      _count: { _all: true },
      _sum: { sentCount: true },
    }),

    prisma.template.groupBy({
      by: ["companyId", "status"],
      _count: { _all: true },
    }),

    prisma.aiSettings.findMany({
      where: { companyId: { not: null } },
      select: {
        companyId: true,
        isEnabled: true,
        leadCaptureEnabled: true,
        lastError: true,
        lastErrorAt: true,
      },
    }),

    aiQuery(
      ai,
      () =>
        prisma.aiUsageLog.groupBy({
          by: ["companyId", "type"],
          where: { createdAt: { gte: monthStart } },
          _count: { _all: true },
          _sum: { totalTokens: true, inputTokens: true, outputTokens: true },
          _max: { createdAt: true },
        }),
      []
    ),

    aiQuery(
      ai,
      () =>
        prisma.aiUsageLog.groupBy({
          by: ["companyId", "type"],
          _count: { _all: true },
          _sum: { totalTokens: true, inputTokens: true, outputTokens: true },
          _max: { createdAt: true },
        }),
      []
    ),
  ]);

  // ---- group everything by company id ----
  const group = (rows) => {
    const map = new Map();
    for (const row of rows) {
      const list = map.get(row.companyId) || [];
      list.push(row);
      map.set(row.companyId, list);
    }
    return map;
  };

  const accountsByCompany = group(whatsappAccounts);
  const pagesByCompany = group(socialPages);
  const campaignsByCompany = foldStatusCounts(campaignRows);
  const templatesByCompany = foldStatusCounts(templateRows);
  const aiMonthByCompany = foldUsage(aiMonthRows);
  const aiAllByCompany = foldUsage(aiAllRows);

  const campaignMonthByCompany = new Map(
    campaignMonthRows.map((row) => [row.companyId, row])
  );
  const settingsByCompany = new Map(
    aiSettings.map((row) => [row.companyId, row])
  );

  // ---- build one row per company ----
  const rows = companies.map((company) => {
    const month = aiMonthByCompany.get(company.id) || emptyAi();
    const all = aiAllByCompany.get(company.id) || emptyAi();
    const settings = settingsByCompany.get(company.id);
    const campaignMonth = campaignMonthByCompany.get(company.id);

    return {
      ...company,

      whatsapp: buildWhatsapp(accountsByCompany.get(company.id)),
      facebook: buildSocial(pagesByCompany.get(company.id), "facebook"),
      instagram: buildSocial(pagesByCompany.get(company.id), "instagram"),

      campaigns: {
        ...campaignSummary(campaignsByCompany.get(company.id)),
        startedThisMonth: campaignMonth?._count?._all || 0,
        messagesSentThisMonth: campaignMonth?._sum?.sentCount || 0,
      },

      templates: templateSummary(templatesByCompany.get(company.id)),

      ai: {
        enabled: !!settings?.isEnabled,
        leadCaptureEnabled: !!settings?.leadCaptureEnabled,
        lastError: settings?.lastError || null,
        lastErrorAt: settings?.lastErrorAt || null,
        repliesThisMonth: month.autoReplies,
        callsThisMonth: month.calls,
        tokensThisMonth: month.tokens,
        totalReplies: all.autoReplies,
        totalCalls: all.calls,
        totalTokens: all.tokens,
        lastUsedAt: all.lastUsedAt,
      },
    };
  });

  // ---- numbers for the cards on top of the page ----
  const summary = {
    totalCompanies: rows.length,
    whatsappConnected: rows.filter((r) => r.whatsapp.status === "CONNECTED").length,
    facebookConnected: rows.filter((r) => r.facebook.status === "CONNECTED").length,
    instagramConnected: rows.filter((r) => r.instagram.status === "CONNECTED").length,
    aiEnabled: rows.filter((r) => r.ai.enabled).length,
    aiRepliesThisMonth: rows.reduce((sum, r) => sum + r.ai.repliesThisMonth, 0),
    aiTokensThisMonth: rows.reduce((sum, r) => sum + r.ai.tokensThisMonth, 0),
    messagesSentThisMonth: rows.reduce(
      (sum, r) => sum + r.campaigns.messagesSentThisMonth,
      0
    ),
  };

  return {
    aiTrackingReady: ai.ready,
    monthStart,
    summary,
    companies: rows,
  };
};

// ------------------------------------------------------------
// DETAIL: one company
// ------------------------------------------------------------

const buildLastDays = (rows, days = 30) => {
  const byDate = new Map(rows.map((row) => [row.day, row]));
  const result = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(Date.now() + IST_OFFSET_MS - i * 86400000)
      .toISOString()
      .slice(0, 10);

    const row = byDate.get(day);

    result.push({
      date: day,
      calls: row ? Number(row.calls) : 0,
      tokens: row ? Number(row.tokens) : 0,
    });
  }

  return result;
};

const getUsageDetail = async (id) => {
  const company = await prisma.company.findUnique({
    where: { id },
    select: companySelect,
  });

  if (!company) return null;

  const monthStart = getMonthStart();
  const ai = { ready: true };

  const [
    whatsappAccounts,
    socialPages,
    campaignRows,
    recentCampaigns,
    templateRows,
    recentTemplates,
    conversationRows,
    settings,
    aiMonthRows,
    aiAllRows,
    dailyRows,
  ] = await Promise.all([
    prisma.whatsAppAccount.findMany({
      where: { companyId: id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        status: true,
        whatsappBusinessName: true,
        displayPhoneNumber: true,
        isCoexistence: true,
        connectedAt: true,
        disconnectedAt: true,
        updatedAt: true,
      },
    }),

    prisma.facebookPage.findMany({
      where: { companyId: id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        pageName: true,
        instagramAccountId: true,
        instagramUsername: true,
        connectionType: true,
        status: true,
        tokenExpiresAt: true,
        connectedAt: true,
        disconnectedAt: true,
        updatedAt: true,
      },
    }),

    prisma.campaign.groupBy({
      by: ["companyId", "status"],
      where: { companyId: id },
      _count: { _all: true },
    }),

    prisma.campaign.findMany({
      where: { companyId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        totalRecipients: true,
        sentCount: true,
        deliveredCount: true,
        readCount: true,
        failedCount: true,
        scheduledAt: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
      },
    }),

    prisma.template.groupBy({
      by: ["companyId", "status"],
      where: { companyId: id },
      _count: { _all: true },
    }),

    prisma.template.findMany({
      where: { companyId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        language: true,
        category: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
      },
    }),

    prisma.conversation.groupBy({
      by: ["channel"],
      where: { companyId: id },
      _count: { _all: true },
    }),

    prisma.aiSettings.findUnique({
      where: { companyId: id },
      select: {
        isEnabled: true,
        leadCaptureEnabled: true,
        lastError: true,
        lastErrorAt: true,
      },
    }),

    aiQuery(
      ai,
      () =>
        prisma.aiUsageLog.groupBy({
          by: ["companyId", "type"],
          where: { companyId: id, createdAt: { gte: monthStart } },
          _count: { _all: true },
          _sum: { totalTokens: true, inputTokens: true, outputTokens: true },
          _max: { createdAt: true },
        }),
      []
    ),

    aiQuery(
      ai,
      () =>
        prisma.aiUsageLog.groupBy({
          by: ["companyId", "type"],
          where: { companyId: id },
          _count: { _all: true },
          _sum: { totalTokens: true, inputTokens: true, outputTokens: true },
          _max: { createdAt: true },
        }),
      []
    ),

    // calls and tokens per day for the last 30 days (IST days)
    aiQuery(
      ai,
      async () => {
        const since = new Date(Date.now() - 31 * 86400000);

        return prisma.$queryRaw`
          SELECT
            to_char((("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata')::date, 'YYYY-MM-DD') AS day,
            COUNT(*) AS calls,
            COALESCE(SUM("totalTokens"), 0) AS tokens
          FROM "AiUsageLog"
          WHERE "companyId" = ${id} AND "createdAt" >= ${since}
          GROUP BY 1
          ORDER BY 1
        `;
      },
      []
    ),
  ]);

  const month = foldUsage(aiMonthRows).get(id) || emptyAi();
  const all = foldUsage(aiAllRows).get(id) || emptyAi();

  return {
    aiTrackingReady: ai.ready,
    company,

    whatsapp: {
      ...buildWhatsapp(whatsappAccounts),
      list: whatsappAccounts,
    },

    facebook: buildSocial(socialPages, "facebook"),
    instagram: buildSocial(socialPages, "instagram"),
    socialPages,

    conversations: Object.fromEntries(
      conversationRows.map((row) => [row.channel, row._count._all])
    ),

    campaigns: {
      ...campaignSummary(foldStatusCounts(campaignRows).get(id)),
      recent: recentCampaigns,
    },

    templates: {
      ...templateSummary(foldStatusCounts(templateRows).get(id)),
      recent: recentTemplates,
    },

    ai: {
      enabled: !!settings?.isEnabled,
      leadCaptureEnabled: !!settings?.leadCaptureEnabled,
      lastError: settings?.lastError || null,
      lastErrorAt: settings?.lastErrorAt || null,
      month,
      all,
      daily: buildLastDays(dailyRows, 30),
    },
  };
};

module.exports = {
  getUsageList,
  getUsageDetail,
};