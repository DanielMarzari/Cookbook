'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import RecipeMarks from '@/components/RecipeMarks';

type Family = Awaited<ReturnType<typeof api.recipes.family>>;
type Member = Family['variations'][number];

/**
 * A whole version of the dish, not a patch against another one.
 *
 * Everything the recipe page prints is in here, because picking a chip swaps
 * the entire page — picture, title, times, lede, notes, method — rather than
 * only rewriting the ingredient lines. `changedKeys` is the one thing that is
 * still relative: it marks which lines differ from the base, which is worth
 * keeping even once you are reading the branch as its own recipe.
 */
export interface ActiveVersion {
  id: string;
  isBase: boolean;
  title: string;
  image_url: string | null;
  image_position: string | null;
  image_zoom: number | null;
  image_rotation: number | null;
  description: string | null;
  notes: string | null;
  cuisine_type: string | null;
  servings: number | null;
  total_time_minutes: number | null;
  yield_quantity: number | null;
  yield_unit: string | null;
  difficulty: string | null;
  status: string | null;
  source_url: string | null;
  source_name: string | null;
  is_favorite: number | boolean | null;
  is_signature: number | boolean | null;
  ingredients: { name: string; quantity: number; unit: string; section: string | null }[];
  instructions: { step_number: number; text: string; timer_minutes?: number; timer_label?: string; section?: string }[];
  changedKeys: string[];
}

/** Build the page-facing version from a family member row. */
function toVersion(m: Member | Family['base'], isBase: boolean): ActiveVersion {
  const v = m as Member;
  return {
    id: v.id,
    isBase,
    title: v.title,
    image_url: v.image_url ?? null,
    image_position: v.image_position ?? null,
    image_zoom: v.image_zoom ?? null,
    image_rotation: v.image_rotation ?? null,
    description: v.description ?? null,
    notes: v.notes ?? null,
    cuisine_type: v.cuisine_type ?? null,
    servings: v.servings ?? null,
    total_time_minutes: v.total_time_minutes ?? null,
    yield_quantity: v.yield_quantity ?? null,
    yield_unit: v.yield_unit ?? null,
    difficulty: v.difficulty ?? null,
    status: v.status ?? null,
    source_url: v.source_url ?? null,
    source_name: v.source_name ?? null,
    is_favorite: v.is_favorite ?? null,
    is_signature: v.is_signature ?? null,
    ingredients: v.ingredients ?? [],
    instructions: v.instructions ?? [],
    changedKeys: v.changedKeys ?? [],
  };
}

/**
 * The version switcher on a recipe page.
 *
 * Picking a chip puts you on that version of the dish in full. It used to swap
 * only the ingredient lines, on the theory that a variation is three lines
 * different and reprinting the whole recipe hides that — but the result was a
 * page showing the rose cardamom ingredients under the vanilla photograph and
 * the vanilla title, which reads as a bug rather than as a careful diff. The
 * lines that differ are still marked; everything else now follows.
 *
 * `onChange(null)` means "the recipe this page was opened as", which is not
 * always the base — open a branch directly and its own chip is the lit one.
 *
 * Renders nothing at all when a recipe has no variations, so an ordinary recipe
 * page is untouched.
 */
export default function VariationChips({
  recipeId,
  activeId,
  onChange,
}: {
  recipeId: string;
  /** Which chip is lit; defaults to the page's own recipe. */
  activeId?: string | null;
  onChange: (v: ActiveVersion | null) => void;
}) {
  const [family, setFamily] = useState<Family | null>(null);

  useEffect(() => {
    api.recipes
      .family(recipeId)
      .then(setFamily)
      .catch(() => setFamily(null));
  }, [recipeId]);

  if (!family || !family.isBranched) return null;

  const active = activeId || recipeId;

  const select = (id: string) => {
    if (id === active) return; // re-picking the current version is a no-op
    if (id === recipeId) {
      onChange(null); // back to what the page rendered on the server
      return;
    }
    if (id === family.base.id) {
      onChange(toVersion(family.base, true));
      return;
    }
    const v = family.variations.find((x) => x.id === id);
    if (v) onChange(toVersion(v, false));
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
  const onBase = active === family.base.id;

  return (
    <div className="mt-6">
      <p className="text-[12.5px] italic text-text-secondary mb-2">
        this recipe branches — reading {onBase ? 'the base' : current?.title.toLowerCase()}
      </p>
      <div>
        {chip(family.base.id, 'Base')}
        {family.variations.map((v) => chip(v.id, v.variation_of_label || v.title))}
      </div>
      {/* The marks belong to the version on screen, not to the family. Keyed by
          the active id so switching versions remounts them with that branch's
          own state instead of carrying the last one's over. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
        <RecipeMarks
          key={active}
          recipeId={active}
          initial={
            current
              ? { is_favorite: current.is_favorite, is_signature: current.is_signature, status: current.status }
              : { is_favorite: family.base.is_favorite, is_signature: family.base.is_signature, status: family.base.status }
          }
          size={14}
        />
        <span className="text-[12px] text-text-secondary">
          {onBase ? 'marking the base' : `marking ${current?.title.toLowerCase()}`}
        </span>
      </div>

      <p className="text-[12.5px] text-text-secondary mt-2">
        {current ? (
          <>
            {current.summary}
            {active !== recipeId && (
              <>
                {' · '}
                <Link href={`/recipes/${current.id}`} className="tlink">
                  open on its own
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            {family.count} variation{family.count > 1 ? 's' : ''} branch from here ·{' '}
            <Link href={`/recipes/${family.base.id}/versions`} className="tlink">
              manage branches
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
