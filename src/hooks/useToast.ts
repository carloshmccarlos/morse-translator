import { useCallback, useRef, useState } from "react";

export interface Toast {
  id: number;
  message: string;
  isError: boolean;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const notify = useCallback((message: string, isError = false) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, isError }]);

    // Auto-dismiss after 4 s (errors stay a bit longer)
    window.setTimeout(
      () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
      isError ? 6_000 : 4_000
    );
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, notify, dismiss };
}
