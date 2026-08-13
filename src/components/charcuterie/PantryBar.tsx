"use client";

import { useMemo, useState } from "react";
import { CAT_LABEL, ITEMS, isInSeason, seasonalPicks } from "@/lib/charcuterie/items";
import { itemsFromIds, partnersFor } from "@/lib/charcuterie/pairings";
import { MONTHS } from "@/lib/charcuterie/advice";
import type { Cat, Item } from "@/lib/charcuterie/types";

/** The categories worth asking "what goes with this?" about. */
const PARTNER_CATS: Cat[] = [
  "cheese",
  "meat",
  "fruit",
  "cracker",
  "spread",
  "nut",
  "briny",
  "dried",
  "veg",
];

/** "I have peaches" → six cheeses that work, why, and how to cut them. */
function PairingExplorer({ anchor, month }: { anchor: Item; month: number }) {
  const [cat, setCat] = useState<Cat>(
    anchor.cat === "cheese" ? "fruit" : "cheese",
  );
  const partners = useMemo(
    () => partnersFor(anchor, { month, cat, limit: 6 }),
    [anchor, month, cat],
  );

  return (
    <div className="mt-2 rounded-lg border border-border bg-[#f6f6f4] p-2.5">
      <div className="flex flex-wrap gap-1">
        {PARTNER_CATS.filter((c) => c !== anchor.cat).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
              cat === c
                ? "bg-[#ececec] text-text"
                : "bg-surface text-[#9a9a9a] hover:text-text"
            }`}
          >
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      <ul className="mt-2 space-y-2">
        {partners.map((p) => {
          const cut = p.item.cuts[0];
          return (
            <li key={p.item.id} className="border-t border-border/60 pt-2 first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full ring-1 ring-white/20"
                    style={{ background: p.item.palette[0] }}
                  />
                  <span className="truncate text-xs font-medium">{p.item.name}</span>
                  {p.inSeason && (
                    <span className="shrink-0 rounded bg-[#f6ece5] px-1 text-[9px] font-semibold uppercase tracking-wide text-[#a0522d]">
                      peak
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-[#9a9a9a]">{p.match}</span>
              </div>
              {p.why[0] && (
                <p className="mt-0.5 text-[11px] leading-snug text-text-secondary">→ {p.why[0]}</p>
              )}
              {cut && (
                <p className="mt-0.5 text-[11px] leading-snug text-text-secondary">
                  <span className="text-[#9a9a9a]">Cut it: </span>
                  <span className="text-text/90">{cut.name}</span> — {cut.how}
                </p>
              )}
            </li>
          );
        })}
        {partners.length === 0 && (
          <li className="text-[11px] text-[#9a9a9a]">
            No strong matches in that category — try another.
          </li>
        )}
      </ul>
    </div>
  );
}

export function PantryBar({
  pantryIds,
  month,
  onAdd,
  onRemove,
}: {
  pantryIds: string[];
  month: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const pantry = useMemo(() => itemsFromIds(pantryIds), [pantryIds]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ITEMS.filter(
      (i) => !pantryIds.includes(i.id) && i.name.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query, pantryIds]);

  const seasonal = useMemo(
    () => seasonalPicks(month).filter((i) => !pantryIds.includes(i.id)).slice(0, 8),
    [month, pantryIds],
  );

  return (
    <div className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-text">
        What have you got?
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
        Tell it what&apos;s in the fridge or what looked good at the market. Everything
        the board suggests gets ranked against it.
      </p>

      <div className="relative mt-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Peaches, prosciutto, that blue cheese…"
          className="w-full rounded-lg border border-border bg-[#f6f6f4] px-2.5 py-1.5 text-xs text-text placeholder:text-[#9a9a9a] focus:border-text focus:outline-none"
        />
        {results.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-surface shadow-xl">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(item.id);
                    setOpenId(item.id);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs hover:bg-[#f6f6f4]"
                >
                  <span
                    className="size-2.5 rounded-full ring-1 ring-white/20"
                    style={{ background: item.palette[0] }}
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="text-[10px] text-[#9a9a9a]">{CAT_LABEL[item.cat]}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {seasonal.length > 0 && pantry.length === 0 && (
        <div className="mt-3">
          <p className="text-[11px] text-[#9a9a9a]">
            At peak in {MONTHS[month - 1]} — tap to add:
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {seasonal.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onAdd(item.id);
                  setOpenId(item.id);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-[#e3cabb] bg-[#faf3ee] py-0.5 pl-1 pr-2 text-[11px] text-[#a0522d] transition-colors hover:bg-[#f3e6dd]"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ background: item.palette[0] }}
                />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {pantry.length > 0 && (
        <ul className="mt-3 space-y-2">
          {pantry.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id}>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-border bg-[#f6f6f4] px-2 py-1.5 text-left transition-colors hover:border-[#c4c4c4]"
                    aria-expanded={open}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full ring-1 ring-white/20"
                      style={{ background: item.palette[0] }}
                    />
                    <span className="truncate text-xs font-medium">{item.name}</span>
                    {isInSeason(item, month) && (
                      <span className="shrink-0 rounded bg-[#f6ece5] px-1 text-[9px] font-semibold uppercase tracking-wide text-[#a0522d]">
                        peak
                      </span>
                    )}
                    <span className="ml-auto shrink-0 text-[10px] text-[#9a9a9a]">
                      {open ? "hide" : "what goes with it"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="shrink-0 rounded-md px-1.5 py-1 text-xs text-[#9a9a9a] hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
                {open && <PairingExplorer anchor={item} month={month} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
