'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🍳</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text, #2d1e0f)' }}>
          Something went wrong
        </h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--color-text-secondary, #78553f)' }}>
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg text-white font-medium"
          style={{ backgroundColor: 'var(--color-primary, #d97706)' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
