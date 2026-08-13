"use client";

import { useMemo, useState } from "react";
import { buildOrder, shoppingList, toMarkdown } from "@/lib/charcuterie/advice";
import type { BoardFills, Pattern } from "@/lib/charcuterie/types";

export function BoardSummary({
  name,
  boardLabel,
  patternName,
  seats,
  pattern,
  fills,
  guests,
  onGuests,
}: {
  name: string;
  boardLabel: string;
  patternName: string;
  seats: string;
  pattern: Pattern;
  fills: BoardFills;
  guests: number;
  onGuests: (n: number) => void;
}) {
  const [copied, setCopied] = useState(false);

  const groups = useMemo(
    () => shoppingList(pattern, fills, guests),
    [pattern, fills, guests],
  );
  const steps = useMemo(() => buildOrder(pattern, fills), [pattern, fills]);

  async function copy() {
    const md = toMarkdown(name, boardLabel, patternName, pattern, fills, guests);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const empty = groups.length === 0;

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
          The plan
        </p>
        <button
          type="button"
          onClick={copy}
          disabled={empty}
          className="rounded-md px-2 py-0.5 text-[11px] text-text hover:bg-[#f4f4f4] disabled:cursor-not-allowed disabled:text-[#9a9a9a] disabled:hover:bg-transparent"
        >
          {copied ? "Copied ✓" : "Copy as markdown"}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label htmlFor="guests" className="text-[11px] text-text-secondary">
          Guests
        </label>
        <input
          id="guests"
          type="range"
          min={2}
          max={24}
          value={guests}
          onChange={(e) => onGuests(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#f6f6f4] accent-accent"
        />
        <span className="w-14 text-right font-mono text-xs text-text">{guests}</span>
      </div>
      <p className="mt-1 text-[10px] text-[#9a9a9a]">
        This board comfortably seats {seats}.
      </p>

      {empty ? (
        <p className="mt-4 text-[11px] leading-relaxed text-[#9a9a9a]">
          Fill a few sections and the shopping list and assembly order will write
          themselves.
        </p>
      ) : (
        <>
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9a9a]">
              Shopping list
            </p>
            <div className="mt-2 space-y-2.5">
              {groups.map((group) => (
                <div key={group.cat}>
                  <p className="text-[10px] uppercase tracking-wider text-text/70">
                    {group.label}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {group.lines.map((line) => (
                      <li
                        key={line.item.id}
                        className="flex items-baseline justify-between gap-2 text-[11px]"
                      >
                        <span className="truncate text-text-secondary">{line.item.name}</span>
                        <span className="shrink-0 font-mono text-[#9a9a9a]">{line.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9a9a]">
              Assemble in this order
            </p>
            <ol className="mt-2 space-y-2">
              {steps.map((step) => (
                <li key={step.n} className="flex gap-2.5">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#f6f6f4] font-mono text-[9px] text-text">
                    {step.n}
                  </span>
                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    <span className="font-medium text-text">{step.title}.</span>{" "}
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
