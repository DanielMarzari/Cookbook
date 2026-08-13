"use client";

import { useMemo, useState } from "react";
import { CAT_LABEL, getItem, isInSeason, itemsForRole } from "@/lib/charcuterie/items";
import { itemsFromIds, suggest } from "@/lib/charcuterie/pairings";
import type { BoardFills, Cat, Item, Suggestion, Zone } from "@/lib/charcuterie/types";

function MatchBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5" title={`${value}% match`}>
      <div className="h-1 w-12 overflow-hidden rounded-full bg-[#f6f6f4]">
        <div
          className="h-full rounded-full bg-text"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-[#9a9a9a]">{value}</span>
    </div>
  );
}

function CutList({
  item,
  selected,
  onSelect,
}: {
  item: Item;
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-2 space-y-1.5">
      {item.cuts.map((cut, i) => {
        const active = i === selected;
        return (
          <button
            key={cut.name}
            type="button"
            onClick={() => onSelect(i)}
            className={`w-full rounded-lg border p-2.5 text-left transition-colors ${
              active
                ? "border-text bg-[#f4f4f4]"
                : "border-border bg-[#f6f6f4] hover:border-[#d8d8d8]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs font-medium ${active ? "text-text" : "text-text"}`}
              >
                {cut.name}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-[#9a9a9a]">
                {"●".repeat(cut.effort ?? 1)}
                <span className="opacity-30">{"●".repeat(3 - (cut.effort ?? 1))}</span>
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">{cut.how}</p>
            {cut.flair && (
              <p className="mt-1 text-[11px] leading-relaxed text-[#a0522d]">
                ✦ {cut.flair}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SuggestionRow({
  s,
  onPick,
}: {
  s: Suggestion;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="w-full rounded-lg border border-border bg-[#f6f6f4] p-2.5 text-left transition-colors hover:border-[#c4c4c4]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className="size-2.5 shrink-0 rounded-full ring-1 ring-white/20"
            style={{ background: s.item.palette[0] }}
          />
          <span className="truncate text-xs font-medium">{s.item.name}</span>
          {s.inSeason && (
            <span className="shrink-0 rounded bg-[#f6ece5] px-1 text-[9px] font-semibold uppercase tracking-wide text-[#a0522d]">
              peak
            </span>
          )}
        </span>
        {s.ranked ? (
          <MatchBar value={s.match} />
        ) : (
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#9a9a9a]">
            staple
          </span>
        )}
      </div>
      <p className="mt-1 text-[11px] leading-snug text-[#9a9a9a]">{s.item.note}</p>
      {s.why.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {s.why.map((w) => (
            <li key={w} className="text-[11px] leading-snug text-text-secondary">
              → {w}
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}

export function ItemPicker({
  zone,
  fills,
  pantryIds,
  month,
  boardColors,
  onPick,
  onClear,
  onClose,
}: {
  zone: Zone;
  fills: BoardFills;
  pantryIds: string[];
  month: number;
  boardColors: string[];
  onPick: (itemId: string, cutIndex: number) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<Cat | "all">("all");

  const current = fills[zone.id];
  const currentItem = current ? getItem(current.itemId) : undefined;

  const placed = useMemo(
    () => Object.values(fills).map((f) => f.itemId),
    [fills],
  );

  const anchors = useMemo(() => {
    // Everything you already have: the pantry plus what's already on the board.
    const ids = [...new Set([...pantryIds, ...placed])];
    return itemsFromIds(ids).filter((i) => i.id !== current?.itemId);
  }, [pantryIds, placed, current]);

  const suggestions = useMemo(
    () =>
      suggest({
        role: zone.role,
        anchors,
        month,
        placed,
        boardColors,
        limit: zone.role === "flex" ? 12 : 8,
      }),
    [zone.role, anchors, month, placed, boardColors],
  );

  const browseable = useMemo(() => {
    let pool = itemsForRole(zone.role);
    if (zone.role === "flex" && catFilter !== "all") {
      pool = pool.filter((i) => i.cat === catFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      pool = pool.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.note.toLowerCase().includes(q) ||
          i.tags.some((t) => t.includes(q)),
      );
    }
    return pool;
  }, [zone.role, catFilter, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-text">
            {zone.label}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">{zone.hint}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-[#9a9a9a] hover:bg-[#f6f6f4] hover:text-text"
          aria-label="Close picker"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {currentItem && current && (
          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
                On the board
              </p>
              <button
                type="button"
                onClick={onClear}
                className="rounded-md px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <div className="mt-2 rounded-lg border border-[#c4c4c4] bg-[#fafafa] p-3">
              <div className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full ring-1 ring-white/20"
                  style={{ background: currentItem.palette[0] }}
                />
                <span className="text-sm font-medium">{currentItem.name}</span>
                {isInSeason(currentItem, month) && (
                  <span className="rounded bg-[#f6ece5] px-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#a0522d]">
                    in season
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">{currentItem.note}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#9a9a9a]">
                How to cut it
              </p>
              <CutList
                item={currentItem}
                selected={current.cutIndex}
                onSelect={(i) => onPick(currentItem.id, i)}
              />
            </div>
          </section>
        )}

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
            {anchors.length === 0
              ? "Board staples"
              : currentItem
                ? "Swap for"
                : "Suggested"}
            <span className="ml-1.5 font-normal normal-case tracking-normal text-[#b0b0b0]">
              {anchors.length > 0
                ? "· ranked against what you have"
                : "· add something to the pantry to rank these"}
            </span>
          </p>
          <div className="mt-2 space-y-1.5">
            {suggestions.map((s) => (
              <SuggestionRow
                key={s.item.id}
                s={s}
                onPick={() => onPick(s.item.id, 0)}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
            Browse everything
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, flavour or texture…"
            className="mt-2 w-full rounded-lg border border-border bg-[#f6f6f4] px-2.5 py-1.5 text-xs text-text placeholder:text-[#9a9a9a] focus:border-text focus:outline-none"
          />
          {zone.role === "flex" && (
            <div className="mt-2 flex flex-wrap gap-1">
              {(["all", ...Object.keys(CAT_LABEL)] as (Cat | "all")[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCatFilter(c)}
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    catFilter === c
                      ? "bg-[#ececec] text-text"
                      : "bg-[#f6f6f4] text-[#9a9a9a] hover:text-text"
                  }`}
                >
                  {c === "all" ? "All" : CAT_LABEL[c as Cat]}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {browseable.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onPick(item.id, 0)}
                title={item.note}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-[#f6f6f4] py-0.5 pl-1 pr-2 text-[11px] text-text-secondary transition-colors hover:border-[#c4c4c4] hover:text-text"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ background: item.palette[0] }}
                />
                {item.name}
              </button>
            ))}
            {browseable.length === 0 && (
              <p className="text-[11px] text-[#9a9a9a]">
                Nothing matches “{query}”. Try a flavour word like “briny” or “nutty”.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
