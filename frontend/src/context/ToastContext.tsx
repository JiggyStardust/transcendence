import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type ToastContextType, type ToastType, type Toast } from "../types/toastTypes.ts";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  return { toasts, showToast };
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, showToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useAppToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastList({ toasts}: {toasts: Toast[]}) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-20 right-6 flex flex-col gap-3 z-[9999]">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-2 rounded-md shadow-lg dark:text-stone-800
            ${toast.type === "error" ? "bg-red-300" : "bg-green-300"}
          `}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}