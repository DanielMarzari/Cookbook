'use client';

import { useMemo, useState } from 'react';
import MenuCard from './MenuCard';
import { DIET_CHIPS, blockedBy, canEat, toCourses } from '@/lib/events/types';
import type { EventDish } from '@/lib/events/types';
import { calendarLinks, formatDateLong, formatTimeRange } from '@/lib/events/format';

type PublicEvent = {
  title: string;
  host: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  directions: string | null;
  expect: string | null;
  dress: string | null;
  bring: string | null;
  style: string;
  stock: string;
};

/**
 * One question at a time.
 *
 * A dinner invitation asks four things and most of them are one tap, so a
 * single long form makes it look like paperwork and a wall of fields is the
 * reason people reply "yes!" in a text message and never say they're vegan.
 * Each step holds one decision, the menu sits between the yes and the dietary
 * question so people have a reason to keep going, and the whole thing is
 * answerable with a thumb.
 */

type StepId = 'welcome' | 'name' | 'expect' | 'menu' | 'rsvp' | 'diet' | 'done';

export default function InviteFlow({
  slug,
  event,
  dishes,
  comingCount,
}: {
  slug: string;
  event: PublicEvent;
  dishes: EventDish[];
  comingCount: number;
}) {
  const [step, setStep] = useState<StepId>('welcome');
  const [name, setName] = useState('');
  const [rsvp, setRsvp] = useState<'yes' | 'no' | null>(null);
  const [plus, setPlus] = useState(0);
  const [avoids, setAvoids] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courses = useMemo(() => toCourses(dishes), [dishes]);
  const blocked = useMemo(() => blockedBy(avoids), [avoids]);
  const hasMenu = courses.length > 0;

  // Once they've said what they avoid, the card marks what that rules out —
  // which is also the honest way to show a menu that doesn't suit them.
  const dimFor = avoids.length ? (d: EventDish) => !canEat(d, blocked) : undefined;

  const cal = useMemo(() => calendarLinks(event), [event]);

  const order: StepId[] = hasMenu
    ? ['welcome', 'name', 'expect', 'menu', 'rsvp', 'diet', 'done']
    : ['welcome', 'name', 'expect', 'rsvp', 'diet', 'done'];
  const at = order.indexOf(step);

  function go(to: StepId) {
    setStep(to);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }
  const next = () => go(order[Math.min(order.length - 1, at + 1)]);
  const back = () => go(order[Math.max(0, at - 1)]);

  // Someone who can't come is asked nothing else — no menu, no diet, no
  // "sorry to hear that" page with a form still on it.
  const forward = () => (step === 'rsvp' && rsvp === 'no' ? save('no') : next());

  async function save(finalRsvp: 'yes' | 'no' = rsvp === 'no' ? 'no' : 'yes') {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/public/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          rsvp: finalRsvp,
          plus_ones: finalRsvp === 'yes' ? plus : 0,
          avoids: finalRsvp === 'yes' ? avoids : [],
          note: note.trim() || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? 'That did not send.');
      setRsvp(finalRsvp);
      go('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That did not send.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Progress: a thin rule rather than "step 3 of 6", which makes four
          taps sound like a form. */}
      <div className="h-[2px] bg-border">
        <div
          className="h-full bg-text transition-[width] duration-300"
          style={{ width: `${(at / (order.length - 1)) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[560px] w-full mx-auto px-5 py-12 md:py-16">
        {step === 'welcome' && (
          <Step>
            <p className="text-[11px] uppercase tracking-[0.22em] text-text-secondary">You're asked to</p>
            <h1 className="invite-serif text-[38px] md:text-[54px] leading-[1.05] mt-3 mb-4">{event.title}</h1>
            <p className="text-[16px] text-text-secondary">
              {formatDateLong(event.event_date)}
              {event.start_time ? `, ${formatTimeRange(event.start_time, event.end_time)}` : ''}
            </p>
            {event.host && <p className="text-[14px] text-text-secondary mt-2">{event.host} is cooking</p>}
            {comingCount > 0 && (
              <p className="text-[13px] text-text-secondary mt-6">{comingCount} coming so far</p>
            )}
            <Next onClick={next}>Open the invitation</Next>
          </Step>
        )}

        {step === 'name' && (
          <Step>
            <Q>First — who is this?</Q>
            <Sub>So your answer lands next to your name rather than as an anonymous yes.</Sub>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && next()}
              placeholder="Your name"
              className="w-full mt-7 bg-transparent border-b border-border focus:border-text outline-none
                         text-[22px] py-2 placeholder:text-border transition-colors"
            />
            <Next onClick={next} disabled={!name.trim()}>Continue</Next>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'expect' && (
          <Step>
            <Q>Here's what's happening</Q>
            <dl className="mt-7 flex flex-col gap-4">
              <Fact k="When">
                {formatDateLong(event.event_date)}
                {event.start_time ? `, ${formatTimeRange(event.start_time, event.end_time)}` : ''}
              </Fact>
              {event.location && <Fact k="Where">{event.location}</Fact>}
              {event.expect && <Fact k="The night">{event.expect}</Fact>}
              {event.dress && <Fact k="Dress">{event.dress}</Fact>}
              {event.bring && <Fact k="Bring">{event.bring}</Fact>}
            </dl>
            <Next onClick={next}>{hasMenu ? "See what's being served" : 'Continue'}</Next>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'menu' && (
          <Step>
            <Q>What's being served</Q>
            <Sub>The plan, anyway. Say what you don't eat on the next screen and this updates.</Sub>
            <div className="mt-7">
              <MenuCard
                courses={courses}
                title={event.title}
                dateline={formatDateLong(event.event_date)}
                styleId={event.style}
                stockId={event.stock}
              />
            </div>
            <Next onClick={next}>Can you come?</Next>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'rsvp' && (
          <Step>
            <Q>Can you come?</Q>
            <div className="flex gap-3 mt-7">
              <Choice on={rsvp === 'yes'} onClick={() => setRsvp('yes')}>Yes</Choice>
              <Choice on={rsvp === 'no'} onClick={() => setRsvp('no')}>Can't make it</Choice>
            </div>

            {rsvp === 'yes' && (
              <div className="mt-8 flex items-center gap-4">
                <span className="text-[13px] text-text-secondary">Bringing anyone?</span>
                <div className="flex items-center gap-3">
                  <Stepper onClick={() => setPlus((n) => Math.max(0, n - 1))} label="one fewer">−</Stepper>
                  <span className="text-[16px] tabular-nums w-5 text-center">{plus}</span>
                  <Stepper onClick={() => setPlus((n) => Math.min(6, n + 1))} label="one more">+</Stepper>
                </div>
              </div>
            )}

            {error && <p className="text-[13px] text-[#a0522d] mt-6">{error}</p>}
            <Next onClick={forward} disabled={!rsvp || saving}>
              {saving ? 'Sending…' : rsvp === 'no' ? 'Send' : 'Continue'}
            </Next>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'diet' && (
          <Step>
            <Q>Anything you don't eat?</Q>
            <Sub>Asked before the shopping rather than at the table. Tap anything that applies.</Sub>
            <div className="flex flex-wrap gap-2 mt-7">
              {DIET_CHIPS.map((c) => {
                const on = avoids.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAvoids((a) => (on ? a.filter((x) => x !== c.id) : [...a, c.id]))}
                    className={`text-[13px] px-3 py-2 border transition-colors ${
                      on ? 'border-text bg-text text-background' : 'border-border text-text-secondary hover:border-text hover:text-text'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything else worth knowing? An allergy, a dislike, something you're avoiding this month."
              className="w-full mt-6 bg-transparent border border-border focus:border-text outline-none
                         text-[14px] p-3 min-h-[84px] placeholder:text-border transition-colors resize-y"
            />

            {hasMenu && avoids.length > 0 && (
              <div className="mt-7">
                <p className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-3">
                  What that leaves you
                </p>
                <MenuCard
                  courses={courses}
                  title={event.title}
                  styleId={event.style}
                  stockId={event.stock}
                  showKey={false}
                  dimFor={dimFor}
                />
                <p className="text-[12.5px] text-text-secondary mt-3 leading-[1.6]">
                  Struck through is what you've ruled out. {event.host ?? 'The host'} sees this too — a course
                  with nothing left on it is the sort of thing worth knowing now.
                </p>
              </div>
            )}

            {error && <p className="text-[13px] text-[#a0522d] mt-6">{error}</p>}
            <Next onClick={() => save('yes')} disabled={saving}>{saving ? 'Sending…' : 'Send it'}</Next>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'done' && (
          <Step>
            <Q>{rsvp === 'no' ? 'Noted, and no explanation needed.' : `Thank you, ${name.split(' ')[0]}.`}</Q>
            {rsvp === 'yes' ? (
              <>
                <Sub>
                  {event.host ?? 'The host'} can see you're coming
                  {plus ? ` with ${plus} more` : ''}
                  {avoids.length ? ', and what to keep off your plate' : ''}.
                </Sub>

                <p className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mt-10 mb-3">
                  Put it in your calendar
                </p>
                <div className="flex flex-wrap gap-2">
                  <CalLink href={cal.google}>Google Calendar</CalLink>
                  <CalLink href={cal.ics} download={`${event.title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`}>
                    Apple Calendar
                  </CalLink>
                  <CalLink href={cal.outlook}>Outlook</CalLink>
                </div>

                {event.directions && (
                  <>
                    <p className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mt-10 mb-2">
                      Getting there
                    </p>
                    <p className="text-[13.5px] text-text-secondary leading-[1.7] whitespace-pre-line">
                      {event.directions}
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => go('name')}
                  className="text-[12.5px] text-text-secondary hover:text-text underline underline-offset-4 mt-10 self-start"
                >
                  Change something
                </button>
              </>
            ) : (
              <>
                <Sub>Another time. {event.host ?? 'The host'} has been told, and that's all that's needed.</Sub>
                <button
                  type="button"
                  onClick={() => { setRsvp(null); go('rsvp'); }}
                  className="text-[12.5px] text-text-secondary hover:text-text underline underline-offset-4 mt-10 self-start"
                >
                  Actually, I can come
                </button>
              </>
            )}
          </Step>
        )}
      </div>
    </div>
  );
}

/* ── the small pieces ──────────────────────────────────────── */

function Step({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col invite-step">{children}</div>;
}

function Q({ children }: { children: React.ReactNode }) {
  return <h2 className="invite-serif text-[27px] md:text-[33px] leading-[1.2] m-0">{children}</h2>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] text-text-secondary leading-[1.6] mt-3 mb-0 max-w-[46ch]">{children}</p>;
}

function Fact({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[76px_1fr] gap-4 items-baseline">
      <dt className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary">{k}</dt>
      <dd className="text-[15px] leading-[1.55] m-0 whitespace-pre-line">{children}</dd>
    </div>
  );
}

function Next({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-10 self-start bg-text text-background text-[14px] px-7 py-3
                 disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-85 transition-opacity"
    >
      {children}
    </button>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 self-start text-[12.5px] text-text-secondary hover:text-text transition-colors"
    >
      ← Back
    </button>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`text-[15px] px-6 py-3 border transition-colors ${
        on ? 'border-text bg-text text-background' : 'border-border text-text hover:border-text'
      }`}
    >
      {children}
    </button>
  );
}

function Stepper({ onClick, children, label }: { onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 border border-border text-text hover:border-text transition-colors text-[16px] leading-none"
    >
      {children}
    </button>
  );
}

function CalLink({ href, children, download }: { href: string; children: React.ReactNode; download?: string }) {
  return (
    <a
      href={href}
      download={download}
      target={download ? undefined : '_blank'}
      rel="noopener noreferrer"
      className="text-[13px] px-4 py-2.5 border border-border text-text hover:border-text transition-colors"
    >
      {children}
    </a>
  );
}
