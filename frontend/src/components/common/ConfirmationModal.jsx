import { AlertTriangle, Trash2 } from "lucide-react";

export default function ConfirmationModal({
  open,
  title = "Confirm Deletion",
  message,
  itemName,
  onCancel,
  onConfirm,
  loading = false,
  confirmText = "Delete"
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h2 id="confirmation-modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            {itemName && (
              <p className="mt-2 break-words text-sm font-medium text-gray-900">
                {itemName}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
