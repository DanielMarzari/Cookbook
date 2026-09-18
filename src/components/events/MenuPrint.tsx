'use client';

import { useState } from 'react';
import Link from 'next/link';
import MenuCard from './MenuCard';
import { MENU_STYLES, MENU_STOCKS } from '@/lib/events/styles';
import type { EventCourse } from '@/lib/events/types';
import { formatDateLong } from '@/lib/events/format';

/**
 * Pick a look, then print it.
 *
 * Style and paper are independent axes over one card, so the twelve and the six
 * are seventy-two cards nobody had to author. Browsing them is the point of the
 * page — the vibe of the night is not something you decide once in a settings
 * screen, so the swatches are the interface rather than a dropdown.
 */
export default function MenuPrint({
  eventId,
  title,
  date,
  courses,
  initialStyle,
  initialStock,
}: {
  eventId: string;
  title: string;
  date: string;
  courses: EventCourse[];
  initialStyle: string;
  initialStock: string;
}) {
  const [styleId, setStyleId] = useState(initialStyle);
  const [stockId, setStockId] = useState(initialStock);
  const [copies, setCopies] = useState(1);
  const [saved, setSaved] = useState(false);

  async function keep() {
    await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style: styleId, stock: stockId }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const dateline = formatDateLong(date);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <div className="no-print">
        <div className="pt-10 md:pt-14 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <Link href={`/events/${eventId}`} className="text-[12px] uppercase tracking-[0.12em] text-text-secondary hover:text-text">
              ← {title}
            </Link>
            <h1 className="text-[30px] md:text-[42px] leading-[1.05] tracking-[-0.02em] font-normal mt-3 mb-0">
              The menu
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-[12.5px] text-text-secondary">Kept for this dinner.</span>}
            <button onClick={keep}
                    className="text-[13px] border border-border px-4 py-2 hover:border-text transition-colors">
              Keep this look
            </button>
            <button onClick={() => window.print()}
                    className="bg-text text-background text-[13px] px-5 py-2 hover:opacity-85 transition-opacity">
              Print
            </button>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="text-[14px] text-text-secondary mt-10">
            No courses yet. <Link href={`/events/${eventId}`} className="tlink">Add some</Link> and they print here.
          </p>
        ) : (
          <>
            {/* the swatches */}
            <section className="mt-10">
              <h2 className="text-[11px] uppercase tracking-[0.13em] text-text-secondary border-b border-text pb-2 m-0">
                Style
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5 mt-5">
                {MENU_STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyleId(s.id)}
                    aria-pressed={styleId === s.id}
                    className="text-left group"
                  >
                    {/* A real card, scaled down and clipped — a swatch of the
                        actual thing rather than a picture of the typeface. */}
                    <div
                      className={`border overflow-hidden transition-colors ${
                        styleId === s.id ? 'border-text' : 'border-border group-hover:border-text'
                      }`}
                      style={{ height: 178 }}
                    >
                      <div
                        className="pointer-events-none"
                        style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '181.8%' }}
                      >
                        <MenuCard
                          courses={courses.slice(0, 2)}
                          title={title}
                          styleId={s.id}
                          stockId={stockId}
                          showKey={false}
                        />
                      </div>
                    </div>
                    <div className="text-[11px] mt-2">
                      <span className={styleId === s.id ? 'text-text' : 'text-text-secondary'}>{s.name}</span>
                      <span className="text-text-secondary"> · {s.note}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-[11px] uppercase tracking-[0.13em] text-text-secondary border-b border-text pb-2 m-0">
                Paper
              </h2>
              <div className="flex flex-wrap gap-3 mt-4">
                {MENU_STOCKS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStockId(s.id)}
                    aria-pressed={stockId === s.id}
                    className={`flex items-center gap-2.5 border px-3 py-2 transition-colors ${
                      stockId === s.id ? 'border-text' : 'border-border hover:border-text'
                    }`}
                  >
                    <span
                      className="w-5 h-5 border"
                      style={{
                        background: s.paper,
                        borderColor: s.edge,
                        backgroundImage: s.id === 'laid'
                          ? 'repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 4px)'
                          : undefined,
                      }}
                    />
                    <span className="text-[12px]">{s.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-[12.5px] text-text-secondary mt-4 max-w-[62ch]">
                One card per sheet at A5, which reads at a place setting and trims out of A4 with a
                single cut. Anything heavier than about 250gsm wants plain or cream — laid is printed
                texture, and on paper that already has tooth the two fight.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-[11px] uppercase tracking-[0.13em] text-text-secondary border-b border-text pb-2 m-0">
                How many
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setCopies((n) => Math.max(1, n - 1))}
                          className="w-8 h-8 border border-border hover:border-text transition-colors">−</button>
                  <span className="text-[15px] tabular-nums w-6 text-center">{copies}</span>
                  <button onClick={() => setCopies((n) => Math.min(24, n + 1))}
                          className="w-8 h-8 border border-border hover:border-text transition-colors">+</button>
                </div>
                <span className="text-[12.5px] text-text-secondary">
                  {copies === 1 ? 'one card' : `${copies} cards, one per sheet`}
                </span>
              </div>
            </section>
          </>
        )}
      </div>

      {/* what actually prints */}
      {courses.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-8">
          {Array.from({ length: copies }).map((_, i) => (
            <div key={i} className="print-sheet w-full max-w-[420px]">
              <MenuCard
                courses={courses}
                title={title}
                dateline={dateline}
                styleId={styleId}
                stockId={stockId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
