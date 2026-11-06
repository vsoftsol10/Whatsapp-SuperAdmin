// ============================================
// KNOWLEDGE CHUNKER
// ============================================
// Splits a document (plain text / Markdown) into small pieces so that only
// the relevant pieces are sent to the AI. Splits at headings first, then at
// paragraphs. Each chunk starts with its heading so it makes sense alone.

const MAX_CHARS = 1500;

const splitLong = (text) => {
  // very long paragraph: cut at sentence ends
  const parts = [];
  let current = "";

  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if ((current + " " + sentence).length > MAX_CHARS && current) {
      parts.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current.trim()) parts.push(current.trim());

  // last resort for text without punctuation
  return parts.flatMap((p) =>
    p.length > MAX_CHARS * 1.5
      ? p.match(new RegExp(`.{1,${MAX_CHARS}}`, "gs")) || [p]
      : [p]
  );
};

const chunkDocument = (title, content) => {
  const text = String(content || "").replace(/\r\n/g, "\n").trim();

  if (!text) return [];

  // 1. sections by Markdown headings
  const sections = [];
  let heading = title;
  let buffer = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body) sections.push({ heading, body });
    buffer = [];
  };

  for (const line of text.split("\n")) {
    const match = line.match(/^#{1,4}\s+(.*)$/);

    if (match) {
      flush();
      heading = match[1].trim() || title;
    } else {
      buffer.push(line);
    }
  }

  flush();

  // 2. pack paragraphs of each section into chunks
  const chunks = [];

  for (const { heading: h, body } of sections) {
    const prefix = h && h !== title ? `${title} - ${h}\n` : `${title}\n`;
    const paragraphs = body
      .split(/\n\s*\n/)
      .flatMap((p) => (p.length > MAX_CHARS ? splitLong(p) : [p.trim()]))
      .filter(Boolean);

    let current = "";

    for (const paragraph of paragraphs) {
      if (current && (current + "\n\n" + paragraph).length > MAX_CHARS) {
        chunks.push(prefix + current);
        current = paragraph;
      } else {
        current = current ? `${current}\n\n${paragraph}` : paragraph;
      }
    }

    if (current) chunks.push(prefix + current);
  }

  return chunks;
};

module.exports = { chunkDocument };