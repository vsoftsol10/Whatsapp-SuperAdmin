import { useState } from "react";
import toast from "react-hot-toast";
import { saveAiConfig, apiError } from "../../api/aiManagementApi";
import { Card, Field, Btn, inputCls } from "./ui";

export default function InstructionsTab({ config, defaultInstructions, onSaved }) {
  const [form, setForm] = useState({
    botName: config.botName,
    welcomeMessage: config.welcomeMessage,
    globalInstructions: config.globalInstructions,
    suggestedText: (config.suggestedQuestions || []).join("\n"),
  });
  const [saving, setSaving] = useState(false);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await saveAiConfig({
        botName: form.botName,
        welcomeMessage: form.welcomeMessage,
        globalInstructions: form.globalInstructions,
        suggestedQuestions: form.suggestedText.split("\n"),
      });
      toast.success(res.message || "Saved.");
      onSaved(res.config);
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card title="Chat window" subtitle="What clients see when they open the chatbot.">
        <div className="grid gap-4">
          <Field label="Assistant name">
            <input className={inputCls} maxLength={40} value={form.botName}
              onChange={(e) => set("botName", e.target.value)} />
          </Field>
          <Field label="Welcome message">
            <textarea rows={3} className={inputCls} maxLength={500}
              placeholder="Hi! I can help you use the CRM. Ask me anything."
              value={form.welcomeMessage}
              onChange={(e) => set("welcomeMessage", e.target.value)} />
          </Field>
          <Field label="Suggested questions" hint="One per line (max 8). Shown as quick buttons when a chat starts.">
            <textarea rows={5} className={inputCls}
              placeholder={"How do I connect my WhatsApp number?\nHow do I create a campaign?"}
              value={form.suggestedText}
              onChange={(e) => set("suggestedText", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card
        title="Global chatbot instructions"
        subtitle="Tone, language and style rules applied to every company. Built-in safety rules (answer only from the knowledge base, never guess) always apply and cannot be removed."
        action={
          <Btn variant="outline" onClick={() => set("globalInstructions", defaultInstructions)}>
            Insert default
          </Btn>
        }
      >
        <textarea
          rows={10}
          className={`${inputCls} font-mono`}
          placeholder={defaultInstructions}
          value={form.globalInstructions}
          onChange={(e) => set("globalInstructions", e.target.value)}
        />
        <p className="mt-2 text-xs text-gray-500">
          Leave empty to use the default instructions shown in the box.
        </p>
      </Card>

      <div className="flex justify-end">
        <Btn onClick={handleSave} loading={saving}>
          Save instructions
        </Btn>
      </div>
    </div>
  );
}