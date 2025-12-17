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

export interface IMatchHistoryData {
  matchId: number;    // I probably will not use this
  createdAt: string;  // "2025-12-16T15;31:12.680Z"
  isWinner: boolean;  // (is the main user a winner)
  userScore: number;  // (main users score)
  opponentScore: number;
  opponentDisplayName: string;
  opponentAvatarUrl: string;
}