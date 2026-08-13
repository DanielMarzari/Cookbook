"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ZoneFill } from "./ZoneFill";
import { BOARDS, getBoard } from "@/lib/charcuterie/boards";
import { blob } from "@/lib/charcuterie/geometry";
import { CAT_LABEL, ITEMS, getItem, isInSeason, itemsByCat } from "@/lib/charcuterie/items";
import { itemsFromIds, suggest } from "@/lib/charcuterie/pairings";
import { balance, boardName, paletteOf } from "@/lib/charcuterie/advice";
import { Card } from "@/components/charcuterie/ui";
import { SaveBoardBar } from "./SaveBoardBar";
import type { Cat, Item, Zone } from "@/lib/charcuterie/types";

const STORAGE_KEY = "dispatch.charcuterie.atelier.v1";
const ACCENT = "#111111";

/** A single thing placed on the board. Position is in percent of the board box
 *  so it survives any resize; z-order is the array index. */
interface Placement {
  id: string;
  itemId: string;
  cutIndex: number;
  x: number;
  y: number;
  scale: number;
  rot: number;
}

export interface Draft {
  boardId: string;
  placements: Placement[];
  seq: number;
}

const DEFAULT_DRAFT: Draft = {
  boardId: "round",
  placements: [],
  seq: 1,
};

function loadDraft(): Draft {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const d = JSON.parse(raw) as Partial<Draft>;
    return {
      boardId: getBoard(d.boardId ?? "")?.id ?? DEFAULT_DRAFT.boardId,
      placements: Array.isArray(d.placements) ? d.placements : [],
      seq: typeof d.seq === "number" ? d.seq : 1,
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

/** Every placement draws through the same motif engine the other mockups use —
 *  it just gets a synthetic zone centred on the origin instead of a board zone. */
const PLACE_VIEW = 200;
function placementZone(p: Placement, item: Item): Zone {
  const r = PLACE_VIEW * 0.42;
  const shape = blob(0, 0, r, r * 0.82, `atelier-${p.id}-${item.id}`);
  return {
    id: `atelier-${p.id}`,
    label: item.name,
    role: item.cat,
    hint: "",
    d: shape.d,
    center: shape.center,
    bbox: shape.bbox,
    size: "major",
  };
}

function PlacementArt({ p, item }: { p: Placement; item: Item }) {
  const zone = placementZone(p, item);
  const cut = item.cuts[p.cutIndex] ?? item.cuts[0];
  return (
    <svg
      viewBox={`${-PLACE_VIEW / 2} ${-PLACE_VIEW / 2} ${PLACE_VIEW} ${PLACE_VIEW}`}
      className="h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <ZoneFill zone={zone} item={item} cut={cut} idPrefix={`at-${p.id}`} />
    </svg>
  );
}

const emptySubscribe = () => () => {};

export function AtelierBuilder({
  month,
  initial = null,
  editingId = null,
}: {
  month: number;
  initial?: Draft | null;
  editingId?: string | null;
}) {
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!hydrated) {
    return (
      <Card className="grid h-96 place-items-center">
        <p className="text-sm text-[#9a9a9a]">Clearing the bench…</p>
      </Card>
    );
  }
  return <Atelier month={month} initial={initial} editingId={editingId} />;
}

function Atelier({
  month,
  initial,
  editingId,
}: {
  month: number;
  initial: Draft | null;
  editingId: string | null;
}) {
  const [draft, setDraft] = useState<Draft>(() => initial ?? loadDraft());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cat, setCat] = useState<Cat>("cheese");
  const [query, setQuery] = useState("");
  /** Item picked up from the tray and following the cursor, if any. */
  const [carrying, setCarrying] = useState<Item | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  /** The ghost is positioned by writing to the node directly. Putting the
   *  cursor position in state would re-render on every pointermove and churn
   *  the listeners below along with it. */
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const { boardId, placements } = draft;
  const board = getBoard(boardId) ?? BOARDS[0];
  const [vw, vh] = board.viewBox;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Not worth interrupting anyone over.
    }
  }, [draft]);

  const placedItems = placements
    .map((p) => getItem(p.itemId))
    .filter((i): i is Item => !!i);
  const axes = balance(placedItems);
  const palette = paletteOf(placedItems);
  const selected = placements.find((p) => p.id === selectedId) ?? null;
  const selectedItem = selected ? getItem(selected.itemId) : undefined;

  // Ranked against everything already on the board, same engine as Studio.
  const anchors = itemsFromIds([...new Set(placements.map((p) => p.itemId))]);
  const ranked = suggest({
    role: cat,
    anchors,
    month,
    placed: placements.map((p) => p.itemId),
    limit: 6,
  });

  const tray = (() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return ITEMS.filter(
        (i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q)),
      ).slice(0, 40);
    }
    return itemsByCat(cat);
  })();

  function update(patch: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function pointToPct(clientX: number, clientY: number) {
    const el = boardRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * 100,
      y: ((clientY - r.top) / r.height) * 100,
    };
  }

  const place = useCallback(
    (item: Item, x: number, y: number) => {
      // Derive the next id from what's actually placed, so it can't drift out
      // of sync with a restored draft.
      const n =
        placements.reduce((m, p) => Math.max(m, Number(p.id.slice(1)) || 0), 0) +
        1;
      const id = `p${n}`;
      setDraft((d) => ({
        ...d,
        seq: n + 1,
        placements: [
          ...d.placements,
          { id, itemId: item.id, cutIndex: 0, x, y, scale: 1, rot: 0 },
        ],
      }));
      setSelectedId(id);
    },
    [placements],
  );

  // --- carrying an item from the tray ---
  useEffect(() => {
    // Capture into a local so the narrowing survives into the handlers below.
    const item = carrying;
    if (!item) return;
    function move(e: PointerEvent) {
      const g = ghostRef.current;
      if (g) {
        g.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        g.style.opacity = "0.9";
      }
    }
    function drop(e: PointerEvent) {
      const pt = pointToPct(e.clientX, e.clientY);
      // Re-check `item` here: the outer narrowing doesn't reach inside a
      // hoisted function declaration.
      if (item && pt && pt.x >= 0 && pt.x <= 100 && pt.y >= 0 && pt.y <= 100) {
        place(item, pt.x, pt.y);
      }
      setCarrying(null);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", drop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", drop);
    };
  }, [carrying, place]);

  // --- dragging a placement already on the board ---
  useEffect(() => {
    function move(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;
      const pt = pointToPct(e.clientX, e.clientY);
      if (!pt) return;
      setDraft((prev) => ({
        ...prev,
        placements: prev.placements.map((p) =>
          p.id === d.id
            ? {
                ...p,
                x: Math.max(0, Math.min(100, pt.x - d.dx)),
                y: Math.max(0, Math.min(100, pt.y - d.dy)),
              }
            : p,
        ),
      }));
    }
    function end() {
      dragRef.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
  }, []);

  function mutate(id: string, patch: Partial<Placement>) {
    setDraft((d) => ({
      ...d,
      placements: d.placements.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  function remove(id: string) {
    setDraft((d) => ({ ...d, placements: d.placements.filter((p) => p.id !== id) }));
    setSelectedId(null);
  }

  function reorder(id: string, dir: 1 | -1) {
    setDraft((d) => {
      const i = d.placements.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= d.placements.length) return d;
      const next = [...d.placements];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...d, placements: next };
    });
  }

  // Keyboard: nudge, scale, rotate, delete.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") return setSelectedId(null);
      if (!selectedId) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      const p = draft.placements.find((q) => q.id === selectedId);
      if (!p) return;
      const step = e.shiftKey ? 4 : 1;
      const keys: Record<string, () => void> = {
        ArrowLeft: () => mutate(p.id, { x: Math.max(0, p.x - step) }),
        ArrowRight: () => mutate(p.id, { x: Math.min(100, p.x + step) }),
        ArrowUp: () => mutate(p.id, { y: Math.max(0, p.y - step) }),
        ArrowDown: () => mutate(p.id, { y: Math.min(100, p.y + step) }),
        "[": () => mutate(p.id, { rot: p.rot - 15 }),
        "]": () => mutate(p.id, { rot: p.rot + 15 }),
        "-": () => mutate(p.id, { scale: Math.max(0.4, p.scale - 0.1) }),
        "=": () => mutate(p.id, { scale: Math.min(2.4, p.scale + 0.1) }),
        Backspace: () => remove(p.id),
        Delete: () => remove(p.id),
      };
      const fn = keys[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, draft.placements]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl text-sm text-text-secondary">
          No zones and no rules. Drag anything out of the tray onto the board,
          then move, scale, rotate and layer it by hand. Suggestions still rank
          against whatever you&apos;ve already put down.
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {BOARDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => update({ boardId: b.id })}
              className={`rounded-lg px-2.5 py-1 text-[11px] transition-colors ${
                b.id === board.id
                  ? "text-background"
                  : "bg-[#f6f6f4] text-text-secondary hover:text-text"
              }`}
              style={b.id === board.id ? { background: ACCENT } : undefined}
            >
              {b.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)_16rem]">
        {/* Tray */}
        <Card className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden lg:sticky lg:top-4 lg:self-start">
          <div className="border-b border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              The tray
            </p>
            <p className="mt-1 text-[11px] text-text-secondary">
              Drag onto the board, or just click to drop it in the middle.
            </p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 202 ingredients…"
              className="mt-2 w-full rounded-lg border border-border bg-[#f6f6f4] px-2.5 py-1.5 text-xs text-text placeholder:text-[#9a9a9a] focus:outline-none"
              style={{ borderColor: query ? ACCENT : undefined }}
            />
            {!query && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(Object.keys(CAT_LABEL) as Cat[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                      cat === c ? "text-background" : "bg-[#f6f6f4] text-[#9a9a9a] hover:text-text"
                    }`}
                    style={cat === c ? { background: ACCENT } : undefined}
                  >
                    {CAT_LABEL[c]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!query && ranked.length > 0 && (
            <div className="border-b border-border p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
                {anchors.length ? "Goes with what's on the board" : "Start here"}
              </p>
              <div className="mt-1.5 space-y-1">
                {ranked.slice(0, 4).map((s) => (
                  <button
                    key={s.item.id}
                    type="button"
                    onPointerDown={() => setCarrying(s.item)}
                    onClick={() => place(s.item, 50, 50)}
                    className="w-full rounded-lg border border-border bg-[#f6f6f4] p-1.5 text-left transition-colors hover:border-[color:var(--a)]"
                    style={{ "--a": ACCENT } as React.CSSProperties}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: s.item.palette[0] }}
                      />
                      <span className="truncate text-[11px] font-medium">
                        {s.item.name}
                      </span>
                      {s.ranked && (
                        <span className="ml-auto font-mono text-[10px] text-[#9a9a9a]">
                          {s.match}
                        </span>
                      )}
                    </span>
                    {s.why[0] && (
                      <span className="mt-0.5 block text-[10px] leading-snug" style={{ color: ACCENT }}>
                        {s.why[0]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-1.5">
              {tray.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.note}
                  onPointerDown={() => setCarrying(item)}
                  onClick={() => place(item, 50, 50)}
                  className="flex cursor-grab items-center gap-1.5 rounded-lg border border-border bg-[#f6f6f4] p-1.5 text-left transition-colors hover:border-[color:var(--a)] active:cursor-grabbing"
                  style={{ "--a": ACCENT } as React.CSSProperties}
                >
                  <span
                    className="size-3 shrink-0 rounded-full ring-1 ring-white/20"
                    style={{ background: item.palette[0] }}
                  />
                  <span className="truncate text-[10px] leading-tight">{item.name}</span>
                  {isInSeason(item, month) && (
                    <span className="ml-auto text-[9px] text-[#a0522d]">★</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Board */}
        <div className="space-y-3">
          <Card className="p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">
                  {boardName(
                    { id: "atelier", name: "", tagline: "", zones: [] },
                    {},
                  ) === "The Empty Board" && placements.length === 0
                    ? "The Empty Board"
                    : `${placements.length} item${placements.length === 1 ? "" : "s"} placed`}
                </p>
                <p className="text-[11px] text-[#9a9a9a]">
                  {board.name} · drag to move · click to select · arrows nudge ·
                  [ ] rotate · − = resize
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  update({ placements: [] });
                  setSelectedId(null);
                }}
                disabled={placements.length === 0}
                className="rounded-lg bg-[#f6f6f4] px-2.5 py-1 text-[11px] text-text-secondary hover:text-text disabled:cursor-not-allowed disabled:text-[#c4c4c4]"
              >
                Clear board
              </button>
            </div>

            <div
              ref={boardRef}
              className="relative w-full select-none"
              style={{ aspectRatio: `${vw} / ${vh}` }}
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) setSelectedId(null);
              }}
            >
              <svg
                viewBox={`0 0 ${vw} ${vh}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-label={`${board.name}, freeform`}
              >
                <defs>
                  <filter id="at-grain" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.07" numOctaves={4} seed={9} />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                  <clipPath id="at-clip">
                    <path d={board.outline} />
                  </clipPath>
                </defs>
                <g clipPath="url(#at-clip)">
                  <rect width={vw} height={vh} fill="#8a6a42" />
                  <rect
                    width={vw}
                    height={vh}
                    fill="#4a3418"
                    filter="url(#at-grain)"
                    opacity={0.42}
                    style={{ mixBlendMode: "multiply" }}
                  />
                </g>
                <path d={board.outline} fill="none" stroke="#5a4028" strokeWidth={3} />
              </svg>

              <AnimatePresence>
                {placements.map((p, i) => {
                  const item = getItem(p.itemId);
                  if (!item) return null;
                  const active = p.id === selectedId;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1, rotate: p.rot }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      className="absolute cursor-grab active:cursor-grabbing"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${18 * p.scale}%`,
                        // Centre on (x, y) with negative margins rather than a
                        // translate: motion owns `transform` on this element,
                        // and anything set here would be overwritten. Percentage
                        // margins resolve against the parent's width, which is
                        // exactly half this square's size.
                        marginLeft: `${-9 * p.scale}%`,
                        marginTop: `${-9 * p.scale}%`,
                        aspectRatio: "1 / 1",
                        zIndex: i + 1,
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setSelectedId(p.id);
                        const pt = pointToPct(e.clientX, e.clientY);
                        if (pt) dragRef.current = { id: p.id, dx: pt.x - p.x, dy: pt.y - p.y };
                      }}
                    >
                      <PlacementArt p={p} item={item} />
                      {active && (
                        <span
                          className="pointer-events-none absolute inset-[-6%] rounded-full border-2 border-dashed"
                          style={{ borderColor: ACCENT }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {placements.length === 0 && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <p className="rounded-lg bg-white/80 px-3 py-2 text-xs text-[#9a9a9a] backdrop-blur">
                    Drag something out of the tray →
                  </p>
                </div>
              )}
            </div>
          </Card>

          <SaveBoardBar
            boardId={board.id}
            patternId={board.patterns[0].id}
            mode="freeform"
            placements={placements.map((p) => ({
              itemId: p.itemId,
              cutIndex: p.cutIndex,
              x: p.x,
              y: p.y,
              scale: p.scale,
              rot: p.rot,
            }))}
            itemCount={placements.length}
            suggestedName={`${board.name} freeform`}
            editingId={editingId}
          />

          {/* Selected-item controls */}
          <AnimatePresence>
            {selected && selectedItem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-3 rounded-full ring-1 ring-white/20"
                        style={{ background: selectedItem.palette[0] }}
                      />
                      <span className="text-xs font-medium">{selectedItem.name}</span>
                    </span>

                    <label className="flex items-center gap-1.5 text-[11px] text-[#9a9a9a]">
                      size
                      <input
                        type="range"
                        min={0.4}
                        max={2.4}
                        step={0.05}
                        value={selected.scale}
                        onChange={(e) => mutate(selected.id, { scale: Number(e.target.value) })}
                        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#f6f6f4]"
                        style={{ accentColor: ACCENT }}
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-[#9a9a9a]">
                      turn
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        step={5}
                        value={selected.rot}
                        onChange={(e) => mutate(selected.id, { rot: Number(e.target.value) })}
                        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#f6f6f4]"
                        style={{ accentColor: ACCENT }}
                      />
                    </label>

                    <select
                      value={selected.cutIndex}
                      onChange={(e) => mutate(selected.id, { cutIndex: Number(e.target.value) })}
                      className="rounded-lg border border-border bg-[#f6f6f4] px-2 py-1 text-[11px] text-text focus:outline-none"
                    >
                      {selectedItem.cuts.map((c, i) => (
                        <option key={c.name} value={i}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="ml-auto flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => reorder(selected.id, -1)}
                        className="rounded-md bg-[#f6f6f4] px-2 py-1 text-[11px] text-text-secondary hover:text-text"
                      >
                        ↓ back
                      </button>
                      <button
                        type="button"
                        onClick={() => reorder(selected.id, 1)}
                        className="rounded-md bg-[#f6f6f4] px-2 py-1 text-[11px] text-text-secondary hover:text-text"
                      >
                        ↑ front
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(selected.id)}
                        className="rounded-md px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
                    <span style={{ color: ACCENT }}>
                      {(selectedItem.cuts[selected.cutIndex] ?? selectedItem.cuts[0])?.name}
                    </span>{" "}
                    — {(selectedItem.cuts[selected.cutIndex] ?? selectedItem.cuts[0])?.how}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Readout */}
        <Card className="p-4 lg:sticky lg:top-4 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
            As it stands
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
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {palette.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] text-[#9a9a9a]">Colour</p>
              <div className="mt-1.5 flex h-6 overflow-hidden rounded-md ring-1 ring-white/10">
                {palette.map((c, i) => (
                  <motion.div
                    key={`${c}-${i}`}
                    className="flex-1"
                    style={{ background: c }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-1.5 border-t border-border pt-3">
            <p className="text-[11px] text-[#9a9a9a]">Layers, front to back</p>
            {[...placements].reverse().map((p) => {
              const item = getItem(p.itemId);
              if (!item) return null;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px] transition-colors ${
                    p.id === selectedId ? "bg-[#f6f6f4] text-text" : "text-text-secondary hover:text-text"
                  }`}
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: item.palette[0] }}
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
            {placements.length === 0 && (
              <p className="text-[11px] text-[#9a9a9a]">Nothing placed yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* The thing following your cursor while you drag out of the tray. */}
      {carrying && (
        <div
          ref={ghostRef}
          className="pointer-events-none fixed left-0 top-0 z-50 size-16 opacity-0"
        >
          <PlacementArt
            p={{ id: "ghost", itemId: carrying.id, cutIndex: 0, x: 0, y: 0, scale: 1, rot: 0 }}
            item={carrying}
          />
        </div>
      )}
    </div>
  );
}
