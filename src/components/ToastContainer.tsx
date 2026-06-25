import type { Toast } from "../hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={[
            "pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md",
            "animate-slideInRight",
            toast.isError
              ? "border-rose-400/30 bg-rose-950/80 text-rose-200"
              : "border-emerald-400/25 bg-emerald-950/80 text-emerald-100"
          ].join(" ")}
        >
          <span className="mt-0.5 shrink-0 text-base leading-none">
            {toast.isError ? "✕" : "✓"}
          </span>
          <p className="flex-1 text-sm leading-5">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="shrink-0 opacity-60 transition hover:opacity-100"
            onClick={() => onDismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
