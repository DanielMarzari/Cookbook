'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

type Family = Awaited<ReturnType<typeof api.recipes.family>>;

export interface ActiveVersion {
  id: string;
  isBase: boolean;
  ingredients: { name: string; quantity: number; unit: string; section: string | null }[];
  instructions: { step_number: number; text: string; timer_minutes?: number; timer_label?: string; section?: string }[];
  changedKeys: string[];
}

/**
 * The version switcher on a recipe page. A branched recipe stays ONE document —
 * picking a variation rewrites only the lines that actually differ and leaves
 * everything else exactly where it was, because a variation usually is three
 * lines different and reprinting the whole recipe hides that.
 *
 * Renders nothing at all when a recipe has no variations, so an ordinary recipe
 * page is untouched.
 */
export default function VariationChips({
  recipeId,
  onChange,
}: {
  recipeId: string;
  onChange: (v: ActiveVersion | null) => void;
}) {
  const [family, setFamily] = useState<Family | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    api.recipes
      .family(recipeId)
      .then((f) => {
        setFamily(f);
        setActive(f.base.id);
      })
      .catch(() => setFamily(null));
  }, [recipeId]);

  if (!family || !family.isBranched) return null;

  const select = (id: string) => {
    if (id === active) return; // re-picking the current version is a no-op
    setActive(id);
    if (id === family.base.id) {
      onChange(null); // back to what the page rendered on the server
      return;
    }
    const v = family.variations.find((x) => x.id === id);
    if (!v) return;
    onChange({
      id: v.id,
      isBase: false,
      ingredients: v.ingredients,
      instructions: v.instructions,
      changedKeys: v.changedKeys,
    });
  };

  const chip = (id: string, label: string) => {
    const on = active === id;
    return (
      <button
        key={id}
        onClick={() => select(id)}
        aria-pressed={on}
        className={`inline-block border px-2 pt-[2px] pb-[3px] mr-[3px] mb-[3px] text-[11px] uppercase tracking-[0.11em] leading-[1.5] align-baseline transition-colors ${
          on
            ? 'bg-text border-text text-white'
            : 'border-border text-text-secondary hover:text-text hover:border-text'
        }`}
      >
        {label}
      </button>
    );
  };

  const current = family.variations.find((v) => v.id === active);

  return (
    <div className="mt-6">
      <p className="text-[12.5px] italic text-text-secondary mb-2">
        this recipe branches — reading{' '}
        {active === family.base.id ? 'the base' : current?.title.toLowerCase()}
      </p>
      <div>
        {chip(family.base.id, 'Base')}
        {family.variations.map((v) => chip(v.id, v.variation_of_label || v.title))}
      </div>
      <p className="text-[12.5px] text-text-secondary mt-2">
        {current ? (
          <>
            {current.summary}
            {' · '}
            <Link href={`/recipes/${current.id}`} className="tlink">
              open on its own
            </Link>
          </>
        ) : (
          <>
            {family.count} variation{family.count > 1 ? 's' : ''} branch from here ·{' '}
            <Link href={`/recipes/${family.base.id}/versions`} className="tlink">
              compare all versions
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
