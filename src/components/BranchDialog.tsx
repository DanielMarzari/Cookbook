'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api-client';

export interface BranchCandidate {
  id: string;
  title: string;
  variation_count: number;
  source_label?: string | null;
}

/**
 * The two ways a branch comes into being, in one place.
 *
 * Either the variation doesn't exist yet and you fork this recipe to start it,
 * or it already exists as its own recipe and the two just need joining. Both are
 * "make a branch" from where you're standing, so they belong behind one button
 * rather than in two unrelated corners of the app.
 *
 * Existing recipes are searched, not scrolled. A dropdown is fine at five
 * recipes and useless at fifty, and you always know the name of the thing you're
 * looking for.
 */
export default function BranchDialog({
  recipeId,
  recipeTitle,
  onClose,
  onCreate,
  onAdopt,
}: {
  recipeId: string;
  recipeTitle: string;
  onClose: () => void;
  onCreate: (name: string) => void;
  onAdopt: (candidate: BranchCandidate) => void;
}) {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [name, setName] = useState(`${recipeTitle} — `);
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<BranchCandidate[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.recipes
      .list()
      .then((rs) =>
        setCandidates(
          rs
            .filter((r) => !r.parent_recipe_id && r.id !== recipeId)
            .map((r) => ({ id: r.id, title: r.title, variation_count: r.variation_count || 0, source_label: r.source_label }))
        )
      )
      .catch(() => {});
  }, [recipeId]);

  useEffect(() => {
    inputRef.current?.focus();
    if (mode === 'new') inputRef.current?.select();
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? candidates.filter((c) => c.title.toLowerCase().includes(q)) : candidates;
    return pool.slice(0, 8);
  }, [query, candidates]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/25 flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white border border-text w-full max-w-[480px] p-6">
        <h2 className="text-[19px] tracking-[-0.01em] mb-1">Manage branches</h2>
        <p className="text-[12.5px] text-text-secondary leading-[1.5] mb-4">
          A variation of <span className="text-text">{recipeTitle}</span> — start a new one, or bring in a recipe you already have.
        </p>

        <div className="flex gap-2 mb-4">
          {([['new', 'Start a new one'], ['existing', 'Add an existing recipe']] as const).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-3 py-1.5 border text-[12.5px] transition-colors ${
                mode === m ? 'bg-text border-text text-white' : 'border-border text-text-secondary hover:text-text hover:border-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'new' ? (
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onCreate(name.trim()); }}>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`${recipeTitle} — honey`}
              className="w-full px-3 py-2 border border-border focus:outline-none focus:border-text text-[14px] mb-2"
            />
            <p className="text-[11.5px] text-text-secondary mb-4">
              Copies this recipe as a starting point. Change what differs; the rest stays.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button type="button" onClick={onClose} className="tlink text-[13px] text-text-secondary hover:text-text">Cancel</button>
              <button type="submit" disabled={!name.trim()}
                className="px-4 py-2 border border-text text-[13px] hover:bg-text hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text">
                Create branch
              </button>
            </div>
          </form>
        ) : (
          <div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your recipes…"
              className="w-full px-3 py-2 border border-border focus:outline-none focus:border-text text-[14px]"
            />
            <p className="text-[11.5px] text-text-secondary mt-2 mb-2">
              Nothing is copied — it keeps its own ingredients, steps and photos and joins this family.
            </p>

            <div className="max-h-[280px] overflow-y-auto -mx-1">
              {matches.length === 0 ? (
                <p className="text-[13px] text-text-secondary py-3 px-1">
                  {query.trim() ? `No recipe matching “${query.trim()}”.` : 'No other standalone recipes yet.'}
                </p>
              ) : (
                matches.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onAdopt(c)}
                    className="w-full text-left px-1 py-2.5 border-b border-border last:border-b-0 hover:bg-[#fafafa]"
                  >
                    <span className="block text-[14px] text-text">
                      {c.title}
                      {c.variation_count > 0 && (
                        <span className="text-[11.5px] text-text-secondary ml-2">
                          brings {c.variation_count} variation{c.variation_count === 1 ? '' : 's'}
                        </span>
                      )}
                    </span>
                    {c.source_label && <span className="block text-[11.5px] text-text-secondary mt-0.5">{c.source_label}</span>}
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-end pt-4">
              <button type="button" onClick={onClose} className="tlink text-[13px] text-text-secondary hover:text-text">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
