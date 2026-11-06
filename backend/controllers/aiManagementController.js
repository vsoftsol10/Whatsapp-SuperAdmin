const prisma = require("../config/prisma");
const { encryptSecret, decryptSecret, maskSecret } = require("../utils/secretCrypto");
const { getProvider, getProviderCatalog } = require("../services/supportBotCore/providers");
const { callLLM, BotError } = require("../services/supportBotCore/llm");
const { searchKnowledge, listTopics } = require("../services/supportBotCore/retrieval");
const {
  buildSystemPrompt,
  parseAnswer,
  DEFAULT_INSTRUCTIONS,
} = require("../services/supportBotCore/prompt");
const {
  getOrCreateConfig,
  getApiKey,
  monthStartUtc,
  calcCost,
} = require("../services/supportBotCore/config");
const { chunkDocument } = require("../services/knowledgeChunker");

// ======================================================
// HELPERS
// ======================================================

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const serverError = (res, error, label) => {
  console.error(`${label}:`, error);
  return fail(res, 500, "Something went wrong. Please try again.");
};

const clampInt = (value, min, max, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.round(n), min), max);
};

const clampFloat = (value, min, max, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

const serializeConfig = (config) => {
  const key = getApiKey(config);

  return {
    isEnabled: config.isEnabled,
    provider: config.provider,
    model: config.model,
    hasKey: !!key,
    keyMasked: key ? maskSecret(key) : "",
    keyUnreadable: !!config.apiKeyEnc && !key, // saved but cannot be decrypted
    botName: config.botName,
    welcomeMessage: config.welcomeMessage || "",
    globalInstructions: config.globalInstructions || "",
    suggestedQuestions: config.suggestedQuestions || [],
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
    historyLimit: config.historyLimit,
    topK: config.topK,
    defaultMonthlyTokenLimit: config.defaultMonthlyTokenLimit,
    defaultDailyUserMessages: config.defaultDailyUserMessages,
    globalMonthlyTokenLimit: config.globalMonthlyTokenLimit,
    inputPricePerM: config.inputPricePerM,
    outputPricePerM: config.outputPricePerM,
    currency: config.currency,
    updatedAt: config.updatedAt,
  };
};

const reindexDoc = async (tx, doc) => {
  await tx.knowledgeChunk.deleteMany({ where: { docId: doc.id } });

  const chunks = chunkDocument(doc.title, doc.content);

  if (chunks.length) {
    await tx.knowledgeChunk.createMany({
      data: chunks.map((content, position) => ({
        docId: doc.id,
        position,
        content,
      })),
    });
  }

  return chunks.length;
};

// ======================================================
// CONFIG
// ======================================================

const getConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();

    return res.json({
      success: true,
      config: serializeConfig(config),
      providers: getProviderCatalog(),
      defaultInstructions: DEFAULT_INSTRUCTIONS,
    });
  } catch (error) {
    return serverError(res, error, "getConfig");
  }
};

const updateConfig = async (req, res) => {
  try {
    const body = req.body || {};
    const current = await getOrCreateConfig();
    const data = {};

    // ---- provider / model / key ----
    if (body.provider !== undefined) {
      const provider = getProvider(body.provider);
      if (!provider) return fail(res, 400, "Unknown AI provider.");

      if (provider.id !== current.provider) {
        // keys are provider-specific
        if (!body.apiKey || !String(body.apiKey).trim()) {
          return fail(
            res,
            400,
            `Enter the ${provider.name} API key to switch the provider.`
          );
        }
        data.model = provider.defaultModel;
      }

      data.provider = provider.id;
    }

    if (body.model !== undefined) {
      const model = String(body.model).trim();
      if (!model || model.length > 100) {
        return fail(res, 400, "Enter a valid model name.");
      }
      data.model = model;
    }

    if (body.apiKey !== undefined && String(body.apiKey).trim()) {
      data.apiKeyEnc = encryptSecret(String(body.apiKey).trim());
    } else if (body.removeKey === true) {
      data.apiKeyEnc = null;
    }

    // ---- texts ----
    if (body.botName !== undefined) {
      data.botName = String(body.botName).trim().slice(0, 40) || "CRM Assistant";
    }
    if (body.welcomeMessage !== undefined) {
      data.welcomeMessage = String(body.welcomeMessage).trim().slice(0, 500) || null;
    }
    if (body.globalInstructions !== undefined) {
      data.globalInstructions =
        String(body.globalInstructions).trim().slice(0, 6000) || null;
    }
    if (body.suggestedQuestions !== undefined) {
      data.suggestedQuestions = (Array.isArray(body.suggestedQuestions)
        ? body.suggestedQuestions
        : []
      )
        .map((q) => String(q).trim().slice(0, 120))
        .filter(Boolean)
        .slice(0, 8);
    }

    // ---- numbers ----
    if (body.temperature !== undefined) {
      data.temperature = clampFloat(body.temperature, 0, 1, 0.2);
    }
    if (body.maxOutputTokens !== undefined) {
      data.maxOutputTokens = clampInt(body.maxOutputTokens, 100, 2000, 700);
    }
    if (body.historyLimit !== undefined) {
      data.historyLimit = clampInt(body.historyLimit, 0, 20, 6);
    }
    if (body.topK !== undefined) {
      data.topK = clampInt(body.topK, 1, 10, 5);
    }
    if (body.defaultMonthlyTokenLimit !== undefined) {
      data.defaultMonthlyTokenLimit = clampInt(body.defaultMonthlyTokenLimit, 0, 2_000_000_000, 300000);
    }
    if (body.defaultDailyUserMessages !== undefined) {
      data.defaultDailyUserMessages = clampInt(body.defaultDailyUserMessages, 0, 10000, 30);
    }
    if (body.globalMonthlyTokenLimit !== undefined) {
      data.globalMonthlyTokenLimit = clampInt(body.globalMonthlyTokenLimit, 0, 2_000_000_000, 0);
    }
    if (body.inputPricePerM !== undefined) {
      data.inputPricePerM = clampFloat(body.inputPricePerM, 0, 100000, 0);
    }
    if (body.outputPricePerM !== undefined) {
      data.outputPricePerM = clampFloat(body.outputPricePerM, 0, 100000, 0);
    }
    if (body.currency !== undefined) {
      data.currency = String(body.currency).trim().toUpperCase().slice(0, 5) || "USD";
    }

    // ---- master switch ----
    if (body.isEnabled !== undefined) {
      data.isEnabled = !!body.isEnabled;

      const keyAfter = data.apiKeyEnc !== undefined ? data.apiKeyEnc : current.apiKeyEnc;
      if (data.isEnabled && !keyAfter) {
        return fail(res, 400, "Save an API key before enabling the chatbot.");
      }
    }

    const updated = await prisma.chatbotConfig.update({
      where: { id: 1 },
      data,
    });

    return res.json({
      success: true,
      message: "AI settings saved.",
      config: serializeConfig(updated),
    });
  } catch (error) {
    return serverError(res, error, "updateConfig");
  }
};

// Sends one tiny message to the provider to prove the key/model work.
const testConnection = async (req, res) => {
  try {
    const current = await getOrCreateConfig();
    const body = req.body || {};

    const providerId = body.provider || current.provider;
    const model = String(body.model || current.model || "").trim();

    let apiKey = body.apiKey && String(body.apiKey).trim();

    if (!apiKey) {
      if (providerId !== current.provider) {
        return fail(res, 400, "Enter the API key for this provider to test it.");
      }
      apiKey = getApiKey(current);
    }

    if (!apiKey) return fail(res, 400, "No API key saved yet.");

    const started = Date.now();

    const result = await callLLM({
      providerId,
      model,
      apiKey,
      system: "You are a connection test. Reply with the single word: OK",
      messages: [{ role: "user", content: "ping" }],
      temperature: 0,
      maxTokens: 300,
    });

    return res.json({
      success: true,
      reply: result.text.slice(0, 100),
      latencyMs: Date.now() - started,
      tokens: result.promptTokens + result.completionTokens,
    });
  } catch (error) {
    if (error instanceof BotError) {
      return fail(res, 400, `Connection failed: ${error.message}`);
    }
    return serverError(res, error, "testConnection");
  }
};

// ======================================================
// KNOWLEDGE BASE
// ======================================================

const validateDoc = (body, partial = false) => {
  const out = {};

  if (!partial || body.title !== undefined) {
    const title = String(body.title || "").trim();
    if (title.length < 3 || title.length > 150) {
      return { error: "Title must be 3 to 150 characters." };
    }
    out.title = title;
  }

  if (body.category !== undefined) {
    out.category = String(body.category).trim().slice(0, 60) || "General";
  }

  if (!partial || body.content !== undefined) {
    const content = String(body.content || "").trim();
    if (content.length < 20) {
      return { error: "Content is too short (minimum 20 characters)." };
    }
    if (content.length > 60000) {
      return { error: "Content is too long (maximum 60,000 characters)." };
    }
    out.content = content;
  }

  if (body.isPublished !== undefined) out.isPublished = !!body.isPublished;

  return { data: out };
};

const listDocs = async (req, res) => {
  try {
    const docs = await prisma.knowledgeDoc.findMany({
      orderBy: [{ category: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        category: true,
        isPublished: true,
        version: true,
        updatedAt: true,
        content: true,
        _count: { select: { chunks: true } },
      },
    });

    return res.json({
      success: true,
      docs: docs.map(({ content, _count, ...d }) => ({
        ...d,
        chars: content.length,
        chunks: _count.chunks,
      })),
    });
  } catch (error) {
    return serverError(res, error, "listDocs");
  }
};

const getDoc = async (req, res) => {
  try {
    const doc = await prisma.knowledgeDoc.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!doc) return fail(res, 404, "Document not found.");

    return res.json({ success: true, doc });
  } catch (error) {
    return serverError(res, error, "getDoc");
  }
};

const createDoc = async (req, res) => {
  try {
    const { data, error } = validateDoc(req.body);
    if (error) return fail(res, 400, error);

    const doc = await prisma.$transaction(async (tx) => {
      const created = await tx.knowledgeDoc.create({ data });
      await reindexDoc(tx, created);
      return created;
    });

    return res.status(201).json({
      success: true,
      message: "Document saved.",
      doc,
    });
  } catch (error) {
    return serverError(res, error, "createDoc");
  }
};

const updateDoc = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.knowledgeDoc.findUnique({ where: { id } });
    if (!existing) return fail(res, 404, "Document not found.");

    const { data, error } = validateDoc(req.body, true);
    if (error) return fail(res, 400, error);

    const textChanged =
      (data.content !== undefined && data.content !== existing.content) ||
      (data.title !== undefined && data.title !== existing.title);

    const doc = await prisma.$transaction(async (tx) => {
      const updated = await tx.knowledgeDoc.update({
        where: { id },
        data: { ...data, ...(textChanged ? { version: { increment: 1 } } : {}) },
      });

      if (textChanged) await reindexDoc(tx, updated);

      return updated;
    });

    return res.json({ success: true, message: "Document updated.", doc });
  } catch (error) {
    return serverError(res, error, "updateDoc");
  }
};

const deleteDoc = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.knowledgeDoc.findUnique({ where: { id } });
    if (!existing) return fail(res, 404, "Document not found.");

    await prisma.knowledgeDoc.delete({ where: { id } });

    return res.json({ success: true, message: "Document deleted." });
  } catch (error) {
    return serverError(res, error, "deleteDoc");
  }
};

const reindexAll = async (req, res) => {
  try {
    const docs = await prisma.knowledgeDoc.findMany();
    let total = 0;

    for (const doc of docs) {
      total += await prisma.$transaction((tx) => reindexDoc(tx, doc));
    }

    return res.json({
      success: true,
      message: `Re-indexed ${docs.length} documents (${total} chunks).`,
    });
  } catch (error) {
    return serverError(res, error, "reindexAll");
  }
};

// Lets the Super Admin try a question exactly like a client would
// (published docs only). Not saved, not counted against any company.
const testChat = async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim().slice(0, 1000);
    if (!question) return fail(res, 400, "Type a question first.");

    const config = await getOrCreateConfig();
    const apiKey = getApiKey(config);
    if (!apiKey) return fail(res, 400, "Save an API key first.");

    const [chunks, topics] = await Promise.all([
      searchKnowledge(question, config.topK),
      listTopics(),
    ]);

    const result = await callLLM({
      providerId: config.provider,
      model: config.model,
      apiKey,
      system: buildSystemPrompt({ config, chunks, topics, role: "ADMIN" }),
      messages: [{ role: "user", content: question }],
      temperature: config.temperature,
      maxTokens: config.maxOutputTokens,
    });

    const { text, answered } = parseAnswer(result.text);

    return res.json({
      success: true,
      answer: text,
      answered,
      sources: [...new Map(chunks.map((c) => [c.docId, c.title])).values()],
      tokens: result.promptTokens + result.completionTokens,
    });
  } catch (error) {
    if (error instanceof BotError) {
      return fail(res, 400, `AI error: ${error.message}`);
    }
    return serverError(res, error, "testChat");
  }
};

// ======================================================
// TENANTS (per-company enable / limits)
// ======================================================

const listTenants = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const config = await getOrCreateConfig();
    const since = monthStartUtc();

    const companies = await prisma.company.findMany({
      where: search
        ? { companyName: { contains: search, mode: "insensitive" } }
        : undefined,
      select: {
        id: true,
        companyName: true,
        plan: true,
        status: true,
        chatbotTenantSetting: true,
      },
      orderBy: { companyName: "asc" },
      take: 500,
    });

    const usage = await prisma.chatbotMessage.groupBy({
      by: ["companyId"],
      where: { role: "assistant", createdAt: { gte: since } },
      _sum: { promptTokens: true, completionTokens: true, cost: true },
      _count: { _all: true },
    });

    const usageMap = new Map(usage.map((u) => [u.companyId, u]));

    const tenants = companies.map((c) => {
      const s = c.chatbotTenantSetting;
      const u = usageMap.get(c.id);

      return {
        companyId: c.id,
        companyName: c.companyName,
        plan: c.plan,
        companyStatus: c.status,
        isEnabled: s ? s.isEnabled : true,
        monthlyTokenLimit: s?.monthlyTokenLimit ?? null,
        dailyUserMessageLimit: s?.dailyUserMessageLimit ?? null,
        effectiveMonthlyLimit:
          s?.monthlyTokenLimit ?? config.defaultMonthlyTokenLimit,
        effectiveDailyLimit:
          s?.dailyUserMessageLimit ?? config.defaultDailyUserMessages,
        tokensUsed: (u?._sum.promptTokens || 0) + (u?._sum.completionTokens || 0),
        cost: u?._sum.cost || 0,
        messages: u?._count._all || 0,
      };
    });

    return res.json({ success: true, tenants });
  } catch (error) {
    return serverError(res, error, "listTenants");
  }
};

const updateTenant = async (req, res) => {
  try {
    const companyId = Number(req.params.companyId);
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return fail(res, 404, "Company not found.");

    const body = req.body || {};
    const data = {};

    if (body.isEnabled !== undefined) data.isEnabled = !!body.isEnabled;

    // null / "" = go back to the default limit
    const limitField = (value, max) =>
      value === null || value === "" ? null : clampInt(value, 0, max, 0);

    if (body.monthlyTokenLimit !== undefined) {
      data.monthlyTokenLimit = limitField(body.monthlyTokenLimit, 2_000_000_000);
    }
    if (body.dailyUserMessageLimit !== undefined) {
      data.dailyUserMessageLimit = limitField(body.dailyUserMessageLimit, 10000);
    }

    const setting = await prisma.chatbotTenantSetting.upsert({
      where: { companyId },
      update: data,
      create: { companyId, ...data },
    });

    return res.json({ success: true, message: "Company settings saved.", setting });
  } catch (error) {
    return serverError(res, error, "updateTenant");
  }
};

// ======================================================
// USAGE / COST / FEEDBACK
// ======================================================

const getUsage = async (req, res) => {
  try {
    const days = clampInt(req.query.days, 1, 365, 30);
    const config = await getOrCreateConfig();
    const monthStart = monthStartUtc();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [monthAgg, convoCount, daily, perCompany, feedback, unanswered] =
      await Promise.all([
        prisma.chatbotMessage.aggregate({
          where: { role: "assistant", createdAt: { gte: monthStart } },
          _sum: { promptTokens: true, completionTokens: true, cost: true },
          _count: { _all: true },
        }),
        prisma.chatbotConversation.count({
          where: { createdAt: { gte: monthStart } },
        }),
        prisma.$queryRaw`
          SELECT date_trunc('day', "createdAt")::date AS day,
                 SUM("promptTokens")::int AS "promptTokens",
                 SUM("completionTokens")::int AS "completionTokens",
                 COALESCE(SUM("cost"), 0)::float AS cost,
                 COUNT(*)::int AS messages
          FROM "ChatbotMessage"
          WHERE role = 'assistant' AND "createdAt" >= ${since}
          GROUP BY 1
          ORDER BY 1
        `,
        prisma.chatbotMessage.groupBy({
          by: ["companyId"],
          where: { role: "assistant", createdAt: { gte: since } },
          _sum: { promptTokens: true, completionTokens: true, cost: true },
          _count: { _all: true },
        }),
        prisma.chatbotMessage.groupBy({
          by: ["feedback"],
          where: { role: "assistant", feedback: { not: null }, createdAt: { gte: since } },
          _count: { _all: true },
        }),
        prisma.chatbotMessage.count({
          where: { role: "assistant", answered: false, createdAt: { gte: since } },
        }),
      ]);

    const companies = await prisma.company.findMany({
      where: { id: { in: perCompany.map((c) => c.companyId) } },
      select: { id: true, companyName: true },
    });
    const nameMap = new Map(companies.map((c) => [c.id, c.companyName]));

    const topCompanies = perCompany
      .map((c) => ({
        companyId: c.companyId,
        companyName: nameMap.get(c.companyId) || `Company #${c.companyId}`,
        messages: c._count._all,
        tokens: (c._sum.promptTokens || 0) + (c._sum.completionTokens || 0),
        cost: c._sum.cost || 0,
      }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10);

    const helpful = feedback.find((f) => f.feedback === 1)?._count._all || 0;
    const notHelpful = feedback.find((f) => f.feedback === -1)?._count._all || 0;

    return res.json({
      success: true,
      currency: config.currency,
      days,
      month: {
        messages: monthAgg._count._all,
        conversations: convoCount,
        promptTokens: monthAgg._sum.promptTokens || 0,
        completionTokens: monthAgg._sum.completionTokens || 0,
        tokens:
          (monthAgg._sum.promptTokens || 0) + (monthAgg._sum.completionTokens || 0),
        cost: monthAgg._sum.cost || 0,
        globalLimit: config.globalMonthlyTokenLimit,
      },
      daily: daily.map((d) => ({
        day: d.day instanceof Date ? d.day.toISOString().slice(0, 10) : String(d.day),
        tokens: d.promptTokens + d.completionTokens,
        cost: d.cost,
        messages: d.messages,
      })),
      topCompanies,
      feedback: { helpful, notHelpful },
      unansweredCount: unanswered,
    });
  } catch (error) {
    return serverError(res, error, "getUsage");
  }
};

// Questions the AI could not answer from the docs -> tells you what to write next
const listUnanswered = async (req, res) => {
  try {
    const limit = clampInt(req.query.limit, 1, 200, 50);

    const rows = await prisma.chatbotMessage.findMany({
      where: { role: "assistant", answered: false },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, question: true, companyId: true, createdAt: true },
    });

    const companies = await prisma.company.findMany({
      where: { id: { in: [...new Set(rows.map((r) => r.companyId))] } },
      select: { id: true, companyName: true },
    });
    const nameMap = new Map(companies.map((c) => [c.id, c.companyName]));

    return res.json({
      success: true,
      items: rows.map((r) => ({
        id: r.id,
        question: r.question || "",
        companyName: nameMap.get(r.companyId) || `Company #${r.companyId}`,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    return serverError(res, error, "listUnanswered");
  }
};

module.exports = {
  getConfig,
  updateConfig,
  testConnection,
  listDocs,
  getDoc,
  createDoc,
  updateDoc,
  deleteDoc,
  reindexAll,
  testChat,
  listTenants,
  updateTenant,
  getUsage,
  listUnanswered,
};