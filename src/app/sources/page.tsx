'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { Recipe, Source } from '@/lib/types';
import { toast } from '@/lib/toast';
import { usePrompt } from '@/components/Prompt';

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
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [bulking, setBulking] = useState(false);
  const [mergingFrom, setMergingFrom] = useState<string | null>(null);
  const ask = usePrompt();

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
      const name = await ask({ title: 'New source', hint: 'A person, a publication, a platform, or something like "Family recipes".', confirmLabel: 'Create' });
      if (!name) return;
      const { source } = await api.sources.create(name);
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

  // Backfilling one dropdown at a time is the slow way through fifty recipes.
  // Select a run of them and file the whole lot at once.
  const assignPicked = async (sourceId: string) => {
    if (!sourceId || picked.size === 0) return;
    setBulking(true);
    const ids = [...picked];
    try {
      // sequential on purpose — SQLite writes serialise anyway, and this keeps
      // a failure halfway through from being ambiguous about what landed
      for (const rid of ids) await api.recipes.update(rid, { source_id: sourceId });
      toast.success(`Filed ${ids.length} recipe${ids.length === 1 ? '' : 's'}`);
      setPicked(new Set());
      await load();
    } catch {
      toast.error('Some did not save — reloading to show what did');
      await load();
    } finally {
      setBulking(false);
    }
  };

  const togglePick = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

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

  const merge = async (fromId: string, intoId: string) => {
    const from = sources.find((x) => x.id === fromId);
    const into = sources.find((x) => x.id === intoId);
    if (!from || !into) return;
    if (!confirm(`Move ${from.recipe_count} recipe${from.recipe_count === 1 ? '' : 's'} from "${from.name}" to "${into.name}"? "${from.name}" is then removed.`)) return;
    setBusy(fromId);
    try {
      await api.sources.update({ id: fromId, mergeInto: intoId });
      toast.success(`Merged into ${into.name}`);
      setMergingFrom(null);
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
            {sources.length > 1 && (
              mergingFrom === s.id ? (
                <select
                  autoFocus
                  defaultValue=""
                  disabled={busy === s.id}
                  onChange={(e) => (e.target.value ? merge(s.id, e.target.value) : setMergingFrom(null))}
                  className="px-2 py-1.5 border border-text text-[12.5px] focus:outline-none disabled:opacity-50"
                >
                  <option value="">merge into&hellip;</option>
                  {sources.filter((o) => o.id !== s.id).map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              ) : (
                <button onClick={() => setMergingFrom(s.id)} disabled={busy === s.id}
                  className="tlink text-[12.5px] text-text-secondary hover:text-text disabled:opacity-50">
                  merge
                </button>
              )
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
            const name = await ask({ title: 'New source', hint: 'A person, a publication, a platform, or something like "Family recipes".', confirmLabel: 'Create' });
            if (!name) return;
            await api.sources.create(name);
            toast.success(`Added ${name}`);
            load();
          }}
          className="mt-4 tlink text-[13px] text-text-secondary hover:text-text"
        >
          + Add a source
        </button>
      </div>

      {/* Assignment */}
      <div className="flex flex-wrap items-center gap-3 border-b border-text pb-2.5">
        <h2 className="text-[12.5px] text-text-secondary flex-1">Every recipe</h2>
        <button
          onClick={() => setPicked(picked.size === recipes.length ? new Set() : new Set(recipes.map((r) => r.id)))}
          className="tlink text-[12.5px] text-text-secondary hover:text-text"
        >
          {picked.size === recipes.length ? 'clear' : 'select all'}
        </button>
        {picked.size > 0 && (
          <>
            <span className="text-[12.5px] text-text tabular-nums">{picked.size} selected &rarr;</span>
            <select
              defaultValue=""
              disabled={bulking}
              onChange={(e) => { assignPicked(e.target.value); e.target.value = ''; }}
              className="px-3 py-1.5 border border-text text-[12.5px] focus:outline-none disabled:opacity-50"
            >
              <option value="">file all under&hellip;</option>
              {sources.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </>
        )}
      </div>
      {loading ? (
        <p className="text-[13px] text-text-secondary py-8">Loading&hellip;</p>
      ) : (
        recipes.map((r) => (
          <div key={r.id} className={`grid grid-cols-[22px_44px_minmax(0,1fr)_auto] gap-4 items-center py-3 border-b border-border ${picked.has(r.id) ? 'bg-[#fafafa]' : ''}`}>
            <input
              type="checkbox"
              checked={picked.has(r.id)}
              onChange={() => togglePick(r.id)}
              aria-label={`Select ${r.title}`}
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <span className="relative block w-11 h-14 bg-[#F4F4F4] overflow-hidden">
              {r.image_url && <Image src={r.image_url} alt="" fill sizes="44px" className="object-cover" />}
            </span>
            <span className="min-w-0">
              <Link href={`/recipes/${r.id}`} className="block text-[14.5px] text-text truncate hover:underline underline-offset-4 decoration-1">
                {r.title}
              </Link>
              <span className="block text-[11.5px] text-text-secondary truncate mt-0.5">
                {r.source_label || 'unassigned'}
                {r.source_name && r.source_name !== r.source_label ? ` · imported as "${r.source_name}"` : ''}
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
