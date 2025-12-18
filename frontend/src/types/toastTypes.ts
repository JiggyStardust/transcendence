export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

export type Status = {
	type: "ok" | "warning" | "error",
	message: string;
}