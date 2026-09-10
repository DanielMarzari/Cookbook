'use client';

import { useMemo, useState } from 'react';
import type { Canon, CanonDish } from '@/data/canon';
import { canonTree, keyChips, type CanonNode } from '@/lib/canon';

type View = 'table' | 'outline' | 'staircase';

const VIEWS: { id: View; label: string; blurb: string }[] = [
  { id: 'table', label: 'Table', blurb: 'Every dimension side by side. Two rows that differ in one chip are two dishes that differ in one decision.' },
  { id: 'outline', label: 'Outline', blurb: 'The same dishes nested by the decision that forks first. Reads at any depth, on any screen.' },
  { id: 'staircase', label: 'Staircase', blurb: 'The outline with the shape drawn in. Clearest at two or three levels; the deepest branches run wide.' },
];

/**
 * One authored table, three ways of reading it.
 *
 * The tree views are derived rather than written, so nothing here can claim a
 * dish sits at a depth the table disagrees with.
 */
export default function CanonViews({ canon }: { canon: Canon }) {
  const [view, setView] = useState<View>('table');
  // Which reading of the tree — by technique, by region, and so on.
  const [nesting, setNesting] = useState(0);
  const tree = useMemo(() => canonTree(canon, nesting), [canon, nesting]);
  const lineage = canon.dishes.some((d) => d.parent);
  const active = VIEWS.find((v) => v.id === view)!;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-border pb-2.5 mb-3">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={`text-[12px] uppercase tracking-[0.11em] pb-0.5 border-b transition-colors ${
              view === v.id ? 'text-text border-text' : 'text-text-secondary border-transparent hover:text-text'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[68ch] mb-5">{active.blurb}</p>

      {view !== 'table' && canon.nestings.length > 1 && !lineage && (
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
          <span className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary">Nest</span>
          {canon.nestings.map((n, i) => (
            <button
              key={n.label}
              onClick={() => setNesting(i)}
              aria-pressed={nesting === i}
              className={`text-[12.5px] transition-colors ${
                nesting === i ? 'text-text underline underline-offset-4' : 'text-text-secondary hover:text-text'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}

      {view === 'table' && <FacetTable canon={canon} />}
      {view === 'outline' && <Outline canon={canon} tree={tree} />}
      {view === 'staircase' && <Staircase canon={canon} tree={tree} />}
    </div>
  );
}

/* ── Table ──────────────────────────────────────────────────────────────── */

function Chip({ text, keyed, empty }: { text: string; keyed?: boolean; empty?: boolean }) {
  return (
    <span
      className={`text-[11.5px] px-2 py-[1px] whitespace-nowrap border ${
        empty
          ? 'border-dashed border-border text-text-secondary'
          : keyed
            ? 'border-text text-text'
            : 'border-border text-text-secondary'
      }`}
    >
      {text}
    </span>
  );
}

function FacetTable({ canon }: { canon: Canon }) {
  // One grid for the whole table so the columns line up across every row —
  // per-row grids would each size their own tracks and drift.
  const cols = `repeat(${canon.facets.length}, auto) 1fr`;
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px]" style={{ gridTemplateColumns: cols }}>
        {canon.facets.map((f) => (
          <div
            key={f.id}
            className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary pb-2 pr-4 border-b border-text"
          >
            {f.label}
          </div>
        ))}
        <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary pb-2 border-b border-text text-right">
          It is
        </div>

        {canon.dishes.map((dish) => (
          <Row key={dish.name} canon={canon} dish={dish} />
        ))}
      </div>
    </div>
  );
}

function Row({ canon, dish }: { canon: Canon; dish: CanonDish }) {
  return (
    <>
      {canon.facets.map((f) => {
        const chips = dish.facets[f.id] ?? [];
        const keyed = keyChips(canon, dish, f.id);
        return (
          <div key={f.id} className="flex flex-wrap items-center gap-1.5 py-2.5 pr-4 border-b border-border">
            {chips.length === 0 ? (
              <Chip text="none" empty />
            ) : (
              chips.map((c) => <Chip key={c} text={c} keyed={keyed.has(c)} />)
            )}
          </div>
        );
      })}
      <div className="flex items-center justify-end py-2.5 border-b border-border">
        <span className="text-[14px] text-text whitespace-nowrap">{dish.name}</span>
      </div>
    </>
  );
}

/* ── Outline ────────────────────────────────────────────────────────────── */

function outlineLines(nodes: CanonNode[], prefix = ''): { rail: string; label: string; dish: boolean }[] {
  const out: { rail: string; label: string; dish: boolean }[] = [];
  nodes.forEach((n, i) => {
    const last = i === nodes.length - 1;
    out.push({ rail: `${prefix}${last ? '└─' : '├─'} `, label: n.label, dish: Boolean(n.dish) });
    out.push(...outlineLines(n.children, `${prefix}${last ? '   ' : '│  '}`));
  });
  return out;
}

function Outline({ canon, tree }: { canon: Canon; tree: CanonNode[] }) {
  const lines = outlineLines(tree);
  return (
    <div className="overflow-x-auto">
      <pre className="text-[13.5px] leading-[2] m-0 font-sans whitespace-pre">
        <span className="text-text">{canon.root}</span>
        {'\n'}
        {lines.map((l, i) => (
          <span key={i}>
            <span className="text-border">{l.rail}</span>
            <span className={l.dish ? 'text-text' : 'text-text-secondary text-[12.5px]'}>{l.label}</span>
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  );
}

/* ── Staircase ──────────────────────────────────────────────────────────── */

function Branch({ nodes }: { nodes: CanonNode[] }) {
  return (
    <ul className="list-none m-0 p-0 pl-4 border-l border-border">
      {nodes.map((n) => (
        <li key={n.label + n.depth} className="relative pt-3">
          {/* the elbow onto the parent rail */}
          <span aria-hidden className="absolute left-[-16px] top-[26px] w-4 border-t border-border" />
          {n.dish ? (
            <span className="inline-block border border-text px-3 py-1.5 text-[13.5px] text-text bg-[#fafafa]">
              {n.label}
            </span>
          ) : (
            <span className="inline-block border border-dashed border-border px-3 py-1.5 text-[12.5px] text-text-secondary">
              {n.label}
            </span>
          )}
          {n.children.length > 0 && <Branch nodes={n.children} />}
        </li>
      ))}
    </ul>
  );
}

function Staircase({ canon, tree }: { canon: Canon; tree: CanonNode[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <span className="inline-block bg-text text-white px-3 py-2 text-[13.5px]">{canon.root}</span>
        <Branch nodes={tree} />
      </div>
    </div>
  );
}
