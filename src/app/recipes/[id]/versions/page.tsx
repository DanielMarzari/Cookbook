'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { formatQuantity } from '@/lib/units';
import { titleCaseIngredient } from '@/lib/utils';
import type { DraftPayload } from '@/lib/drafts';
import { usePrompt } from '@/components/Prompt';

type Family = Awaited<ReturnType<typeof api.recipes.family>>;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Versions of a recipe, side by side, and the one place a staged change gets
 * resolved.
 *
 * The rail is every version of the dish, base first. The detail pane shows the
 * selected one. If there are uncommitted edits, they surface here with the only
 * two answers that matter: fold them into this recipe, or let them become a
 * variation of their own. That second option is the whole point — you usually
 * only find out a change was a new dish after you made it.
 */
export default function RecipeVersionsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const ask = usePrompt();

  const [family, setFamily] = useState<Family | null>(null);
  const [cur, setCur] = useState(0);
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [busy, setBusy] = useState(false);
  // Recipes that could join this family — anything standing on its own.
  const [candidates, setCandidates] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    api.recipes.list()
      .then((rs) => setCandidates(rs.filter((r) => !r.parent_recipe_id && r.id !== id).map((r) => ({ id: r.id, title: r.title }))))
      .catch(() => {});
  }, [id]);

  // Join a recipe that already exists, rather than forking a copy of this one.
  const adopt = async (childId: string) => {
    const child = candidates.find((c) => c.id === childId);
    if (!child) return;
    if (!confirm(`Make "${child.title}" a variation of ${family?.base.title}? It keeps its own ingredients, steps and photos — it just joins the family.`)) return;
    setBusy(true);
    try {
      await api.recipes.adopt(id, childId);
      toast.success(`"${child.title}" joined the family`);
      load();
      api.recipes.list().then((rs) => setCandidates(rs.filter((r) => !r.parent_recipe_id && r.id !== id).map((r) => ({ id: r.id, title: r.title })))).catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message.replace(/^API error:\s*/, '') : '';
      try { toast.error(JSON.parse(msg).error || 'Could not link those recipes'); }
      catch { toast.error('Could not link those recipes'); }
    } finally {
      setBusy(false);
    }
  };

  const load = useCallback(() => {
    api.recipes.family(id).then(setFamily).catch(() => setFamily(null));
    api.recipes.getDraft(id).then((d) => setDraft(d.draft)).catch(() => setDraft(null));
  }, [id]);
  useEffect(load, [load]);

  if (!family) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <p className="text-[13px] text-text-secondary">Loading versions…</p>
      </div>
    );
  }

  const versions = [
    { id: family.base.id, title: family.base.title, image_url: family.base.image_url, label: null as string | null, isBase: true, summary: 'the original' },
    ...family.variations.map((v) => ({
      id: v.id, title: v.title, image_url: v.image_url, label: v.variation_of_label, isBase: false, summary: v.summary,
    })),
  ];
  const active = versions[Math.min(cur, versions.length - 1)];
  const activeVariation = family.variations.find((v) => v.id === active.id);
  const shownIngredients = activeVariation ? activeVariation.ingredients : family.baseIngredients;

  const commit = async (mode: 'update' | 'branch') => {
    if (busy) return;
    let title: string | undefined;
    let label: string | undefined;
    if (mode === 'branch') {
      const answer = await ask({
        title: 'Name this variation',
        hint: 'Your staged changes become this new branch; the recipe stays as it was.',
        defaultValue: `${family.base.title} — `,
        confirmLabel: 'Branch',
      });
      if (!answer) return;
      title = answer;
      label = answer.split('—').pop()?.trim().toLowerCase();
    } else if (!confirm('Fold these changes into the recipe? The previous version is not kept.')) {
      return;
    }
    setBusy(true);
    try {
      const res = await api.recipes.commitDraft(id, mode, title, label);
      toast.success(mode === 'branch' ? `Branched into "${res.recipe.title}"` : 'Changes committed');
      if (mode === 'branch') router.push(`/recipes/${res.recipe.id}`);
      else { setDraft(null); load(); }
    } catch (err) {
      console.error('Commit failed:', err);
      toast.error('Could not commit the change');
    } finally {
      setBusy(false);
    }
  };

  const discard = async () => {
    if (!confirm('Throw away the staged changes? The recipe itself is untouched.')) return;
    await api.recipes.discardDraft(id);
    setDraft(null);
    toast.success('Staged changes discarded');
  };

  return (
    <div className="max-w-[1188px] mx-auto px-6 pb-20">
      <div className="py-5">
        <Link href={`/recipes/${id}`} className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text">
          <ArrowLeft size={15} strokeWidth={1.8} /> {family.base.title}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[236px_minmax(0,1fr)]">
        {/* ── rail: every version, base first ── */}
        <aside className="md:border-r border-border md:pr-5 pb-6 md:pb-10">
          <div className="md:sticky md:top-4">
            <div className="flex items-baseline justify-between border-b border-text pb-2.5">
              <h2 className="text-[12.5px] text-text-secondary">Versions</h2>
              <span className="text-[12.5px] text-text-secondary tabular-nums">{pad(versions.length)}</span>
            </div>
            {versions.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setCur(i)}
                aria-current={i === cur}
                className={`w-full grid grid-cols-[40px_minmax(0,1fr)] gap-[11px] items-center text-left py-[9px] pl-[11px] border-b border-border last:border-b-0 border-l transition-colors ${
                  i === cur ? 'border-l-text' : 'border-l-transparent'
                }`}
              >
                <span className={`relative block w-10 h-[50px] bg-[#F4F4F4] overflow-hidden transition-opacity ${i === cur ? 'opacity-100' : 'opacity-50'}`}>
                  {v.image_url && <Image src={v.image_url} alt="" fill sizes="40px" className="object-cover" />}
                </span>
                <span>
                  <span className={`block text-[13.5px] leading-[1.32] ${i === cur ? 'text-text underline underline-offset-4 decoration-1' : 'text-text-secondary'}`}>
                    {v.title}
                  </span>
                  <span className="block text-[11.5px] text-text-secondary mt-[3px]">
                    {v.isBase ? 'base' : v.label || 'variation'}
                  </span>
                </span>
              </button>
            ))}
            {candidates.length > 0 && (
              <div className="pt-4">
                <select
                  value=""
                  disabled={busy}
                  onChange={(e) => { if (e.target.value) adopt(e.target.value); e.target.value = ''; }}
                  className="w-full px-2 py-1.5 border border-border text-[12.5px] text-text-secondary focus:outline-none focus:border-text disabled:opacity-50"
                >
                  <option value="">+ add an existing recipe&hellip;</option>
                  {candidates.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                </select>
                <p className="text-[11.5px] text-text-secondary mt-2 leading-[1.45]">
                  Joins a recipe you already have to this family. Nothing is copied.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ── detail: the selected version, plus anything staged ── */}
        <section className="md:pl-9 pt-2">
          <p className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">
            version {pad(cur + 1)} of {pad(versions.length)}{active.isBase ? ' · base' : ''}
          </p>
          <h1 className="text-[26px] tracking-[-0.01em] mt-2 mb-1">{active.title}</h1>
          <p className="text-[13px] text-text-secondary mb-6">{active.summary}</p>

          {/* Staged changes live at the top, because they're the thing awaiting a
              decision — everything below is already settled. */}
          {draft ? (
            <div className="border border-text p-5 mb-8">
              <p className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2">uncommitted changes</p>
              <p className="text-[13.5px] leading-[1.6] text-text mb-4 max-w-[54ch]">
                You have edits staged against <b className="font-normal underline underline-offset-4 decoration-1">{family.base.title}</b>.
                Fold them in, or let them become a variation and leave this recipe as it was.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => commit('update')} disabled={busy} className="px-4 py-2 border border-text text-[13px] hover:bg-text hover:text-white transition-colors disabled:opacity-50">
                  Commit to this recipe
                </button>
                <button onClick={() => commit('branch')} disabled={busy} className="px-4 py-2 border border-border text-[13px] text-text-secondary hover:text-text hover:border-text transition-colors disabled:opacity-50">
                  Save as a new variation
                </button>
                <button onClick={discard} disabled={busy} className="tlink text-[13px] text-text-secondary hover:text-text disabled:opacity-50">
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-text-secondary border-b border-border pb-5 mb-8">
              No staged changes.{' '}
              <Link href={`/recipes/${active.id}/edit`} className="tlink">Edit this version</Link>
              {' '}and they&rsquo;ll appear here to commit or branch.
            </p>
          )}

          <h2 className="text-[12.5px] text-text-secondary border-b border-text pb-2.5">
            Ingredients {!active.isBase && <span className="text-text-secondary/70">— changes from the base are marked</span>}
          </h2>
          <div className="mb-8">
            {shownIngredients.map((ing, idx) => {
              const changed = activeVariation?.changedKeys.includes(
                `${(ing.section || '').toLowerCase()}|${ing.name.toLowerCase()}`
              );
              return (
                <div
                  key={idx}
                  className={`flex items-baseline justify-between gap-5 py-2.5 border-b border-border ${
                    changed ? 'border-l border-l-text pl-2.5 -ml-2.5' : ''
                  }`}
                >
                  <span className="text-[14.5px] text-text">{titleCaseIngredient(ing.name)}</span>
                  {ing.quantity > 0 && (
                    <span className="text-[14px] tabular-nums whitespace-nowrap text-text-secondary">
                      {formatQuantity(ing.quantity, ing.unit)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
