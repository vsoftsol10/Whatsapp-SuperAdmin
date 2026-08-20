
// import { useEffect, useState } from "react";
// import { X, Mail, Send } from "lucide-react";

// export default function SubscriptionReminderModal({ subscription, onClose, onSend, sending = false }) {
//   const [channel, setChannel] = useState("EMAIL");
//   const [subject, setSubject] = useState("");
//   const [content, setContent] = useState("");

//   useEffect(() => {
//     if (!subscription) return;

//     const companyName = subscription.company?.companyName || "Company";
//     const planName = subscription.plan?.planName || "Subscription";
//     const expiryDate = subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString("en-IN") : "-";

//     setSubject(`${planName} Subscription Expiry Reminder`);

//     setContent(`<p>Hello ${companyName},</p><p>This is a reminder that your <strong>${planName}</strong> subscription is approaching its expiry date.</p><p><strong>Expiry Date:</strong> ${expiryDate}</p><p>Please renew your subscription to continue using our services.</p><p>Thank you.</p>`);
//   }, [subscription]);

//   if (!subscription) return null;

//   const companyEmail = subscription.company?.email || "";

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!subject.trim() || !content.trim()) return;

//     await onSend({
//       channel,
//       subject,
//       content
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Send Subscription Reminder</h2>
//             <p className="mt-1 text-sm text-gray-500">Send a reminder to the registered company email.</p>
//           </div>

//           <button type="button" onClick={onClose} disabled={sending} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-5 p-6">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Channel</label>

//               <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
//                 <Mail size={18} className="text-gray-600" />

//                 <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none">
//                   <option value="EMAIL">Email</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">To</label>

//               <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
//                 <p className="text-sm text-gray-700">{companyEmail}</p>
//               </div>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Subject</label>

//               <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100" />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">Message</label>

//               <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Write your reminder message..." className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100" />
//             </div>
//           </div>

//           <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
//             <button type="button" onClick={onClose} disabled={sending} className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
//               Cancel
//             </button>

//             <button type="submit" disabled={sending || !subject.trim() || !content.trim()} className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-50">
//               <Send size={16} />
//               {sending ? "Sending..." : "Send Reminder"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { X, Mail, Send } from "lucide-react";

export default function SubscriptionReminderModal({ subscription, onClose, onSend, sending = false }) {
  const [channel, setChannel] = useState("EMAIL");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!subscription) return;

    const companyName = subscription.company?.companyName || "Company";
    const planName = subscription.plan?.planName || "Subscription";
    const expiryDate = subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString("en-IN") : "-";

    setSubject(`${planName} Subscription Expiry Reminder`);

    setContent(`Hello ${companyName},

This is a reminder that your ${planName} subscription is approaching its expiry date.
Expiry Date: ${expiryDate}
Please renew your subscription to continue using our services.

Thank you.`);
  }, [subscription]);

  if (!subscription) return null;

  const companyEmail = subscription.company?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) return;

    const htmlContent = content
      .split("\n")
      .map((line) => {
        if (!line.trim()) return "<br />";
        return `<p>${line}</p>`;
      })
      .join("");

    await onSend({
      channel,
      subject,
      content: htmlContent
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Send Subscription Reminder
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Send a reminder to the registered company email.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Channel
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <Mail size={18} className="text-gray-600" />

                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
                  >
                    <option value="EMAIL">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  To
                </label>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="break-all text-sm text-gray-700">
                    {companyEmail}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="Write your reminder message..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={sending || !subject.trim() || !content.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {sending ? "Sending..." : "Send Reminder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

