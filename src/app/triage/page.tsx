'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { Recipe, Source } from '@/lib/types';
import { toast } from '@/lib/toast';

/**
 * Who each recipe came from.
 *
 * Source used to be free text typed per recipe, which is how "Tasting History"
 * and "Tasting History (Cookbook)" became two different things. Here the list is
 * the vocabulary: assign from it, add to it, and merge the duplicates it already
 * accumulated. Featuring is a property of the source rather than the recipe —
 * you decide that your family cookbook leads the shelf once, not fifty times.
 */
export default function SourcesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () =>
    Promise.all([api.recipes.list(), api.sources.list()])
      .then(([rs, ss]) => {
        setRecipes(rs.filter((r) => !r.parent_recipe_id));
        setSources(ss.sources);
      })
      .catch(() => toast.error('Could not load sources'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const assign = async (recipeId: string, sourceId: string) => {
    if (sourceId === '__new__') {
      const name = prompt('New source — a person, publication, platform, or "Family recipes"');
      if (!name?.trim()) return;
      const { source } = await api.sources.create(name.trim());
      await api.recipes.update(recipeId, { source_id: source.id });
      toast.success(`Filed under ${source.name}`);
      return load();
    }
    setRecipes((prev) => prev.map((r) => (r.id === recipeId ? { ...r, source_id: sourceId } : r)));
    try {
      await api.recipes.update(recipeId, { source_id: sourceId });
    } catch {
      toast.error('Could not save that one');
      load();
    }
  };

  const toggleFeatured = async (s: Source) => {
    setBusy(s.id);
    try {
      await api.sources.update({ id: s.id, featured: !s.featured });
      await load();
    } catch {
      toast.error('Could not change that source');
    } finally {
      setBusy(null);
    }
  };

  const merge = async (s: Source) => {
    const others = sources.filter((o) => o.id !== s.id);
    const target = prompt(
      `Merge "${s.name}" into which source?\n\n${others.map((o, i) => `${i + 1}. ${o.name}`).join('\n')}\n\nEnter a number:`
    );
    const pick = others[Number(target) - 1];
    if (!pick) return;
    if (!confirm(`Move all ${s.recipe_count} recipes from "${s.name}" to "${pick.name}"? "${s.name}" is then removed.`)) return;
    setBusy(s.id);
    try {
      await api.sources.update({ id: s.id, mergeInto: pick.id });
      toast.success(`Merged into ${pick.name}`);
      await load();
    } catch {
      toast.error('Could not merge');
    } finally {
      setBusy(null);
    }
  };

  const featuredCount = recipes.filter(
    (r) => sources.find((s) => s.id === r.source_id)?.featured
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-8 pb-6">
        <h1 className="text-[30px] tracking-[-0.02em] mb-2">Sources</h1>
        <p className="text-[13.5px] text-text-secondary leading-[1.6] max-w-[64ch]">
          Every recipe belongs to a source. Sources marked{' '}
          <b className="font-normal text-text">featured</b>{' '}lead the home shelf; the rest stay in
          search, collections and the planner &mdash; shelved, not hidden.
        </p>
      </div>

      {/* The vocabulary itself */}
      <div className="flex items-baseline justify-between border-b border-text pb-2.5">
        <h2 className="text-[12.5px] text-text-secondary">The list</h2>
        <span className="text-[12.5px] text-text-secondary tabular-nums">
          {featuredCount} of {recipes.length} on the shelf
        </span>
      </div>
      <div className="mb-10">
        {sources.map((s) => (
          <div key={s.id} className="flex items-center gap-4 py-3 border-b border-border">
            <span className="flex-1 min-w-0">
              <span className="block text-[14.5px] text-text truncate">{s.name}</span>
              <span className="block text-[11.5px] text-text-secondary mt-0.5">
                {s.kind || 'unclassified'} &middot; {s.recipe_count} recipe{s.recipe_count === 1 ? '' : 's'}
              </span>
            </span>
            {(s.recipe_count ?? 0) > 0 && sources.length > 1 && (
              <button onClick={() => merge(s)} disabled={busy === s.id}
                className="tlink text-[12.5px] text-text-secondary hover:text-text disabled:opacity-50">
                merge
              </button>
            )}
            <button
              onClick={() => toggleFeatured(s)}
              disabled={busy === s.id}
              aria-pressed={!!s.featured}
              className={`px-3 py-1.5 border text-[12.5px] transition-colors disabled:opacity-50 ${
                s.featured ? 'bg-text border-text text-white' : 'border-border text-text-secondary hover:text-text hover:border-text'
              }`}
            >
              {s.featured ? 'Featured' : 'Not featured'}
            </button>
          </div>
        ))}
        <button
          onClick={async () => {
            const name = prompt('New source — a person, publication, platform, or "Family recipes"');
            if (!name?.trim()) return;
            await api.sources.create(name.trim());
            load();
          }}
          className="mt-4 tlink text-[13px] text-text-secondary hover:text-text"
        >
          + Add a source
        </button>
      </div>

      {/* Assignment */}
      <div className="flex items-baseline justify-between border-b border-text pb-2.5">
        <h2 className="text-[12.5px] text-text-secondary">Every recipe</h2>
      </div>
      {loading ? (
        <p className="text-[13px] text-text-secondary py-8">Loading&hellip;</p>
      ) : (
        recipes.map((r) => (
          <div key={r.id} className="grid grid-cols-[44px_minmax(0,1fr)_auto] gap-4 items-center py-3 border-b border-border">
            <span className="relative block w-11 h-14 bg-[#F4F4F4] overflow-hidden">
              {r.image_url && <Image src={r.image_url} alt="" fill sizes="44px" className="object-cover" />}
            </span>
            <span className="min-w-0">
              <Link href={`/recipes/${r.id}`} className="block text-[14.5px] text-text truncate hover:underline underline-offset-4 decoration-1">
                {r.title}
              </Link>
              <span className="block text-[11.5px] text-text-secondary truncate mt-0.5">
                {r.source_name || 'no source recorded'}{r.source_author ? ` · ${r.source_author}` : ''}
              </span>
            </span>
            <select
              value={r.source_id || ''}
              onChange={(e) => assign(r.id, e.target.value)}
              className="px-3 py-1.5 border border-border text-[12.5px] text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary max-w-[190px]"
            >
              <option value="">&mdash; unassigned</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              <option value="__new__">+ new source&hellip;</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}
