'use client';

import { useEffect, useState } from 'react';

/**
 * What this dish is called on a menu.
 *
 * "Braciole" is the right name for a recipe and a thin one for a card a guest
 * reads — it says what you made, not what arrives. Blank is fine and common:
 * most recipes never go on a menu, and the dinner card falls back to the title.
 *
 * The suggestions come from the recipe itself, along the four lines menus
 * actually use: how it was cooked, how it tastes, where it is from, and what is
 * in it worth naming. They are a starting point for a sentence you write, which
 * is why they fill the box rather than set it.
 */
export default function MenuNameField({
  recipeId,
  value,
  onChange,
}: {
  recipeId: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [asked, setAsked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetched on demand: the suggestions read the whole recipe, and most visits
  // to this page are not about naming it.
  useEffect(() => {
    if (!asked) return;
    let live = true;
    setLoading(true);
    fetch(`/api/recipes/${recipeId}/menu-name`)
      .then((r) => r.json())
      .then((d) => live && setSuggestions(d.suggestions ?? []))
      .catch(() => live && setSuggestions([]))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [asked, recipeId]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-text-secondary">Menu name</span>
        <button
          type="button"
          onClick={() => setAsked((a) => !a)}
          className="text-[11.5px] text-text-secondary hover:text-text underline underline-offset-4"
        >
          {asked ? 'hide suggestions' : 'suggest'}
        </button>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Leave blank to use the recipe title"
        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {asked && (
        <div className="border border-border p-3">
          {loading ? (
            <p className="text-xs text-text-secondary m-0">Reading the recipe…</p>
          ) : suggestions.length === 0 ? (
            <p className="text-xs text-text-secondary m-0">
              Nothing to go on yet — a method in the steps, a cuisine, or an ingredient worth
              naming is what these are built from.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChange(s)}
                    className={`text-[12.5px] px-2.5 py-1 border transition-colors ${
                      value === s
                        ? 'border-text bg-text text-background'
                        : 'border-border text-text-secondary hover:border-text hover:text-text'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-text-secondary mt-2.5 mb-0 leading-[1.5]">
                How it was cooked · how it tastes · where it is from · what is in it worth naming.
                Pick one and rewrite it — these are a starting point, not an answer.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
