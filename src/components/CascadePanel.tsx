'use client';

import { useEffect, useState } from 'react';
import { GitBranch } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import type { IngredientLine } from '@/lib/variations';
import type { InstructionStep } from '@/lib/types';

/**
 * Push an edit on a base down into its branches.
 *
 * Deliberately a button rather than something that happens on save: this editor
 * autosaves every second and a half, so "cascade when you save" would fire
 * forty times while you typed a sentence. You make the change, then you decide
 * it belongs to the family.
 *
 * The before-state is whatever the page loaded, so one press carries everything
 * done in this sitting. After a successful push the baseline moves up to the
 * current state, so pressing it twice doesn't re-apply the same delta — the
 * second press correctly finds nothing to do.
 *
 * Renders nothing unless the recipe is a base with branches hanging off it.
 */
export default function CascadePanel({
  recipeId,
  before,
  onPushed,
}: {
  recipeId: string;
  /** What the base looked like when the editor opened. */
  before: { ingredients: IngredientLine[]; instructions: InstructionStep[] } | null;
  onPushed?: () => void;
}) {
  const [branches, setBranches] = useState<{ id: string; title: string }[] | null>(null);
  const [doIngredients, setDoIngredients] = useState(true);
  const [doInstructions, setDoInstructions] = useState(true);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api.recipes
      .family(recipeId)
      .then((f) => {
        if (!live) return;
        // Only the stem cascades. Opening a branch's editor must not offer to
        // push its edits onto its siblings — they are not downstream of it.
        setBranches(f.base.id === recipeId ? f.variations.map((v) => ({ id: v.id, title: v.title })) : []);
      })
      .catch(() => setBranches([]));
    return () => {
      live = false;
    };
  }, [recipeId]);

  if (!branches || branches.length === 0) return null;

  const n = branches.length;

  async function push() {
    if (!before || busy) return;
    setBusy(true);
    setReport(null);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/cascade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: doIngredients,
          instructions: doInstructions,
          beforeIngredients: before.ingredients,
          beforeInstructions: before.instructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'That did not go through.');
      setReport(data.summary);
      toast.success(data.summary);
      onPushed?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'That did not go through.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-border p-5">
      <div className="flex items-start gap-3">
        <GitBranch size={16} strokeWidth={1.8} className="text-text-secondary mt-[3px] shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm m-0">
            {n} branch{n === 1 ? '' : 'es'} hang{n === 1 ? 's' : ''} off this recipe
          </p>
          <p className="text-xs text-text-secondary mt-1.5 mb-0 max-w-[62ch]">
            Push what you changed here down into {n === 1 ? 'it' : 'them'}. A branch that had
            already changed a line keeps its own — you'll be told which.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={doIngredients}
                onChange={(e) => setDoIngredients(e.target.checked)}
              />
              Ingredients
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={doInstructions}
                onChange={(e) => setDoInstructions(e.target.checked)}
              />
              Steps
            </label>
            <button
              onClick={push}
              disabled={busy || (!doIngredients && !doInstructions) || !before}
              className="px-4 py-2 border border-border text-sm hover:border-text transition-colors
                         disabled:opacity-40 disabled:hover:border-border"
            >
              {busy ? 'Pushing…' : `Push to ${n === 1 ? 'the branch' : `all ${n}`}`}
            </button>
          </div>

          {report && (
            <p className="text-xs text-text mt-3 mb-0 leading-[1.6] max-w-[62ch]">{report}</p>
          )}

          <p className="text-[11px] text-text-secondary mt-3 mb-0 max-w-[62ch]">
            Steps are all or nothing per branch: prose doesn't merge line by line, so a branch
            that wrote its own method keeps it rather than having sentences spliced together.
          </p>
        </div>
      </div>
    </div>
  );
}
