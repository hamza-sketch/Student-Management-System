// DeleteConfirmDialog.jsx

import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmDialog({ student, count = 0, onConfirm, onCancel, loading }) {
  const isBulk = !student && count > 0;
  const title = isBulk ? `Delete ${count} students?` : `Delete ${student?.name}?`;
  const message = isBulk
    ? `You are about to delete ${count} selected students. This action cannot be undone.`
    : `You are about to delete the student record for "${student?.name}". All associated data will be soft-deleted and can be restored later.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-center text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-6">{message}</p>

        {/* Soft delete note */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-700">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>
            Records will be <strong>soft-deleted</strong> — they can be restored by an administrator.
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-60 transition-colors"
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}