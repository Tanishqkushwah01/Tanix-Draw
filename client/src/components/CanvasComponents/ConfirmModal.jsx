export default function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-300 bg-fg/55 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.18s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-2 border-fg rounded-[20px] shadow-[8px_8px_0_#1a1a1a] px-8 py-7 w-full max-w-90 animate-[slideUp_0.22s_ease]"
      >
        <h2 className="font-[Georgia,serif] text-lg font-bold tracking-[-0.3px] mb-2">
          {title}
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-line bg-white py-2.5 text-sm font-semibold cursor-pointer transition-colors hover:border-fg"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:-translate-y-px ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-fg hover:bg-[#333]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}