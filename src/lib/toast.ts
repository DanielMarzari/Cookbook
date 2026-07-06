import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  show: (message: string, variant?: ToastVariant, durationMs?: number) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, variant = 'info', durationMs = 4000) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    if (durationMs > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, durationMs);
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/**
 * Fire-and-forget toast helpers. Usable from anywhere (event handlers, catch
 * blocks) without a hook, since Zustand exposes the store imperatively.
 * Replaces the app's blocking `alert()` calls.
 */
export const toast = {
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  info: (message: string) => useToastStore.getState().show(message, 'info'),
};
