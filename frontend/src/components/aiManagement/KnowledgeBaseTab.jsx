import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, RefreshCw, FlaskConical } from "lucide-react";
import {
  listDocs, getDoc, createDoc, updateDoc, deleteDoc, reindexDocs, testChat, apiError,
} from "../../api/aiManagementApi";
import { Card, Btn, Toggle, Modal, Field, Spinner, inputCls, fmtNum } from "./ui";

const EMPTY = { id: null, title: "", category: "General", content: "", isPublished: true };

export default function KnowledgeBaseTab() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState(null);

  const load = async () => {
    try {
      const res = await listDocs();
      setDocs(res.docs);
    } catch (error) {
      toast.error(apiError(error, "Could not load documents."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => [...new Set(docs.map((d) => d.category))], [docs]);

  const filtered = docs.filter((d) =>
    `${d.title} ${d.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = async (doc) => {
    try {
      const res = await getDoc(doc.id);
      setEditing({ ...res.doc });
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: editing.title,
        category: editing.category,
        content: editing.content,
        isPublished: editing.isPublished,
      };
      if (editing.id) await updateDoc(editing.id, payload);
      else await createDoc(payload);
      toast.success("Document saved.");
      setEditing(null);
      load();
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (doc, value) => {
    try {
      await updateDoc(doc.id, { isPublished: value });
      setDocs((list) => list.map((d) => (d.id === doc.id ? { ...d, isPublished: value } : d)));
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc.id);
      toast.success("Document deleted.");
      load();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const handleReindex = async () => {
    try {
      setReindexing(true);
      const res = await reindexDocs();
      toast.success(res.message);
      load();
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setReindexing(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      setAsking(true);
      setAnswer(null);
      setAnswer(await testChat(question));
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card
        title="Product documentation"
        subtitle="Write how the CRM works. The chatbot answers ONLY from published documents."
        action={
          <div className="flex flex-wrap gap-2">
            <Btn variant="outline" onClick={handleReindex} loading={reindexing}>
              <RefreshCw size={16} /> Re-index all
            </Btn>
            <Btn onClick={() => setEditing({ ...EMPTY })}>
              <Plus size={16} /> Add document
            </Btn>
          </div>
        }
      >
        <input
          className={`${inputCls} mb-4 sm:max-w-sm`}
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No documents yet. Click "Add document" to write your first one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Size</th>
                  <th className="py-2 pr-3">Published</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 pr-3 font-medium text-gray-900">
                      {d.title}
                      <span className="ml-2 text-xs font-normal text-gray-400">v{d.version}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-gray-500">
                      {fmtNum(d.chars)} chars · {d.chunks} pieces
                    </td>
                    <td className="py-3 pr-3">
                      <Toggle
                        checked={d.isPublished}
                        onChange={(v) => handlePublish(d, v)}
                        label="Published"
                      />
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => openEdit(d)}
                        className="mr-1 rounded-lg p-2 text-gray-600 hover:bg-gray-100" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(d)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card
        title="Test the chatbot"
        subtitle="Ask a question the way a client would. Uses published documents only, not counted against any company."
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className={inputCls}
            placeholder="e.g. How do I create a campaign?"
            value={question}
            maxLength={1000}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <Btn onClick={handleAsk} loading={asking}>
            <FlaskConical size={16} /> Ask
          </Btn>
        </div>

        {answer && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p className="whitespace-pre-wrap text-gray-800">{answer.answer}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
              <span
                className={`rounded-full px-2 py-0.5 ${
                  answer.answered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {answer.answered ? "Answered from docs" : "Not covered by docs"}
              </span>
              {answer.sources.map((s) => (
                <span key={s} className="rounded-full bg-gray-200 px-2 py-0.5">Source: {s}</span>
              ))}
              <span>{fmtNum(answer.tokens)} tokens</span>
            </div>
          </div>
        )}
      </Card>

      {editing && (
        <Modal title={editing.id ? "Edit document" : "Add document"} onClose={() => setEditing(null)} wide>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input className={inputCls} maxLength={150} value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </Field>
              <Field label="Category">
                <input className={inputCls} list="kb-categories" maxLength={60} value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                <datalist id="kb-categories">
                  {categories.map((c) => <option key={c} value={c} />)}
                </datalist>
              </Field>
            </div>

            <Field
              label="Content"
              hint="Plain text or Markdown. Use ## headings for sections and numbered steps (1. 2. 3.). Use the exact menu / button names from the CRM."
            >
              <textarea rows={16} className={`${inputCls} font-mono`} value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={editing.isPublished}
                onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
              Published (the chatbot can use this document)
            </label>

            <div className="flex justify-end gap-2">
              <Btn variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={handleSave} loading={saving}>Save document</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}