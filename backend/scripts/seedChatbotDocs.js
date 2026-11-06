// ============================================================
// Loads the starter documentation into the AI knowledge base.
//
//   node scripts/seedChatbotDocs.js              -> saves as DRAFTS
//   node scripts/seedChatbotDocs.js --publish    -> saves as PUBLISHED
//
// Run it from the super admin backend folder. Documents that already
// exist (same title) are skipped, so it is safe to run again.
// Review the drafts in AI Management > Knowledge Base before publishing:
// they were written from the CRM's menus and screens and should match
// your real workflow.
// ============================================================

const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const prisma = require("../config/prisma");
const { chunkDocument } = require("../services/knowledgeChunker");

const publish = process.argv.includes("--publish");
const dir = path.join(__dirname, "chatbotStarterDocs");

const parse = (raw) => {
  const lines = raw.replace(/\r/g, "").split("\n");
  const titleLine = lines.find((l) => l.startsWith("# "));
  const categoryLine = lines.find((l) => /^Category:\s*/i.test(l));

  if (!titleLine) return null;

  const body = lines
    .filter((l) => l !== titleLine && l !== categoryLine)
    .join("\n")
    .trim();

  return {
    title: titleLine.slice(2).trim(),
    category: categoryLine ? categoryLine.replace(/^Category:\s*/i, "").trim() : "General",
    content: body,
  };
};

(async () => {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const doc = parse(fs.readFileSync(path.join(dir, file), "utf8"));

    if (!doc) {
      console.log(`! ${file}: no "# Title" line, skipped`);
      continue;
    }

    const existing = await prisma.knowledgeDoc.findFirst({ where: { title: doc.title } });

    if (existing) {
      skipped++;
      console.log(`- ${doc.title} (already exists)`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const saved = await tx.knowledgeDoc.create({
        data: { ...doc, isPublished: publish },
      });

      const chunks = chunkDocument(saved.title, saved.content);

      await tx.knowledgeChunk.createMany({
        data: chunks.map((content, position) => ({ docId: saved.id, position, content })),
      });
    });

    created++;
    console.log(`+ ${doc.title}`);
  }

  console.log(
    `\nDone: ${created} added, ${skipped} skipped. They are saved as ${
      publish ? "PUBLISHED" : "DRAFTS (publish them in AI Management > Knowledge Base)"
    }.`
  );

  await prisma.$disconnect();
})().catch(async (error) => {
  console.error("Seeding failed:", error.message);
  await prisma.$disconnect();
  process.exit(1);
});