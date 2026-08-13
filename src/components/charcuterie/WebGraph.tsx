"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { ZoneFill } from "./ZoneFill";
import { BOARDS } from "@/lib/charcuterie/boards";
import { GRAPH_VIEW, neighbourhood, topPartners } from "@/lib/charcuterie/graph";
import { CAT_LABEL, getItem, isInSeason } from "@/lib/charcuterie/items";
import { itemsFromIds, pairScore } from "@/lib/charcuterie/pairings";
import { balance, boardName } from "@/lib/charcuterie/advice";
import { Card } from "@/components/charcuterie/ui";
import type { BoardFills, Cat } from "@/lib/charcuterie/types";

const ACCENT = "#111111";
const BOARD = BOARDS.find((b) => b.id === "plank") ?? BOARDS[0];
const PATTERN = BOARD.patterns[1] ?? BOARD.patterns[0];

const CAT_COLOR: Record<Cat, string> = {
  cheese: "#efd08a",
  meat: "#cf7371",
  fruit: "#d9425c",
  dried: "#c8712c",
  cracker: "#e0d0aa",
  spread: "#f0b43c",
  nut: "#b08a5e",
  briny: "#8fa63c",
  sweet: "#7a5442",
  garnish: "#5e7d4c",
  veg: "#8fbf5e",
};

const emptySubscribe = () => () => {};

/** The layout runs client-side only. Node and the browser don't agree to the
 *  last bit on Math.sin/cos, and 340 iterations of a force simulation amplify
 *  that into visibly different coordinates — a real hydration mismatch. The
 *  blob paths elsewhere dodge this by rounding into a path string; here the
 *  numbers are the output, so the honest fix is not to render it on the server. */
export function WebGraph({ month }: { month: number }) {
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!hydrated) {
    return (
      <Card className="grid h-96 place-items-center">
        <p className="text-sm text-[#9a9a9a]">Spinning up the flavour web…</p>
      </Card>
    );
  }
  return <Graph month={month} />;
}

function Graph({ month }: { month: number }) {
  const [focusId, setFocusId] = useState("peach");
  const [path, setPath] = useState<string[]>(["peach"]);
  const [hover, setHover] = useState<string | null>(null);

  const focus = getItem(focusId);
  const graph = neighbourhood(focusId);
  const [vw, vh] = GRAPH_VIEW;

  const hovered = hover ? getItem(hover) : undefined;
  const hoverEdge =
    hovered && focus && hovered.id !== focus.id ? pairScore(focus, hovered) : null;

  function walkTo(id: string) {
    setFocusId(id);
    setPath((p) => (p.includes(id) ? p : [...p, id]));
  }

  // The path you walked becomes the board.
  const fills: BoardFills = {};
  const used = new Set<string>();
  for (const zone of PATTERN.zones) {
    const match = path.find((id) => {
      if (used.has(id)) return false;
      const item = getItem(id);
      return !!item && (zone.role === "flex" || item.cat === zone.role);
    });
    if (match) {
      used.add(match);
      fills[zone.id] = { itemId: match, cutIndex: 0 };
    }
  }

  const pathItems = itemsFromIds(path);
  const axes = balance(pathItems);
  const [bvw, bvh] = BOARD.viewBox;

  // Edge endpoints, resolved once for drawing.
  const pos = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl text-sm text-text-secondary">
          Every line is a real pairing from the same engine the other mockups
          use — thicker means stronger. Click a node to walk there; whatever you
          walk through lands on the board.
        </p>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(CAT_COLOR) as Cat[]).map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full bg-[#f6f6f4] px-1.5 py-0.5 text-[10px] text-[#9a9a9a]"
            >
              <span className="size-2 rounded-full" style={{ background: CAT_COLOR[c] }} />
              {CAT_LABEL[c]}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="overflow-hidden p-3">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs font-semibold" style={{ color: ACCENT }}>
              {focus?.name}
              <span className="ml-2 font-normal text-[#9a9a9a]">
                {graph.nodes.length} nodes · {graph.edges.length} pairings
              </span>
            </p>
            {hovered && hoverEdge && hoverEdge.why[0] && (
              <p className="max-w-md truncate text-[11px] text-text-secondary">
                <span style={{ color: ACCENT }}>{hovered.name}</span> —{" "}
                {hoverEdge.why[0]}
              </p>
            )}
          </div>

          <svg
            viewBox={`0 0 ${vw} ${vh}`}
            className="w-full rounded-lg bg-[#fafafa]"
            aria-label={`Pairing network around ${focus?.name}`}
          >
            {/* Edges */}
            {graph.edges.map((e) => {
              const a = pos.get(e.a);
              const b = pos.get(e.b);
              if (!a || !b) return null;
              const touchesFocus = e.a === focusId || e.b === focusId;
              const touchesHover = hover !== null && (e.a === hover || e.b === hover);
              return (
                <motion.line
                  key={`${e.a}-${e.b}`}
                  // Plain attributes as well as the animation target: motion
                  // only writes these once it animates, so without them the
                  // first paint has no coordinates at all.
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  initial={{ x1: a.x, y1: a.y, x2: b.x, y2: b.y }}
                  animate={{ x1: a.x, y1: a.y, x2: b.x, y2: b.y }}
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                  stroke={touchesHover ? ACCENT : touchesFocus ? "#767676" : "#d8d8d8"}
                  strokeWidth={Math.max(0.6, Math.min(3.4, e.w / 9))}
                  strokeOpacity={touchesHover ? 0.95 : touchesFocus ? 0.7 : 0.32}
                />
              );
            })}

            {/* Nodes */}
            {graph.nodes.map((n) => {
              const r = n.depth === 0 ? 26 : n.depth === 1 ? 15 : 9;
              const onPath = path.includes(n.id);
              return (
                <motion.g
                  key={n.id}
                  animate={{ x: n.x, y: n.y }}
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                  className="cursor-pointer"
                  onClick={() => walkTo(n.id)}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  {onPath && (
                    <circle r={r + 5} fill="none" stroke={ACCENT} strokeWidth={1.6} />
                  )}
                  <circle
                    r={r}
                    fill={CAT_COLOR[n.item.cat]}
                    stroke="#000000"
                    strokeWidth={1.5}
                    opacity={n.depth === 2 ? 0.75 : 1}
                  />
                  {isInSeason(n.item, month) && (
                    <circle r={r * 0.32} cy={-r * 0.55} fill="#a0522d" />
                  )}
                  {(n.depth < 2 || hover === n.id) && (
                    <text
                      y={r + 12}
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      fill={n.depth === 0 ? "#111111" : "#767676"}
                      fontSize={n.depth === 0 ? 15 : 11}
                      fontWeight={n.depth === 0 ? 600 : 400}
                    >
                      {n.item.name}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Strongest links from here, as a readable list */}
          {focus && (
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                Strongest links from {focus.name}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {topPartners(focus, 10).map((p) => (
                  <button
                    key={p.item.id}
                    type="button"
                    onClick={() => walkTo(p.item.id)}
                    onMouseEnter={() => setHover(p.item.id)}
                    onMouseLeave={() => setHover(null)}
                    title={p.why}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-[#f6f6f4] py-0.5 pl-1 pr-2 text-[11px] text-text-secondary transition-colors hover:text-text"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: CAT_COLOR[p.item.cat] }}
                    />
                    {p.item.name}
                    <span className="font-mono text-[9px] text-[#9a9a9a]">
                      {Math.round(p.w)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* The board your walk built */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{boardName(PATTERN, fills)}</p>
                <p className="text-[11px] text-[#9a9a9a]">
                  {Object.keys(fills).length}/{PATTERN.zones.length} zones from a{" "}
                  {path.length}-step walk
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPath([focusId])}
                className="rounded-lg bg-[#f6f6f4] px-2 py-1 text-[11px] text-text-secondary hover:text-text"
              >
                Reset walk
              </button>
            </div>

            <svg viewBox={`0 0 ${bvw} ${bvh}`} className="w-full" aria-label="Board from your walk">
              <defs>
                <clipPath id="wb-clip">
                  <path d={BOARD.outline} />
                </clipPath>
              </defs>
              <g clipPath="url(#wb-clip)">
                <rect width={bvw} height={bvh} fill="#6d4a2e" />
              </g>
              <path d={BOARD.outline} fill="none" stroke="#3f2917" strokeWidth={3} />
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
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                    style={{ transformOrigin: `${z.center[0]}px ${z.center[1]}px` }}
                  >
                    <ZoneFill zone={z} item={item} cut={item.cuts[0]} idPrefix="wb" />
                  </motion.g>
                );
              })}
            </svg>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
              Your path
            </p>
            <ol className="mt-2 space-y-1">
              {pathItems.map((i, idx) => (
                <li key={i.id} className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-4 shrink-0 font-mono text-[#9a9a9a]">{idx + 1}</span>
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: CAT_COLOR[i.cat] }}
                  />
                  <button
                    type="button"
                    onClick={() => setFocusId(i.id)}
                    className={`truncate text-left ${
                      i.id === focusId ? "text-text" : "text-text-secondary hover:text-text"
                    }`}
                  >
                    {i.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPath((p) => p.filter((x) => x !== i.id))}
                    className="ml-auto shrink-0 text-[#9a9a9a] hover:text-red-600"
                    aria-label={`Remove ${i.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ol>

            <ul className="mt-4 space-y-2 border-t border-border pt-3">
              {axes.map((a) => (
                <li key={a.key} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[11px] text-text-secondary">{a.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f6f6f4]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: a.value < 0.3 ? "#a0522d" : ACCENT }}
                      animate={{ width: `${Math.round(a.value * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
