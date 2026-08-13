"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { BalanceMeter } from "./BalanceMeter";
import { BoardCanvas } from "./BoardCanvas";
import { BoardDoctor } from "./BoardDoctor";
import { BoardSummary } from "./BoardSummary";
import { ItemPicker } from "./ItemPicker";
import { PantryBar } from "./PantryBar";
import { BOARDS, getBoard, getPattern } from "@/lib/charcuterie/boards";
import {
  MONTHS,
  balance,
  boardDoctor,
  boardName,
  paletteOf,
  placedItems,
} from "@/lib/charcuterie/advice";
import { seasonalPicks } from "@/lib/charcuterie/items";
import { THEMES, applyTheme } from "@/lib/charcuterie/themes";
import { Card } from "@/components/charcuterie/ui";
import { SaveBoardBar } from "./SaveBoardBar";
import type { Board, BoardFills, Pattern, Role } from "@/lib/charcuterie/types";

const STORAGE_KEY = "dispatch.charcuterie.draft.v1";

/** Everything worth keeping between visits. Transient UI state (hover, which
 *  zone is open) deliberately isn't in here. */
export interface Draft {
  boardId: string;
  patternId: string;
  fills: BoardFills;
  pantryIds: string[];
  guests: number;
  garnish: boolean;
}

const DEFAULT_DRAFT: Draft = {
  boardId: BOARDS[0].id,
  patternId: BOARDS[0].patterns[0].id,
  fills: {},
  pantryIds: [],
  guests: 8,
  garnish: false,
};

/** Read the saved draft. Only ever called on the client, from a lazy state
 *  initialiser, so there's no hydration mismatch to manage. */
function loadDraft(): Draft {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const d = JSON.parse(raw) as Partial<Draft>;
    const board = d.boardId ? getBoard(d.boardId) : undefined;
    return {
      boardId: board?.id ?? DEFAULT_DRAFT.boardId,
      patternId: board
        ? getPattern(board, d.patternId ?? "").id
        : DEFAULT_DRAFT.patternId,
      fills: d.fills ?? DEFAULT_DRAFT.fills,
      pantryIds: d.pantryIds ?? DEFAULT_DRAFT.pantryIds,
      guests: typeof d.guests === "number" ? d.guests : DEFAULT_DRAFT.guests,
      garnish: typeof d.garnish === "boolean" ? d.garnish : DEFAULT_DRAFT.garnish,
    };
  } catch {
    // A corrupt draft shouldn't stop you making a board.
    return DEFAULT_DRAFT;
  }
}

/** Legible stand-in colours for the thumbnails, where real fills would be noise. */
const ROLE_TINT: Record<Role, string> = {
  cheese: "#efd08a",
  meat: "#cf7371",
  fruit: "#d9425c",
  dried: "#c8712c",
  cracker: "#e0d0aa",
  spread: "#f0b43c",
  nut: "#b08a5e",
  briny: "#8fa63c",
  sweet: "#5e3f30",
  garnish: "#5e7d4c",
  veg: "#8fbf5e",
  flex: "#8892a0",
};

const SURFACE_TINT: Record<Board["surface"], string> = {
  walnut: "#6d4a2e",
  olivewood: "#a8814c",
  slate: "#31363d",
  marble: "#e9e6de",
  linen: "#ded6c4",
};

function Thumb({ board, pattern }: { board: Board; pattern: Pattern }) {
  const [vw, vh] = board.viewBox;
  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} className="h-full w-full" aria-hidden="true">
      <path d={board.outline} fill={SURFACE_TINT[board.surface]} />
      {pattern.zones.map((z) => (
        <path key={z.id} d={z.d} fill={ROLE_TINT[z.role]} opacity={0.88} />
      ))}
    </svg>
  );
}

const emptySubscribe = () => () => {};

/** Gate the studio on hydration so the saved draft can be read straight into
 *  the initial state below, rather than pushed in from an effect. */
export function BoardStudio({
  month,
  initial = null,
  editingId = null,
  pantry = [],
}: {
  month: number;
  /** A saved board loaded on the server via ?board=… */
  initial?: Draft | null;
  editingId?: string | null;
  /** The pantry as stored in the database — authoritative over localStorage. */
  pantry?: string[];
}) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  if (!hydrated) {
    return (
      <Card className="grid h-96 place-items-center">
        <p className="text-sm text-[#9a9a9a]">Setting the board…</p>
      </Card>
    );
  }
  return (
    <Studio month={month} initial={initial} editingId={editingId} pantry={pantry} />
  );
}

function Studio({
  month,
  initial,
  editingId,
  pantry,
}: {
  month: number;
  initial: Draft | null;
  editingId: string | null;
  pantry: string[];
}) {
  // A board opened from the saved list wins over whatever was in localStorage,
  // and the stored pantry wins over both — it lives in the database now.
  const [draft, setDraft] = useState<Draft>(() => ({
    ...(initial ?? loadDraft()),
    pantryIds: pantry,
  }));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rail, setRail] = useState<"pantry" | "fill">("pantry");

  const { boardId, patternId, fills, pantryIds, guests, garnish } = draft;
  const board = getBoard(boardId) ?? BOARDS[0];
  const pattern = getPattern(board, patternId);

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Private mode, quota, whatever — not worth interrupting anyone over.
    }
  }, [draft]);

  const skipFirstPantrySync = useRef(true);
  useEffect(() => {
    if (skipFirstPantrySync.current) {
      skipFirstPantrySync.current = false;
      return;
    }
    const t = setTimeout(() => {
      void fetch("/api/charcuterie/pantry", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pantry: pantryIds }),
      }).catch(() => {
        // A failed pantry sync shouldn't interrupt anyone mid-board.
      });
    }, 500);
    return () => clearTimeout(t);
  }, [pantryIds]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cheap derivations over at most a couple of dozen items. React Compiler
  // memoizes these; hand-written useMemo here only gets in its way.
  const placed = placedItems(pattern, fills);
  const items = placed.map((p) => p.item);
  const axes = balance(items);
  const critiques = boardDoctor(pattern, fills, month);
  const palette = paletteOf(items);
  const name = boardName(pattern, fills);
  const boardColors = items.map((i) => i.palette[0]);
  const seasonal = seasonalPicks(month).slice(0, 4);

  const selectedZone = pattern.zones.find((z) => z.id === selectedId) ?? null;
  const filledCount = placed.length;

  function chooseBoard(next: Board) {
    // Zone ids are pattern-specific, so a carried-over fill map would be junk.
    update({ boardId: next.id, patternId: next.patterns[0].id, fills: {} });
    setSelectedId(null);
    setHoveredId(null);
  }

  function choosePattern(next: Pattern) {
    update({ patternId: next.id, fills: {} });
    setSelectedId(null);
    setHoveredId(null);
  }

  return (
    <div className="space-y-5">
      {/* Board style rail */}
      <section>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
            Board style
          </h2>
          <span className="text-[11px] text-[#9a9a9a]">{board.blurb}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {BOARDS.map((b) => {
            const active = b.id === board.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => chooseBoard(b)}
                className={`group rounded-xl border p-2 text-left transition-colors ${
                  active
                    ? "border-text bg-[#f4f4f4]"
                    : "border-border bg-surface hover:border-[#d8d8d8]"
                }`}
              >
                <div className="grid h-12 place-items-center">
                  <Thumb board={b} pattern={b.patterns[0]} />
                </div>
                <p
                  className={`mt-1.5 truncate text-[11px] font-medium ${
                    active ? "text-text" : "text-text-secondary group-hover:text-text"
                  }`}
                >
                  {b.name}
                </p>
                <p className="truncate text-[10px] text-[#9a9a9a]">{b.seats}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Arrangement rail */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
          Arrangement
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {board.patterns.map((p) => {
            const active = p.id === pattern.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => choosePattern(p)}
                className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                  active
                    ? "border-text bg-[#f4f4f4]"
                    : "border-border bg-surface hover:border-[#d8d8d8]"
                }`}
              >
                <div className="h-11 w-14 shrink-0">
                  <Thumb board={board} pattern={p} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-xs font-medium ${
                      active ? "text-text" : "text-text"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] leading-snug text-[#9a9a9a]">
                    {p.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Studio */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-3">
          <Card className="overflow-hidden p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-[11px] text-[#9a9a9a]">
                  {board.name} · {pattern.name} · {filledCount}/{pattern.zones.length}{" "}
                  sections filled
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => update({ garnish: !garnish })}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition-colors ${
                    garnish
                      ? "bg-[#ececec] text-text"
                      : "bg-[#f6f6f4] text-text-secondary hover:text-text"
                  }`}
                >
                  {garnish ? "✓ " : ""}Garnish the gaps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    update({ fills: {} });
                    setSelectedId(null);
                  }}
                  disabled={filledCount === 0}
                  className="rounded-lg bg-[#f6f6f4] px-2.5 py-1 text-[11px] text-text-secondary hover:text-text disabled:cursor-not-allowed disabled:text-[#c4c4c4]"
                >
                  Clear board
                </button>
              </div>
            </div>

            <BoardCanvas
              board={board}
              pattern={pattern}
              fills={fills}
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={setHoveredId}
              onSelect={(id) => {
                setSelectedId(id);
                setRail("fill");
              }}
              garnish={garnish}
            />

            <p className="mt-3 text-center text-[11px] text-[#9a9a9a]">
              Hover a section to see its shape and what belongs there. Click to fill it.
            </p>
          </Card>

          <SaveBoardBar
            boardId={board.id}
            patternId={pattern.id}
            mode="zones"
            guests={guests}
            garnish={garnish}
            fills={fills}
            itemCount={filledCount}
            suggestedName={name}
            editingId={editingId}
          />

          {/* Themes */}
          <Card className="p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
                Start from a theme
              </p>
              <span className="text-[10px] text-[#9a9a9a]">
                fills every section, then pull it apart
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {THEMES.map((t) => {
                const peak = t.season?.includes(month);
                return (
                  <button
                    key={t.id}
                    type="button"
                    title={t.blurb}
                    onClick={() => {
                      update({ fills: applyTheme(t, pattern, month) });
                      setSelectedId(null);
                    }}
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                      peak
                        ? "border-[#d9b9a4] bg-[#faf3ee] text-[#a0522d] hover:bg-[#f3e6dd]"
                        : "border-border bg-[#f6f6f4] text-text-secondary hover:border-[#c4c4c4] hover:text-text"
                    }`}
                  >
                    {t.name}
                    {peak && <span className="ml-1 text-[9px] uppercase">in season</span>}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <Card className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden">
            <div className="flex shrink-0 border-b border-border">
              {(["pantry", "fill"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRail(tab)}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    rail === tab
                      ? "border-b-2 border-text text-text"
                      : "text-[#9a9a9a] hover:text-text"
                  }`}
                >
                  {tab === "pantry" ? "What I have" : "Fill a section"}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {rail === "pantry" ? (
                <PantryBar
                  pantryIds={pantryIds}
                  month={month}
                  onAdd={(id) =>
                    update({
                      pantryIds: pantryIds.includes(id)
                        ? pantryIds
                        : [...pantryIds, id],
                    })
                  }
                  onRemove={(id) =>
                    update({ pantryIds: pantryIds.filter((p) => p !== id) })
                  }
                />
              ) : selectedZone ? (
                <ItemPicker
                  zone={selectedZone}
                  fills={fills}
                  pantryIds={pantryIds}
                  month={month}
                  boardColors={boardColors}
                  onPick={(itemId, cutIndex) =>
                    update({
                      fills: { ...fills, [selectedZone.id]: { itemId, cutIndex } },
                    })
                  }
                  onClear={() => {
                    const next = { ...fills };
                    delete next[selectedZone.id];
                    update({ fills: next });
                  }}
                  onClose={() => setSelectedId(null)}
                />
              ) : (
                <div className="p-4">
                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    Click any section of the board to fill it. Suggestions are ranked
                    against whatever you&apos;ve told the pantry you already have.
                  </p>
                  {seasonal.length > 0 && (
                    <p className="mt-3 text-[11px] leading-relaxed text-[#9a9a9a]">
                      It&apos;s {MONTHS[month - 1]} —{" "}
                      <span className="text-[#a0522d]">
                        {seasonal.map((i) => i.name.toLowerCase()).join(", ")}
                      </span>{" "}
                      are at their peak right now.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <BalanceMeter axes={axes} palette={palette} />
        </Card>
        <Card>
          <BoardDoctor critiques={critiques} />
        </Card>
        <Card className="md:col-span-2 xl:col-span-1">
          <BoardSummary
            name={name}
            boardLabel={board.name}
            patternName={pattern.name}
            seats={board.seats}
            pattern={pattern}
            fills={fills}
            guests={guests}
            onGuests={(n) => update({ guests: n })}
          />
        </Card>
      </div>
    </div>
  );
}
