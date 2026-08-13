"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { ZoneFill } from "./ZoneFill";
import { BOARDS } from "@/lib/charcuterie/boards";
import { CAT_LABEL, getItem } from "@/lib/charcuterie/items";
import { itemsFromIds, suggest } from "@/lib/charcuterie/pairings";
import { balance, boardName } from "@/lib/charcuterie/advice";
import { Card } from "@/components/charcuterie/ui";
import type { BoardFills, Suggestion } from "@/lib/charcuterie/types";

const ACCENT = "#111111";
const KEEP = "#111111";
const SKIP = "#b0b0b0";

/** Keeps land on this board in order — it's the reward for swiping. */
const BOARD = BOARDS.find((b) => b.id === "round") ?? BOARDS[0];
const PATTERN = BOARD.patterns[0];

function SwipeCard({
  s,
  onDecide,
  depth,
}: {
  s: Suggestion;
  onDecide: (keep: boolean) => void;
  depth: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-16, 16]);
  const keepOpacity = useTransform(x, [30, 130], [0, 1]);
  const skipOpacity = useTransform(x, [-130, -30], [1, 0]);
  const item = s.item;
  const cut = item.cuts[0];

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex: 10 - depth }}
      drag={depth === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      initial={{ scale: 0.92, y: 18, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 12, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 460 : -460,
        opacity: 0,
        transition: { duration: 0.28 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onDecide(true);
        else if (info.offset.x < -110) onDecide(false);
      }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <div
          className="relative h-44 shrink-0"
          style={{
            background: `radial-gradient(120% 120% at 50% 20%, ${item.palette[0]}44, transparent 70%)`,
          }}
        >
          <svg viewBox="-100 -100 200 200" className="h-full w-full">
            <ZoneFill
              zone={{
                id: `pocket-${item.id}`,
                label: item.name,
                role: item.cat,
                hint: "",
                d: "M -78 0 A 78 78 0 1 1 -77.99 0 Z",
                center: [0, 0],
                bbox: [-78, -78, 156, 156],
                size: "major",
              }}
              item={item}
              cut={cut}
              idPrefix="pk"
            />
          </svg>

          {/* Verdict stamps, driven straight off the drag position. */}
          <motion.span
            style={{ opacity: keepOpacity, borderColor: KEEP, color: KEEP }}
            className="absolute left-4 top-4 rotate-[-14deg] rounded-lg border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
          >
            On the board
          </motion.span>
          <motion.span
            style={{ opacity: skipOpacity, borderColor: SKIP, color: SKIP }}
            className="absolute right-4 top-4 rotate-[14deg] rounded-lg border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
          >
            Not today
          </motion.span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold">{item.name}</h3>
            <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#9a9a9a]">
              {CAT_LABEL[item.cat]}
            </span>
          </div>
          {s.inSeason && (
            <span className="mt-1 self-start rounded bg-[#f6ece5] px-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#a0522d]">
              at peak now
            </span>
          )}
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{item.note}</p>

          {s.why[0] && (
            <p
              className="mt-2 rounded-lg p-2 text-[11px] leading-snug"
              style={{ background: `${ACCENT}14`, color: ACCENT }}
            >
              {s.why[0]}
            </p>
          )}

          {cut && (
            <p className="mt-auto pt-3 text-[11px] leading-snug text-[#9a9a9a]">
              <span className="text-text">{cut.name}</span> — {cut.how}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PocketBoard({ month }: { month: number }) {
  const [kept, setKept] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [history, setHistory] = useState<{ id: string; kept: boolean }[]>([]);

  const decided = new Set([...kept, ...skipped]);
  const anchors = itemsFromIds(kept);

  function decide(keep: boolean) {
    const s = deck[0];
    if (!s) return;
    setHistory((h) => [...h, { id: s.item.id, kept: keep }]);
    if (keep) setKept((k) => [...k, s.item.id]);
    else setSkipped((k) => [...k, s.item.id]);
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    if (last.kept) setKept((k) => k.filter((i) => i !== last.id));
    else setSkipped((k) => k.filter((i) => i !== last.id));
  }

  // Keeps fill the round board's zones in order, by best-fitting role.
  const fills: BoardFills = {};
  const used = new Set<string>();
  for (const zone of PATTERN.zones) {
    const match = kept.find((id) => {
      if (used.has(id)) return false;
      const item = getItem(id);
      return !!item && (zone.role === "flex" || item.cat === zone.role);
    });
    if (match) {
      used.add(match);
      fills[zone.id] = { itemId: match, cutIndex: 0 };
    }
  }
  const spillover = kept.filter((id) => !used.has(id));

  // Deck order follows what the board still needs. Ranking on `flex` alone
  // would happily offer eight cheeses in a row, which makes for a board you
  // can't actually build.
  const wantedRoles = [
    ...new Set(PATTERN.zones.filter((z) => !fills[z.id]).map((z) => z.role)),
  ];
  const perRole = wantedRoles.map((role) =>
    suggest({ role, anchors, month, placed: kept, limit: 4 }).filter(
      (s) => !decided.has(s.item.id),
    ),
  );
  // Round-robin across the roles so consecutive cards stay varied.
  const deck: Suggestion[] = [];
  for (let i = 0; i < 4; i++) {
    for (const list of perRole) if (list[i]) deck.push(list[i]);
  }
  if (deck.length === 0) {
    deck.push(
      ...suggest({ role: "flex", anchors, month, placed: kept, limit: 30 }).filter(
        (s) => !decided.has(s.item.id),
      ),
    );
  }

  const top = deck.slice(0, 3);

  const keptItems = itemsFromIds(kept);
  const axes = balance(keptItems);
  const [vw, vh] = BOARD.viewBox;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
      {/* The phone */}
      <div className="mx-auto w-full max-w-sm">
        <p className="mb-3 text-center text-sm text-text-secondary">
          Swipe right to keep, left to skip. The board builds from your keeps.
        </p>

        <div className="relative mx-auto aspect-[9/17] w-full rounded-[2.2rem] border-[10px] border-[#f0efec] bg-background p-3 shadow-2xl">
          <span className="absolute left-1/2 top-1.5 h-4 w-24 -translate-x-1/2 rounded-full bg-[#f6f6f4]" />

          <div className="flex h-full flex-col pt-4">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                {kept.length} kept · {skipped.length} skipped
              </span>
              <button
                type="button"
                onClick={undo}
                disabled={history.length === 0}
                className="text-[10px] text-[#9a9a9a] hover:text-text disabled:opacity-40"
              >
                undo
              </button>
            </div>

            <div className="relative flex-1">
              <AnimatePresence mode="popLayout">
                {top.map((s, i) => (
                  <SwipeCard
                    key={s.item.id}
                    s={s}
                    depth={i}
                    onDecide={decide}
                  />
                ))}
              </AnimatePresence>
              {top.length === 0 && (
                <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border">
                  <p className="px-6 text-center text-xs text-[#9a9a9a]">
                    That&apos;s the whole catalogue. {kept.length} things made the
                    board.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => decide(false)}
                className="grid size-12 place-items-center rounded-full border-2 text-lg transition-colors"
                style={{ borderColor: SKIP, color: SKIP }}
                aria-label="Skip"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => decide(true)}
                className="grid size-14 place-items-center rounded-full border-2 text-xl transition-colors"
                style={{ borderColor: KEEP, color: KEEP }}
                aria-label="Keep"
              >
                ♥
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* What it built */}
      <div className="space-y-4">
        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">
                {kept.length ? boardName(PATTERN, fills) : "Nothing kept yet"}
              </p>
              <p className="text-[11px] text-[#9a9a9a]">
                {BOARD.name} · {Object.keys(fills).length}/{PATTERN.zones.length}{" "}
                zones filled from {kept.length} keeps
              </p>
            </div>
            {kept.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setKept([]);
                  setSkipped([]);
                  setHistory([]);
                }}
                className="rounded-lg bg-[#f6f6f4] px-2.5 py-1 text-[11px] text-text-secondary hover:text-text"
              >
                Start over
              </button>
            )}
          </div>

          <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" aria-label="Board from your keeps">
            <defs>
              <clipPath id="pk-clip">
                <path d={BOARD.outline} />
              </clipPath>
            </defs>
            <g clipPath="url(#pk-clip)">
              <rect width={vw} height={vh} fill="#a8814c" />
            </g>
            <path d={BOARD.outline} fill="none" stroke="#6b4f2a" strokeWidth={3} />
            {PATTERN.zones.map((z) => {
              const fill = fills[z.id];
              const item = fill ? getItem(fill.itemId) : undefined;
              if (!item) {
                return (
                  <path
                    key={z.id}
                    d={z.d}
                    fill="#000000"
                    fillOpacity={0.04}
                    stroke="#000000"
                    strokeOpacity={0.20}
                    strokeDasharray="6 6"
                  />
                );
              }
              return (
                <motion.g
                  key={z.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  style={{ transformOrigin: `${z.center[0]}px ${z.center[1]}px` }}
                >
                  <ZoneFill zone={z} item={item} cut={item.cuts[0]} idPrefix="pkb" />
                </motion.g>
              );
            })}
          </svg>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
              Balance so far
            </p>
            <ul className="mt-3 space-y-2">
              {axes.map((a) => (
                <li key={a.key} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[11px] text-text-secondary">{a.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f6f6f4]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: a.value < 0.3 ? "#a0522d" : ACCENT }}
                      animate={{ width: `${Math.round(a.value * 100)}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
              Kept
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {keptItems.map((i) => (
                <motion.span
                  key={i.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f6f6f4] py-0.5 pl-1 pr-2 text-[11px] text-text-secondary"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: i.palette[0] }}
                  />
                  {i.name}
                </motion.span>
              ))}
              {kept.length === 0 && (
                <p className="text-[11px] text-[#9a9a9a]">Swipe right on something.</p>
              )}
            </div>
            {spillover.length > 0 && (
              <p className="mt-3 text-[10px] leading-snug text-[#9a9a9a]">
                {spillover.length} keep{spillover.length === 1 ? "" : "s"} didn&apos;t
                fit this board&apos;s zones — they&apos;d go on a bigger one.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
