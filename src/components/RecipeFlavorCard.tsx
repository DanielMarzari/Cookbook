'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { cap } from '@/lib/flavor';
import FlavorWheel from '@/components/FlavorWheel';

type Data = Awaited<ReturnType<typeof api.flavor.recipeHarmony>>;

// The flavour read-out for a recipe, shown on the recipe page: its combined
// flavour profile (mini-wheel), an overall cohesion/harmony score, its tightest
// internal pairs, and one boost. Renders nothing until 2+ ingredients map to the
// flavour DB (otherwise there's nothing meaningful to show).
export default function RecipeFlavorCard({ recipeId }: { recipeId: string }) {
  const [d, setD] = useState<Data | null>(null);
  const [families, setFamilies] = useState<string[]>([]);

  useEffect(() => {
    api.flavor.recipeHarmony(recipeId).then(setD).catch(() => setD(null));
    api.flavor.notesList().then((n) => setFamilies(n.families || [])).catch(() => {});
  }, [recipeId]);

  if (!d || !d.merged || d.ingredients.length < 2 || d.harmony === 0) return null;

  // Only claim a proportion when the recipe actually gave us amounts to weigh —
  // otherwise the shares would just be 1/n dressed up as a measurement.
  const measured = (d.proportions ?? []).some((p) => p.grams != null) ? d.proportions : [];

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-5">
        <h2 className="text-[20px] tracking-[-0.01em] text-text">Flavour profile</h2>
        <span className="text-[11.5px] text-text-secondary">from the Flavor Lab</span>
      </div>
      <div className="border border-border p-5 md:p-6 grid md:grid-cols-[160px_110px_1fr] gap-6 md:gap-7 items-center">
        <FlavorWheel families={families} activeByFamily={Object.fromEntries(d.merged.families.map((f) => [f.name, f.notes]))} activeCount={d.merged.activeNotes} variant="mini" size={190} />
        <div className="text-center">
          <div className="relative w-[104px] h-[104px] mx-auto rounded-full grid place-items-center" style={{ background: `conic-gradient(#141310 0 ${d.harmony}%, #eee 0)` }}>
            <div className="absolute inset-[9px] bg-white rounded-full" />
            <div className="relative text-center"><b className="text-[30px] font-normal">{d.harmony}</b><div className="text-[9px] uppercase tracking-[0.1em] text-text-secondary mt-0.5">cohesion</div></div>
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2">tightest pairs</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {d.tightestPairs.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-[12.5px]">{cap(p.a)} · {cap(p.b)} <b className="text-text">{p.synergy}</b></span>
            ))}
          </div>
          {d.boost && <p className="text-[13px] text-text-secondary m-0">Boost: a touch of <b className="text-text">{cap(d.boost.name)}</b> would tie the plate together <span className="text-text">(+{d.boost.lift})</span>.</p>}
          {measured.length > 0 ? (
            <div className="mt-3.5">
              <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1.5">by proportion</div>
              <div className="flex h-[7px] w-full" role="img" aria-label={measured.map((p) => `${cap(p.name)} ${p.pct}%`).join(', ')}>
                {measured.map((p, i) => (
                  <div
                    key={p.name}
                    className="h-full border-r border-white last:border-r-0"
                    // ramp spans the same 1 → 0.4 range however many ingredients
                    // there are, so a long list's tail stays legible
                    style={{ width: `${p.pct}%`, background: `rgba(20,19,16,${1 - (i / Math.max(1, measured.length - 1)) * 0.6})` }}
                  />
                ))}
              </div>
              <p className="text-[11.5px] text-text-secondary mt-1.5">
                {measured.map((p) => `${cap(p.name)} ${p.pct}%`).join(' · ')}
              </p>
            </div>
          ) : (
            <p className="text-[11.5px] text-text-secondary mt-3">reads {d.ingredients.length} flavour ingredients: {d.ingredients.map(cap).join(', ')}</p>
          )}
        </div>
      </div>
    </section>
  );
}
