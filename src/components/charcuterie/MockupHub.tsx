"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BOARDS } from "@/lib/charcuterie/boards";
import { MOCKUPS, type Mockup } from "@/lib/charcuterie/mockups";
import { applyTheme, THEMES } from "@/lib/charcuterie/themes";
import { getItem, ITEMS } from "@/lib/charcuterie/items";
import { AFFINITIES } from "@/lib/charcuterie/pairings";
import { CAT_LABEL } from "@/lib/charcuterie/items";
import type { Cat } from "@/lib/charcuterie/types";

/** Each card gets a different board + theme so the hub itself shows the range
 *  of the underlying data rather than the same picture six times. */
const PREVIEW: Record<string, { board: string; theme: string }> = {
  studio: { board: "plank", theme: "stone-fruit" },
  atelier: { board: "round", theme: "tuscan" },
  editorial: { board: "paddle", theme: "orchard" },
  console: { board: "slate", theme: "blue-honey" },
  pocket: { board: "wreath", theme: "brunch" },
  web: { board: "runner", theme: "crudite" },
};

function Preview({ mockup, month }: { mockup: Mockup; month: number }) {
  const spec = PREVIEW[mockup.id] ?? PREVIEW.studio;
  const board = BOARDS.find((b) => b.id === spec.board) ?? BOARDS[0];
  const pattern = board.patterns[0];
  const theme = THEMES.find((t) => t.id === spec.theme) ?? THEMES[0];
  const fills = applyTheme(theme, pattern, month);
  const [vw, vh] = board.viewBox;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} className="h-full w-full" aria-hidden="true">
      <path d={board.outline} fill="#5a4630" opacity={0.9} />
      {pattern.zones.map((z, i) => {
        const item = fills[z.id] ? getItem(fills[z.id].itemId) : undefined;
        return (
          <motion.path
            key={z.id}
            d={z.d}
            fill={item?.palette[0] ?? "#ffffff"}
            fillOpacity={item ? 0.95 : 0.08}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.06 * i,
              type: "spring",
              stiffness: 240,
              damping: 22,
            }}
            style={{ transformOrigin: `${z.center[0]}px ${z.center[1]}px` }}
          />
        );
      })}
    </svg>
  );
}

export function MockupHub({ month }: { month: number }) {
  const catCounts = ITEMS.reduce<Record<string, number>>((acc, i) => {
    acc[i.cat] = (acc[i.cat] ?? 0) + 1;
    return acc;
  }, {});

  const patternCount = BOARDS.reduce((n, b) => n + b.patterns.length, 0);
  const loveCount = ITEMS.reduce((n, i) => n + (i.loves?.length ?? 0), 0);

  const stats = [
    { label: "ingredients", value: ITEMS.length },
    { label: "board shapes", value: BOARDS.length },
    { label: "arrangements", value: patternCount },
    { label: "pairing rules", value: AFFINITIES.length },
    { label: "named pairings", value: loveCount },
    { label: "themes", value: THEMES.length },
  ];

  return (
    <div className="space-y-6">
      {/* Data the six mockups all share. */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
          One catalogue, six interfaces
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <p className="font-mono text-xl font-semibold text-text">
                {s.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(Object.keys(catCounts) as Cat[]).map((c) => (
            <span
              key={c}
              className="rounded-full bg-[#f6f6f4] px-2 py-0.5 text-[10px] text-text-secondary"
            >
              {CAT_LABEL[c]}{" "}
              <span className="font-mono text-[#9a9a9a]">{catCounts[c]}</span>
            </span>
          ))}
        </div>
      </section>

      {/* The six. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MOCKUPS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 24 }}
          >
            <Link href={`/charcuterie/${m.slug}`} className="group block h-full">
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors"
                style={{ borderColor: undefined }}
              >
                <div
                  className="relative h-36 overflow-hidden border-b border-border p-3"
                  style={{
                    background: `radial-gradient(120% 120% at 50% 0%, ${m.accent}22, transparent 70%)`,
                  }}
                >
                  <Preview mockup={m} month={month} />
                  <span
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
                    style={{ background: `${m.accent}26`, color: m.accent }}
                  >
                    0{i + 1}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2
                      className="text-sm font-semibold"
                      style={{ color: m.accent }}
                    >
                      {m.name}
                    </h2>
                    <span className="text-[10px] text-[#9a9a9a] opacity-0 transition-opacity group-hover:opacity-100">
                      open →
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-text">
                    {m.tagline}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
                    {m.blurb}
                  </p>

                  <ul className="mt-3 space-y-1">
                    {m.features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-1.5 text-[11px] leading-snug text-[#9a9a9a]"
                      >
                        <span style={{ color: m.accent }}>·</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 border-t border-border pt-2 text-[10px] leading-snug text-[#9a9a9a]">
                    <span className="uppercase tracking-wider">Best for</span> —{" "}
                    {m.bestFor}
                  </p>
                </div>
              </motion.article>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
