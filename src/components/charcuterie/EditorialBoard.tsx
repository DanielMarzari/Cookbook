"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ZoneFill } from "./ZoneFill";
import { BOARDS, getBoard } from "@/lib/charcuterie/boards";
import { getItem, perGuestFor } from "@/lib/charcuterie/items";
import { THEMES, applyTheme } from "@/lib/charcuterie/themes";
import { MONTHS, buildOrder, placedItems, shoppingList } from "@/lib/charcuterie/advice";
import type { Cat, Zone } from "@/lib/charcuterie/types";

const INK = "#111111";
const PAPER = "#ffffff";
const RULE = "#e8e8e8";
const ACCENT = "#a0522d";

/** The order a board actually gets built in. Each stage is one scroll section,
 *  and its zones appear on the board as that section comes into view. */
const STAGES: { cats: Cat[]; title: string; kicker: string }[] = [
  { cats: ["spread"], title: "Bowls first", kicker: "Stage one" },
  { cats: ["cheese"], title: "Then the cheese", kicker: "Stage two" },
  { cats: ["meat"], title: "Meat, in folds", kicker: "Stage three" },
  { cats: ["cracker"], title: "Crackers against the cheese", kicker: "Stage four" },
  { cats: ["fruit", "briny", "veg"], title: "Fruit and pickles into the gaps", kicker: "Stage five" },
  { cats: ["nut", "dried", "sweet"], title: "Nuts and dried fruit as mortar", kicker: "Stage six" },
  { cats: ["garnish"], title: "Garnish, last of all", kicker: "Stage seven" },
];

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] py-12"
    >
      {children}
    </motion.section>
  );
}

export function EditorialBoard({ month }: { month: number }) {
  const [boardId, setBoardId] = useState("paddle");
  const [themeId, setThemeId] = useState("orchard");
  const [stage, setStage] = useState(0);
  const [guests, setGuests] = useState(8);

  // Stage is derived from how far through the article you've scrolled. Reading
  // it off scroll progress keeps the update in an event callback — pushing it
  // up from a child's render would have React updating a parent mid-render.
  const articleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.max(
      0,
      Math.min(STAGES.length - 1, Math.floor(v * (STAGES.length + 0.6))),
    );
    setStage((cur) => (cur === next ? cur : next));
  });

  const board = getBoard(boardId) ?? BOARDS[0];
  const pattern = board.patterns[0];
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const fills = applyTheme(theme, pattern, month);
  const placed = placedItems(pattern, fills);
  const [vw, vh] = board.viewBox;

  // Which zones are visible depends on how far down the article you've read.
  const visibleCats = new Set<Cat>();
  for (let i = 0; i <= stage && i < STAGES.length; i++) {
    for (const c of STAGES[i].cats) visibleCats.add(c);
  }
  const zoneVisible = (z: Zone) => {
    const fill = fills[z.id];
    const item = fill ? getItem(fill.itemId) : undefined;
    return !!item && visibleCats.has(item.cat);
  };

  const steps = buildOrder(pattern, fills);
  const groups = shoppingList(pattern, fills, guests);

  return (
    <div
      className="rounded-xl px-5 py-2 sm:px-10"
      style={{ background: PAPER, color: INK }}
    >
      {/* Masthead */}
      <header className="border-b py-10" style={{ borderColor: RULE }}>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: ACCENT }}
        >
          {MONTHS[month - 1]} · No. {String(stage + 1).padStart(2, "0")} of{" "}
          {STAGES.length}
        </p>
        <h2
          className="mt-3 text-4xl leading-[1.05] sm:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          How to build
          <br />
          <span style={{ color: ACCENT }}>{theme.name}</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "#3A3A3A" }}>
          {theme.blurb} Scroll, and the board assembles itself in the order
          you&apos;d actually build it — bowls down first, garnish last, gaps
          filled in between.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <label className="text-[11px] uppercase tracking-wider" style={{ color: "#767676" }}>
            Board
            <select
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              className="ml-2 rounded border bg-transparent px-2 py-1 text-xs normal-case tracking-normal"
              style={{ borderColor: RULE, color: INK }}
            >
              {BOARDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] uppercase tracking-wider" style={{ color: "#767676" }}>
            Menu
            <select
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
              className="ml-2 rounded border bg-transparent px-2 py-1 text-xs normal-case tracking-normal"
              style={{ borderColor: RULE, color: INK }}
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] uppercase tracking-wider" style={{ color: "#767676" }}>
            Guests
            <input
              type="number"
              min={2}
              max={30}
              value={guests}
              onChange={(e) => setGuests(Math.max(2, Math.min(30, Number(e.target.value))))}
              className="ml-2 w-16 rounded border bg-transparent px-2 py-1 text-xs"
              style={{ borderColor: RULE, color: INK }}
            />
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Sticky board */}
        <div className="lg:sticky lg:top-6 lg:h-[80vh] lg:self-start">
          <div className="flex h-full flex-col justify-center py-8">
            <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" aria-label="The board, assembling">
              <defs>
                <filter id="ed-grain" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.008 0.09" numOctaves={4} seed={5} />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <clipPath id="ed-clip">
                  <path d={board.outline} />
                </clipPath>
              </defs>
              <path d={board.outline} fill="#00000018" transform="translate(3 10)" />
              <g clipPath="url(#ed-clip)">
                <rect width={vw} height={vh} fill="#b8926a" />
                <rect
                  width={vw}
                  height={vh}
                  fill="#6b4f2a"
                  filter="url(#ed-grain)"
                  opacity={0.35}
                  style={{ mixBlendMode: "multiply" }}
                />
              </g>
              <path d={board.outline} fill="none" stroke="#8a6a48" strokeWidth={3} />

              {pattern.zones.map((z) => {
                const fill = fills[z.id];
                const item = fill ? getItem(fill.itemId) : undefined;
                if (!item) return null;
                const on = zoneVisible(z);
                return (
                  <motion.g
                    key={z.id}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.72 }}
                    transition={{ type: "spring", stiffness: 190, damping: 22 }}
                    style={{ transformOrigin: `${z.center[0]}px ${z.center[1]}px` }}
                  >
                    <ZoneFill
                      zone={z}
                      item={item}
                      cut={item.cuts[fill.cutIndex] ?? item.cuts[0]}
                      idPrefix="ed"
                    />
                  </motion.g>
                );
              })}
            </svg>

            <div className="mt-4 flex gap-1">
              {STAGES.map((s, i) => (
                <div
                  key={s.title}
                  className="h-0.5 flex-1 rounded-full transition-colors duration-500"
                  style={{ background: i <= stage ? ACCENT : RULE }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The article */}
        <div ref={articleRef}>
          {STAGES.map((s) => {
            const mine = placed.filter((p) => s.cats.includes(p.item.cat));
            const step = steps.find((st) => st.title === s.title);
            return (
              <Stage key={s.title}>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: ACCENT }}
                >
                  {s.kicker}
                </p>
                <h3
                  className="mt-2 text-2xl sm:text-3xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {s.title}
                </h3>

                {mine.length === 0 ? (
                  <p className="mt-4 text-sm italic" style={{ color: "#767676" }}>
                    Nothing in this stage for {theme.name} — skip straight on.
                  </p>
                ) : (
                  <>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: "#3A3A3A" }}>
                      {step?.detail.split(". ").slice(1).join(". ")}
                    </p>
                    <ul className="mt-6 space-y-5">
                      {mine.map((p) => {
                        const cut = p.item.cuts[p.cutIndex] ?? p.item.cuts[0];
                        const per = perGuestFor(p.item);
                        return (
                          <li key={p.zoneId} className="border-t pt-4" style={{ borderColor: RULE }}>
                            <div className="flex items-baseline justify-between gap-3">
                              <h4 className="text-base font-semibold">{p.item.name}</h4>
                              <span className="shrink-0 font-mono text-[11px]" style={{ color: "#767676" }}>
                                {Math.round(per.amount * guests * 10) / 10} {per.unit}
                              </span>
                            </div>
                            <p className="mt-1 text-sm italic" style={{ color: "#767676" }}>
                              {p.item.note}
                            </p>
                            {cut && (
                              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#3A3A3A" }}>
                                <span className="font-semibold" style={{ color: ACCENT }}>
                                  {cut.name}.
                                </span>{" "}
                                {cut.how}
                              </p>
                            )}
                            {cut?.flair && (
                              <p
                                className="mt-2 border-l-2 pl-3 text-sm leading-relaxed"
                                style={{ borderColor: ACCENT, color: "#3A3A3A" }}
                              >
                                {cut.flair}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </Stage>
            );
          })}

          {/* Shopping list, as the back page */}
          <section className="border-t py-12" style={{ borderColor: RULE }}>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: ACCENT }}
            >
              Take this to the shop
            </p>
            <h3
              className="mt-2 text-2xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              For {guests} guests
            </h3>
            <div className="mt-6 columns-1 gap-8 sm:columns-2">
              {groups.map((g) => (
                <div key={g.cat} className="mb-5 break-inside-avoid">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "#767676" }}
                  >
                    {g.label}
                  </p>
                  <ul className="mt-1.5">
                    {g.lines.map((l) => (
                      <li
                        key={l.item.id}
                        className="flex items-baseline justify-between gap-2 border-b py-1 text-sm"
                        style={{ borderColor: RULE }}
                      >
                        <span>{l.item.name}</span>
                        <span className="font-mono text-[11px]" style={{ color: "#767676" }}>
                          {l.qty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
