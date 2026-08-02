'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface AskOptions {
  title: string;
  hint?: string;
  defaultValue?: string;
  confirmLabel?: string;
}

type Ask = (opts: AskOptions) => Promise<string | null>;

const PromptContext = createContext<Ask>(async () => null);

/** Ask the user for a line of text. Resolves to null if they cancel. */
export const usePrompt = (): Ask => useContext(PromptContext);

/**
 * A replacement for window.prompt, which Next refuses to run.
 *
 * Promise-based so call sites read the same as the browser builtin they replace:
 * `const name = await ask({ title: '…' })`, null on cancel. Rendered rather than
 * native, so it also gets to look like the rest of the app and say something
 * useful under the field.
 */
export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ opts: AskOptions; resolve: (v: string | null) => void } | null>(null);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = useCallback<Ask>(
    (opts) =>
      new Promise((resolve) => {
        setValue(opts.defaultValue ?? '');
        setState({ opts, resolve });
      }),
    []
  );

  const close = (result: string | null) => {
    state?.resolve(result);
    setState(null);
  };

  useEffect(() => {
    if (!state) return;
    inputRef.current?.focus();
    inputRef.current?.select();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <PromptContext.Provider value={ask}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-[100] bg-black/25 flex items-center justify-center px-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(null); }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); close(value.trim() || null); }}
            className="bg-white border border-text w-full max-w-[420px] p-6"
          >
            <h2 className="text-[17px] tracking-[-0.01em] mb-1">{state.opts.title}</h2>
            {state.opts.hint && (
              <p className="text-[12.5px] text-text-secondary leading-[1.5] mb-3">{state.opts.hint}</p>
            )}
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-border focus:outline-none focus:border-text text-[14px] mb-4"
            />
            <div className="flex items-center gap-3 justify-end">
              <button type="button" onClick={() => close(null)}
                className="tlink text-[13px] text-text-secondary hover:text-text">
                Cancel
              </button>
              <button type="submit" disabled={!value.trim()}
                className="px-4 py-2 border border-text text-[13px] hover:bg-text hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text">
                {state.opts.confirmLabel || 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </PromptContext.Provider>
  );
}
