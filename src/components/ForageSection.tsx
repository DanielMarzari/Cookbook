'use client';

import { useState } from 'react';
import { forageByTerrain, forageFor, CAUTION_LABEL, FORAGE_DISCLAIMER, lead, shortScientific, type ForageSpecies } from '@/data/foraging';
import type { RegionId } from '@/data/seasonal-regional';

/**
 * What's growing wild this month, arranged by the ground it grows on.
 *
 * Foraging is a question about place before it's a question about species — you
 * don't set out to find ramps, you walk a damp shaded hardwood slope in April and
 * ramps are what's there. So the organising unit is terrain, and each species
 * leads with where to look and what tells you you're in the right spot.
 *
 * The lookalikes still aren't hidden: anything with a deadly confusable says so
 * on the collapsed row, because that's the one fact you need before bending down.
 */
export default function ForageSection({ region, month, regionLabel, monthLabel }: {
  region: RegionId;
  month: number;
  regionLabel: string;
  monthLabel: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const groups = forageByTerrain(region, month);
  const total = forageFor(region, month).length;

  return (
    <div className="border-t border-border pt-8 mb-16">
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-3">
        <h2 className="text-[24px] tracking-[-0.01em]">Growing wild &middot; {regionLabel}</h2>
        <span className="text-text-secondary text-[13px]">
          {total} to look for in {monthLabel}
        </span>
      </div>

      <p className="text-[12.5px] leading-[1.6] text-text-secondary max-w-[72ch] border-l border-text pl-3 mb-7">
        {FORAGE_DISCLAIMER}
      </p>

      {groups.length === 0 ? (
        <p className="text-[13px] text-text-secondary">
          Nothing listed for {regionLabel} in {monthLabel} &mdash; the quiet months are real, not a gap in the data.
        </p>
      ) : (
        groups.map((g) => (
          <div key={g.terrain} className="mb-9 last:mb-0">
            <div className="flex items-baseline justify-between border-b border-text pb-2 mb-1">
              <h3 className="text-[12.5px] text-text-secondary">{g.label}</h3>
              <span className="text-[12.5px] text-text-secondary tabular-nums">{g.species.length}</span>
            </div>

            {g.species.map((s) => (
              <SpeciesRow
                key={`${g.terrain}-${s.name}`}
                species={s}
                open={open === `${g.terrain}-${s.name}`}
                onToggle={() => setOpen(open === `${g.terrain}-${s.name}` ? null : `${g.terrain}-${s.name}`)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function SpeciesRow({ species: s, open, onToggle }: { species: ForageSpecies; open: boolean; onToggle: () => void }) {
  const deadly = s.lookalikes.filter((l) => l.danger === 'deadly');

  return (
    <div className="border-b border-border py-3.5">
      <button onClick={onToggle} aria-expanded={open} className="w-full text-left">
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-[15px] text-text">
            {s.name} <span className="text-[12px] italic text-text-secondary ml-1">{shortScientific(s.scientific)}</span>
          </span>
          <span className={`text-[11px] uppercase tracking-[0.1em] whitespace-nowrap ${
            s.caution === 'expert' ? 'text-text border-b border-text' : 'text-text-secondary'
          }`}>
            {CAUTION_LABEL[s.caution]}
          </span>
        </span>

        {/* where to look, on the face of it — this is the part you act on */}
        <span className="block text-[13px] leading-[1.55] text-text-secondary mt-1 max-w-[68ch]">
          {open ? s.habitat : lead(s.habitat)}
        </span>
        {s.indicator && (
          <span className="block text-[12.5px] text-text-secondary mt-1 max-w-[68ch]">
            <span className="text-text">Right spot when:</span> {open ? s.indicator : lead(s.indicator)}
          </span>
        )}
        {deadly.length > 0 && !open && (
          <span className="block text-[12.5px] text-text mt-1.5">
            Confusable with {deadly.map((l) => l.name).join(', ')} &mdash; read before picking.
          </span>
        )}
      </button>

      {open && (
        <div className="pt-3 text-[13px] leading-[1.6] text-text-secondary space-y-3">
          {/* the full taxonomy only once you're reading — on the row it's a label, here it's the answer to "which one is it" */}
          {s.scientific.length > shortScientific(s.scientific).length && (
            <p className="italic">{s.scientific}</p>
          )}
          <p><span className="text-text">What to take.</span> {s.parts}</p>
          <p><span className="text-text">Leave enough.</span> {s.harvest}</p>

          {s.lookalikes.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1.5">Do not confuse with</p>
              {s.lookalikes.map((l) => (
                <p key={l.name} className={`py-1.5 border-l pl-3 mb-1.5 ${l.danger === 'deadly' ? 'border-text' : 'border-border'}`}>
                  <span className="text-text">{l.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.1em] ml-2">{l.danger}</span>
                  <span className="block mt-0.5">{l.tell}</span>
                </p>
              ))}
            </div>
          )}

          {s.sources.length > 0 && (
            <p className="text-[11.5px]">
              Sources:{' '}
              {s.sources.map((src, i) => (
                <span key={i}>
                  {i > 0 && ' · '}
                  {/^https?:\/\//.test(src)
                    ? <a href={src} target="_blank" rel="noopener noreferrer" className="tlink">{new URL(src).hostname.replace(/^www\./, '')}</a>
                    : src}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export type { ForageSpecies };
