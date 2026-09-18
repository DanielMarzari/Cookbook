'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuCard from './MenuCard';
import { MENU_STYLES, MENU_STOCKS } from '@/lib/events/styles';
import {
  DIET_CHIPS, DIET_TAGS, coverage, coverageSummary, toCourses,
} from '@/lib/events/types';
import type { DietTag, DinnerEvent, EventDish, EventGuest } from '@/lib/events/types';
import { formatDateLong } from '@/lib/events/format';

type DraftDish = {
  key: string;
  course_index: number;
  course_name: string;
  title: string;
  subtitle: string;
  contains: DietTag[];
  is_choice: boolean;
};

let seq = 0;
const newKey = () => `d${Date.now()}-${seq++}`;

function toDraft(dishes: EventDish[]): DraftDish[] {
  return dishes.map((d) => ({
    key: d.id,
    course_index: d.course_index,
    course_name: d.course_name ?? '',
    title: d.title,
    subtitle: d.subtitle ?? '',
    contains: d.contains,
    is_choice: d.is_choice,
  }));
}

/**
 * The host's side: the details, the menu, the link, and the check.
 *
 * The coverage panel is the reason the rest of it exists — everything above it
 * is data entry, and the panel is the only thing here that can tell you
 * something you didn't already know.
 */
export default function EventEditor({
  event: initial,
  dishes: initialDishes,
  guests,
  recipes,
}: {
  event: DinnerEvent;
  dishes: EventDish[];
  guests: EventGuest[];
  recipes: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [event, setEvent] = useState(initial);
  const [dishes, setDishes] = useState<DraftDish[]>(toDraft(initialDishes));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const courses = useMemo(
    () =>
      toCourses(
        dishes.map((d, i) => ({
          id: d.key, event_id: event.id, course_index: d.course_index,
          course_name: d.course_name, order_index: i, recipe_id: null,
          title: d.title || 'Untitled', subtitle: d.subtitle || null,
          contains: d.contains, is_choice: d.is_choice,
        })),
      ),
    [dishes, event.id],
  );

  const rows = useMemo(() => coverage(courses, guests), [courses, guests]);
  const summary = useMemo(() => coverageSummary(courses, rows), [courses, rows]);
  const coming = guests.filter((g) => g.rsvp === 'yes');
  const headcount = coming.reduce((n, g) => n + 1 + g.plus_ones, 0);

  // The server has no origin to report, so render the path and fill the host in
  // after mount. Reading window during render makes the first client paint
  // disagree with the HTML it is hydrating, which React rejects outright.
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(window.location.origin), []);
  const link = `${origin}/e/${event.slug}`;

  function set<K extends keyof DinnerEvent>(k: K, v: DinnerEvent[K]) {
    setEvent((e) => ({ ...e, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setSaved(null);
    try {
      await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      await fetch(`/api/events/${event.id}/dishes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishes: dishes.map((d, i) => ({
            course_index: d.course_index,
            course_name: d.course_name || null,
            order_index: i,
            title: d.title,
            subtitle: d.subtitle || null,
            contains: d.contains,
            is_choice: d.is_choice,
          })),
        }),
      });
      setSaved('Saved.');
      router.refresh();
    } catch {
      setSaved('That did not save.');
    } finally {
      setSaving(false);
    }
  }

  const courseIndices = [...new Set(dishes.map((d) => d.course_index))].sort((a, b) => a - b);
  const nextCourse = courseIndices.length ? Math.max(...courseIndices) + 1 : 0;

  function addDish(courseIndex: number, courseName = '') {
    setDishes((ds) => [
      ...ds,
      { key: newKey(), course_index: courseIndex, course_name: courseName, title: '', subtitle: '', contains: [], is_choice: false },
    ]);
  }

  function patch(key: string, p: Partial<DraftDish>) {
    setDishes((ds) => ds.map((d) => (d.key === key ? { ...d, ...p } : d)));
  }

  /** Renaming a course renames every dish in it — the name belongs to the course. */
  function renameCourse(courseIndex: number, name: string) {
    setDishes((ds) => ds.map((d) => (d.course_index === courseIndex ? { ...d, course_name: name } : d)));
  }
  function setChoice(courseIndex: number, on: boolean) {
    setDishes((ds) => ds.map((d) => (d.course_index === courseIndex ? { ...d, is_choice: on } : d)));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      {/* One list for every dish field. Rendering it per row gave eight
          elements the same id, which is invalid and leaves the browser to
          pick one. */}
      <datalist id="event-recipes">
        {recipes.map((r) => (
          <option key={r.id} value={r.title} />
        ))}
      </datalist>

      <div className="pt-10 md:pt-14 flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="text-[30px] md:text-[42px] leading-[1.05] tracking-[-0.02em] font-normal m-0">
          {event.title || 'Dinner'}
        </h1>
        <div className="flex items-center gap-4">
          {saved && <span className="text-[12.5px] text-text-secondary">{saved}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="bg-text text-background text-[13px] px-5 py-2 disabled:opacity-40 hover:opacity-85 transition-opacity"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* the link */}
      <section className="mt-8 border border-border p-4 flex flex-wrap items-center gap-3">
        <span className="text-[10.5px] uppercase tracking-[0.13em] text-text-secondary">
          {event.status === 'open' ? 'Live link' : 'Link (not live yet)'}
        </span>
        <code className="text-[12.5px] break-all">{link}</code>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(link)}
            className="text-[11px] uppercase tracking-[0.1em] border border-border px-3 py-1.5 hover:border-text transition-colors"
          >
            Copy
          </button>
          <select
            value={event.status}
            onChange={(e) => set('status', e.target.value as DinnerEvent['status'])}
            className="text-[12px] border border-border px-2 py-1.5 bg-background"
          >
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        {event.status !== 'open' && (
          <p className="w-full text-[12px] text-text-secondary m-0">
            Only an open dinner answers that link — a draft returns a plain not-found, so a link
            forwarded early doesn't show a half-built menu.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 mt-10 items-start">
        <div className="flex flex-col gap-10">

          {/* ── details ── */}
          <section>
            <H>The night</H>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
              <F label="Title"><Inp value={event.title} onChange={(v) => set('title', v)} /></F>
              <F label="Host"><Inp value={event.host ?? ''} onChange={(v) => set('host', v)} placeholder="Who's cooking" /></F>
              <F label="Date"><Inp type="date" value={event.event_date} onChange={(v) => set('event_date', v)} /></F>
              <F label="Seats"><Inp type="number" value={String(event.seats ?? '')} onChange={(v) => set('seats', v ? Number(v) : null)} /></F>
              <F label="Starts"><Inp type="time" value={event.start_time ?? ''} onChange={(v) => set('start_time', v)} /></F>
              <F label="Ends"><Inp type="time" value={event.end_time ?? ''} onChange={(v) => set('end_time', v)} /></F>
              <F label="Where" wide><Inp value={event.location ?? ''} onChange={(v) => set('location', v)} placeholder="Address, or just 'mine'" /></F>
              <F label="What kind of night" wide>
                <Area value={event.expect ?? ''} onChange={(v) => set('expect', v)}
                      placeholder="Seven small courses, Roman and Italian. Drinks at seven, at the table by twenty to eight." />
              </F>
              <F label="Dress"><Inp value={event.dress ?? ''} onChange={(v) => set('dress', v)} placeholder="Whatever you'd wear to a friend's kitchen" /></F>
              <F label="Bring"><Inp value={event.bring ?? ''} onChange={(v) => set('bring', v)} placeholder="Nothing" /></F>
              <F label="Getting there" wide>
                <Area value={event.directions ?? ''} onChange={(v) => set('directions', v)}
                      placeholder="Buzzer 3. Street parking free after six. Two cats." />
              </F>
            </div>
          </section>

          {/* ── the menu ── */}
          <section>
            <H>The menu</H>
            <p className="text-[12.5px] text-text-secondary mt-2 mb-4 max-w-[62ch]">
              What a dish contains is what prints on the card and what the check reads, so it is
              entered once. Mark a course as a choice only when the guest picks one — two plates
              arriving together is not a decision.
            </p>

            <div className="flex flex-col gap-6">
              {courseIndices.map((ci) => {
                const inCourse = dishes.filter((d) => d.course_index === ci);
                return (
                  <div key={ci} className="border border-border p-4">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <input
                        value={inCourse[0]?.course_name ?? ''}
                        onChange={(e) => renameCourse(ci, e.target.value)}
                        placeholder="Course name"
                        className="text-[11px] uppercase tracking-[0.13em] bg-transparent border-b border-border
                                   focus:border-text outline-none py-1 flex-1 min-w-[140px]"
                      />
                      {inCourse.length > 1 && (
                        <label className="text-[11.5px] text-text-secondary flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={inCourse.every((d) => d.is_choice)}
                            onChange={(e) => setChoice(ci, e.target.checked)}
                          />
                          a choice of these
                        </label>
                      )}
                      <button
                        onClick={() => setDishes((ds) => ds.filter((d) => d.course_index !== ci))}
                        className="text-[11px] text-text-secondary hover:text-text"
                      >
                        Remove course
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {inCourse.map((d) => (
                        <DishRow
                          key={d.key}
                          dish={d}
                          onChange={(p) => patch(d.key, p)}
                          onRemove={() => setDishes((ds) => ds.filter((x) => x.key !== d.key))}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => addDish(ci, inCourse[0]?.course_name ?? '')}
                      className="text-[12px] text-text-secondary hover:text-text mt-3"
                    >
                      + another dish in this course
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => addDish(nextCourse)}
              className="text-[13px] border border-border px-4 py-2 mt-5 hover:border-text transition-colors"
            >
              + Add a course
            </button>
          </section>
        </div>

        {/* ── right rail ── */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-6">
          <section>
            <H>The card</H>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 mb-4">
              <label className="text-[11.5px] text-text-secondary flex items-center gap-2">
                Style
                <select value={event.style} onChange={(e) => set('style', e.target.value)}
                        className="text-[12px] border border-border px-2 py-1 bg-background">
                  {MENU_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label className="text-[11.5px] text-text-secondary flex items-center gap-2">
                Paper
                <select value={event.stock} onChange={(e) => set('stock', e.target.value)}
                        className="text-[12px] border border-border px-2 py-1 bg-background">
                  {MENU_STOCKS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
            </div>
            {courses.length > 0 ? (
              <>
                <MenuCard
                  courses={courses}
                  title={event.title || 'Dinner'}
                  dateline={formatDateLong(event.event_date)}
                  styleId={event.style}
                  stockId={event.stock}
                />
                <a href={`/events/${event.id}/menu`}
                   className="inline-block text-[12.5px] border border-border px-4 py-2 mt-4 hover:border-text transition-colors">
                  Print it →
                </a>
              </>
            ) : (
              <p className="text-[12.5px] text-text-secondary">Add a course and the card appears here.</p>
            )}
          </section>

          <section>
            <H>Replies</H>
            <p className="text-[12.5px] text-text-secondary mt-2 mb-3">
              {guests.length === 0 ? 'Nobody has answered yet.' : `${headcount} coming of ${guests.length} replied.`}
            </p>
            {guests.length > 0 && (
              <div className="flex flex-col">
                {guests.map((g) => (
                  <div key={g.id} className="flex items-baseline gap-3 py-2 border-b border-border text-[12.5px]">
                    <span className="flex-1">{g.name}{g.plus_ones ? ` +${g.plus_ones}` : ''}</span>
                    <span className={g.rsvp === 'yes' ? 'text-[#4a6b52]' : 'text-text-secondary'}>
                      {g.rsvp === 'yes' ? 'coming' : g.rsvp === 'no' ? "can't" : 'started'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {guests.some((g) => g.avoids.length || g.note) && (
              <div className="mt-4 flex flex-col gap-2">
                {guests.filter((g) => g.avoids.length || g.note).map((g) => (
                  <p key={g.id} className="text-[12px] text-text-secondary leading-[1.5] m-0">
                    <span className="text-text">{g.name}.</span>{' '}
                    {g.avoids.map((a) => DIET_CHIPS.find((c) => c.id === a)?.label ?? a).join(', ')}
                    {g.avoids.length && g.note ? ' — ' : ''}
                    {g.note}
                  </p>
                ))}
              </div>
            )}
          </section>

          {/* the one panel that can tell you something */}
          <section>
            <H>Who can eat what</H>
            <p className={`text-[12.5px] leading-[1.6] mt-3 p-3 border ${
              summary.startsWith('Everyone') || summary.startsWith('No replies')
                ? 'border-border text-text-secondary'
                : 'border-[#a0522d] text-[#a0522d] bg-[#f6efe9]'
            }`}>
              {summary}
            </p>

            {coming.length > 0 && courses.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <div
                  className="grid text-[11px] min-w-[260px]"
                  style={{ gridTemplateColumns: `minmax(64px,1fr) repeat(${courses.length}, minmax(34px, auto))` }}
                >
                  <div className="text-[9px] uppercase tracking-[0.1em] text-text-secondary pb-2 border-b border-text pr-2">Guest</div>
                  {courses.map((c) => (
                    <div key={c.index} className="text-[9px] uppercase tracking-[0.1em] text-text-secondary pb-2 border-b border-text text-center px-1">
                      {c.name ? c.name.slice(0, 6) : c.index + 1}
                    </div>
                  ))}
                  {rows.filter((r) => r.guest.rsvp === 'yes').map((r) => (
                    <Fragment key={r.guest.id}>
                      <div className="py-1.5 border-b border-border text-text-secondary pr-2 truncate">
                        {r.guest.name}
                      </div>
                      {r.perCourse.map((p) => (
                        <div
                          key={`${r.guest.id}-${p.course.index}`}
                          className={`py-1.5 border-b border-border text-center px-1 ${
                            p.eatable === 0 ? 'bg-[#f6efe9] text-[#a0522d]' : 'text-[#4a6b52]'
                          }`}
                        >
                          {p.eatable === 0 ? 'none' : p.eatable === p.total ? 'all' : p.eatable}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── pieces ─────────────────────────────────────────────────── */

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[11px] uppercase tracking-[0.13em] text-text-secondary border-b border-text pb-2 m-0">{children}</h2>;
}

function F({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

function Inp({ value, onChange, type = 'text', placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border-b border-border focus:border-text outline-none text-[14px] py-1.5
                 placeholder:text-border transition-colors"
    />
  );
}

function Area({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border border-border focus:border-text outline-none text-[13.5px] p-2.5
                 min-h-[64px] placeholder:text-border transition-colors resize-y"
    />
  );
}

function DishRow({ dish, onChange, onRemove }: {
  dish: DraftDish;
  onChange: (p: Partial<DraftDish>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          list="event-recipes"
          value={dish.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Dish"
          className="flex-1 bg-transparent border-b border-border focus:border-text outline-none text-[14px] py-1.5
                     placeholder:text-border transition-colors"
        />
        <button onClick={() => setOpen((o) => !o)}
                className="text-[11px] text-text-secondary hover:text-text whitespace-nowrap">
          {dish.contains.length ? dish.contains.length + ' tags' : 'tags'}
        </button>
        <button onClick={onRemove} className="text-[11px] text-text-secondary hover:text-text">Remove</button>
      </div>
      <input
        value={dish.subtitle}
        onChange={(e) => onChange({ subtitle: e.target.value })}
        placeholder="the line underneath, e.g. rolled beef, slow tomato"
        className="bg-transparent border-b border-border focus:border-text outline-none text-[12px] py-1
                   text-text-secondary placeholder:text-border transition-colors"
      />
      {open && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {DIET_TAGS.map((t) => {
            const on = dish.contains.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  onChange({ contains: on ? dish.contains.filter((x) => x !== t) : [...dish.contains, t] })
                }
                className={`text-[10.5px] px-2 py-1 border transition-colors ${
                  on ? 'border-text bg-text text-background' : 'border-border text-text-secondary hover:border-text'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
