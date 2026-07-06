'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore, type ToastVariant } from '@/lib/toast';

const VARIANT_META: Record<
  ToastVariant,
  { accent: string; Icon: typeof CheckCircle2 }
> = {
  success: { accent: '#16a34a', Icon: CheckCircle2 },
  error: { accent: '#dc2626', Icon: AlertCircle },
  info: { accent: '#d97706', Icon: Info },
};

/**
 * Global toast stack. Mounted once in the root layout; reads from the Zustand
 * toast store so any component can trigger a toast via the `toast` helpers.
 */
export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[100] flex flex-col gap-2 bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:w-96 pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map(({ id, message, variant }) => {
        const { accent, Icon } = VARIANT_META[variant];
        return (
          <div
            key={id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border p-3 pr-2 shadow-lg animate-[toastIn_150ms_ease-out]"
            style={{
              backgroundColor: 'var(--color-surface, #ffffff)',
              borderColor: 'var(--color-border, #e7dcd0)',
              borderLeft: `4px solid ${accent}`,
            }}
            role={variant === 'error' ? 'alert' : 'status'}
          >
            <Icon size={18} style={{ color: accent, marginTop: 1, flexShrink: 0 }} />
            <span
              className="flex-1 text-sm leading-snug"
              style={{ color: 'var(--color-text, #2d1e0f)' }}
            >
              {message}
            </span>
            <button
              onClick={() => dismiss(id)}
              aria-label="Dismiss notification"
              className="rounded p-1 opacity-60 transition-opacity hover:opacity-100"
              style={{ color: 'var(--color-text-secondary, #78553f)' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
