"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CAT_LABEL, ITEMS, getItem, isInSeason, itemsByCat } from "@/lib/charcuterie/items";
import { itemsFromIds, pairScore, suggest } from "@/lib/charcuterie/pairings";
import { THEMES, applyTheme } from "@/lib/charcuterie/themes";
import { BOARDS } from "@/lib/charcuterie/boards";
import { balance, boardDoctor } from "@/lib/charcuterie/advice";
import { Card } from "@/components/charcuterie/ui";
import type { Cat, Item } from "@/lib/charcuterie/types";

const ACCENT = "#111111";

/** A command the palette can run. */
interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

/** Cell colour for the pairing matrix: transparent at zero, accent at strong. */
function heat(score: number): string {
  const t = Math.max(0, Math.min(1, score / 26));
  return `rgba(108, 168, 224, ${(t * 0.92).toFixed(3)})`;
}

export function ConsoleBoard({ month }: { month: number }) {
  const [slots, setSlots] = useState<(string | null)[]>(Array(10).fill(null));
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [activeSlot, setActiveSlot] = useState(0);
  const [matrixCat, setMatrixCat] = useState<Cat>("cheese");
  const inputRef = useRef<HTMLInputElement>(null);

  const boardIds = slots.filter((s): s is string => !!s);
  const boardItems = itemsFromIds(boardIds);

  function setSlot(index: number, id: string | null) {
    setSlots((s) => s.map((v, i) => (i === index ? id : v)));
  }

  function addToFirstFree(id: string) {
    setSlots((s) => {
      const i = s.findIndex((v) => v === null);
      if (i === -1) return s;
      return s.map((v, j) => (j === i ? id : v));
    });
  }

  // --- the palette ---
  const q = query.trim().toLowerCase();
  const isCommand = q.startsWith(">");
  const commandQuery = isCommand ? q.slice(1).trim() : "";

  const commands: Command[] = [
    ...THEMES.map((t) => ({
      id: `theme:${t.id}`,
      label: `theme ${t.name}`,
      hint: t.blurb,
      run: () => {
        const pattern = BOARDS[0].patterns[0];
        const fills = applyTheme(t, pattern, month);
        const ids = Object.values(fills)
          .map((f) => f.itemId)
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 10);
        setSlots(Array.from({ length: 10 }, (_, i) => ids[i] ?? null));
      },
    })),
    {
      id: "clear",
      label: "clear board",
      hint: "empty every slot",
      run: () => setSlots(Array(10).fill(null)),
    },
    {
      id: "fill",
      label: "auto-fill empty slots",
      hint: "best match against what's already down",
      run: () =>
        setSlots((s) => {
          const next = [...s];
          for (let i = 0; i < next.length; i++) {
            if (next[i]) continue;
            const anchors = itemsFromIds(next.filter((v): v is string => !!v));
            const pick = suggest({
              role: "flex",
              anchors,
              month,
              placed: next.filter((v): v is string => !!v),
              limit: 1,
            })[0];
            if (pick) next[i] = pick.item.id;
          }
          return next;
        }),
    },
  ];

  const cmdResults = commands.filter((c) =>
    commandQuery ? c.label.toLowerCase().includes(commandQuery) : true,
  );
  const itemResults = q
    ? ITEMS.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tags.some((t) => t.includes(q)) ||
          CAT_LABEL[i.cat].toLowerCase().includes(q),
      ).slice(0, 40)
    : suggest({
        role: "flex",
        anchors: boardItems,
        month,
        placed: boardIds,
        limit: 12,
      }).map((s) => s.item);

  const resultCount = isCommand ? cmdResults.length : itemResults.length;

  function runAt(i: number) {
    if (isCommand) {
      cmdResults[i]?.run();
    } else {
      const item = itemResults[i];
      if (item) {
        if (slots[activeSlot] === null) setSlot(activeSlot, item.id);
        else addToFirstFree(item.id);
      }
    }
    setOpen(false);
    setQuery("");
    setCursor(0);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setCursor(0);
        return;
      }
      if (e.key === "Escape") return setOpen(false);
      if (!open) {
        if (typing) return;
        if (e.key === "/") {
          e.preventDefault();
          setOpen(true);
        }
        // Number keys jump between slots.
        const n = Number(e.key);
        if (!Number.isNaN(n) && e.key !== "") {
          setActiveSlot(n === 0 ? 9 : n - 1);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(resultCount - 1, c + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runAt(cursor);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // --- the matrix ---
  const cols = itemsByCat(matrixCat).slice(0, 26);
  const axes = balance(boardItems);
  const critiques = boardDoctor(BOARDS[0].patterns[0], {}, month);

  return (
    <div className="space-y-4 font-mono">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl font-sans text-sm text-text-secondary">
          Everything runs from the keyboard.{" "}
          <kbd className="rounded bg-[#f6f6f4] px-1.5 py-0.5 text-[11px]">⌘K</kbd>{" "}
          or <kbd className="rounded bg-[#f6f6f4] px-1.5 py-0.5 text-[11px]">/</kbd>{" "}
          opens the palette, <kbd className="rounded bg-[#f6f6f4] px-1.5 py-0.5 text-[11px]">1-0</kbd>{" "}
          picks a slot, <kbd className="rounded bg-[#f6f6f4] px-1.5 py-0.5 text-[11px]">&gt;</kbd>{" "}
          switches to commands.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border bg-[#f6f6f4] px-3 py-1.5 text-xs text-text-secondary hover:text-text"
        >
          ⌘K
        </button>
      </header>

      {/* Slots */}
      <Card className="p-3">
        <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
          board — {boardIds.length}/10 slots
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {slots.map((id, i) => {
            const item = id ? getItem(id) : undefined;
            const active = i === activeSlot;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveSlot(i);
                  if (item) setSlot(i, null);
                  else setOpen(true);
                }}
                className="rounded-lg border p-2 text-left transition-colors"
                style={{
                  borderColor: active ? ACCENT : "var(--color-border)",
                  background: active ? `${ACCENT}12` : undefined,
                }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#9a9a9a]">
                    {String(i + 1).slice(-1)}
                  </span>
                  {item ? (
                    <>
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: item.palette[0] }}
                      />
                      <span className="truncate text-[11px]">{item.name}</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-[#9a9a9a]">empty</span>
                  )}
                </span>
                {item && (
                  <span className="mt-0.5 block truncate text-[10px] text-[#9a9a9a]">
                    {CAT_LABEL[item.cat].toLowerCase()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Pairing matrix */}
        <Card className="overflow-hidden p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
              pairing matrix — board × {CAT_LABEL[matrixCat].toLowerCase()}
            </p>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(CAT_LABEL) as Cat[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setMatrixCat(c)}
                  className="rounded px-1.5 py-0.5 text-[10px] transition-colors"
                  style={{
                    background: matrixCat === c ? ACCENT : "var(--color-surface-2)",
                    color: matrixCat === c ? "#ffffff" : undefined,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {boardItems.length === 0 ? (
            <p className="py-10 text-center text-xs text-[#9a9a9a]">
              Fill a slot and the matrix scores every {CAT_LABEL[matrixCat].toLowerCase()} against it.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-surface p-1 text-left font-normal text-[#9a9a9a]">
                      on board ↓
                    </th>
                    {cols.map((c) => (
                      <th
                        key={c.id}
                        className="p-1 text-left font-normal text-[#9a9a9a]"
                        style={{ minWidth: 26 }}
                      >
                        <span
                          className="block h-16 origin-bottom-left translate-y-2 rotate-[300deg] whitespace-nowrap"
                          title={c.name}
                        >
                          {c.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {boardItems.map((row) => (
                    <tr key={row.id}>
                      <td className="sticky left-0 z-10 max-w-[9rem] truncate bg-surface p-1 text-text-secondary">
                        {row.name}
                      </td>
                      {cols.map((c) => {
                        const s = pairScore(row, c);
                        return (
                          <td
                            key={c.id}
                            title={`${row.name} × ${c.name} — ${s.score.toFixed(1)}${
                              s.why[0] ? `\n${s.why[0]}` : ""
                            }`}
                            className="cursor-pointer p-0"
                            onClick={() => addToFirstFree(c.id)}
                          >
                            <span
                              className="block h-5 w-full"
                              style={{ background: heat(s.score) }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[10px] text-[#9a9a9a]">
                Darker = stronger pairing. Hover a cell for the reason, click to add it.
              </p>
            </div>
          )}
        </Card>

        {/* Readouts */}
        <div className="space-y-4">
          <Card className="p-3">
            <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">balance</p>
            <ul className="mt-2 space-y-1.5">
              {axes.map((a) => (
                <li key={a.key} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[10px] text-text-secondary">
                    {a.label.toLowerCase()}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f6f6f4]">
                    <motion.div
                      className="h-full"
                      style={{ background: a.value < 0.3 ? "#a0522d" : ACCENT }}
                      animate={{ width: `${Math.round(a.value * 100)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[10px] text-[#9a9a9a]">
                    {Math.round(a.value * 100)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-3">
            <p className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">
              log
            </p>
            <ul className="mt-2 space-y-1">
              {boardItems.length === 0 ? (
                <li className="text-[10px] text-[#9a9a9a]">$ awaiting input…</li>
              ) : (
                boardItems.map((i) => (
                  <li key={i.id} className="truncate text-[10px] text-text-secondary">
                    <span style={{ color: ACCENT }}>+</span> {i.id}{" "}
                    <span className="text-[#9a9a9a]">
                      [{i.tags.slice(0, 3).join(",")}]
                    </span>
                    {isInSeason(i, month) && (
                      <span className="text-[#a0522d]"> ★peak</span>
                    )}
                  </li>
                ))
              )}
              {critiques.slice(0, 2).map((c) => (
                <li key={c.id} className="mt-1 text-[10px] leading-snug text-[#9a9a9a]">
                  <span className="text-[#a0522d]">!</span> {c.text}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Palette */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-white/80 p-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Search ingredients, or > for commands…"
                className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-text placeholder:text-[#9a9a9a] focus:outline-none"
              />
              <ul className="max-h-80 overflow-y-auto py-1">
                {isCommand
                  ? cmdResults.map((c, i) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setCursor(i)}
                          onClick={() => runAt(i)}
                          className="flex w-full items-baseline gap-2 px-4 py-1.5 text-left"
                          style={{ background: i === cursor ? `${ACCENT}1f` : undefined }}
                        >
                          <span className="text-xs" style={{ color: ACCENT }}>
                            &gt;
                          </span>
                          <span className="text-xs">{c.label}</span>
                          <span className="ml-auto truncate text-[10px] text-[#9a9a9a]">
                            {c.hint}
                          </span>
                        </button>
                      </li>
                    ))
                  : itemResults.map((item: Item, i) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setCursor(i)}
                          onClick={() => runAt(i)}
                          className="flex w-full items-center gap-2 px-4 py-1.5 text-left"
                          style={{ background: i === cursor ? `${ACCENT}1f` : undefined }}
                        >
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ background: item.palette[0] }}
                          />
                          <span className="text-xs">{item.name}</span>
                          <span className="text-[10px] text-[#9a9a9a]">
                            {CAT_LABEL[item.cat].toLowerCase()}
                          </span>
                          <span className="ml-auto truncate text-[10px] text-[#9a9a9a]">
                            {item.tags.slice(0, 3).join(" · ")}
                          </span>
                        </button>
                      </li>
                    ))}
                {resultCount === 0 && (
                  <li className="px-4 py-6 text-center text-xs text-[#9a9a9a]">
                    Nothing matches “{query}”.
                  </li>
                )}
              </ul>
              <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[10px] text-[#9a9a9a]">
                <span>↑↓ move</span>
                <span>⏎ {isCommand ? "run" : `add to slot ${activeSlot + 1}`}</span>
                <span>esc close</span>
                <span className="ml-auto">{resultCount} results</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
