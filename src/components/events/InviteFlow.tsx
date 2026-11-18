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
  allow_plus_ones: boolean;
  ask_dietary: boolean;
  seating: boolean;
};

/**
 * One question at a time, and only the questions this host is asking.
 *
 * Everything here is read by someone who does not use this app and never will,
 * so none of it explains how the app works. The earlier draft asked "who is
 * this?" and then told the guest their answer would "land next to your name
 * rather than as an anonymous yes", which is a note about the database wearing
 * a question's clothes.
 *
 * Three of the steps are the host's to switch off. A plus-one offered at a
 * table with no spare chair, or a dietary question from someone who is not
 * going to cook around the answer, are both worse than not asking.
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
  const dimFor = avoids.length ? (d: EventDish) => !canEat(d, blocked) : undefined;
  const cal = useMemo(() => calendarLinks(event), [event]);

  const order: StepId[] = [
    'welcome',
    'name',
    'expect',
    ...(hasMenu ? (['menu'] as StepId[]) : []),
    'rsvp',
    ...(event.ask_dietary ? (['diet'] as StepId[]) : []),
    'done',
  ];
  const at = order.indexOf(step);

  function go(to: StepId) {
    setStep(to);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const next = () => go(order[Math.min(order.length - 1, at + 1)]);
  const back = () => go(order[Math.max(0, at - 1)]);

  // Someone who can't come is asked nothing else.
  const forward = () => {
    if (step === 'rsvp' && rsvp === 'no') return save('no');
    if (step === 'rsvp' && !event.ask_dietary) return save('yes');
    next();
  };

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
          plus_ones: finalRsvp === 'yes' && event.allow_plus_ones ? plus : 0,
          avoids: finalRsvp === 'yes' && event.ask_dietary ? avoids : [],
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

  const when = `${formatDateLong(event.event_date)}${
    event.start_time ? `, ${formatTimeRange(event.start_time, event.end_time)}` : ''
  }`;

  return (
    <div className="invite flex flex-col">
      <div className="h-px invite-rule">
        <div
          className="h-px transition-[width] duration-500 ease-out"
          style={{ width: `${(at / (order.length - 1)) * 100}%`, background: 'var(--brass)' }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[600px] w-full mx-auto px-6 py-16 md:py-24">
        {step === 'welcome' && (
          <Step>
            <Eyebrow>You're invited to</Eyebrow>
            <h1 className="invite-serif text-[44px] md:text-[64px] leading-[1.02] mt-4 mb-5">
              {event.title}
            </h1>
            <p className="text-[17px]" style={{ color: 'var(--muted)' }}>{when}</p>
            {event.host && (
              <p className="text-[15px] mt-2" style={{ color: 'var(--muted)' }}>
                {event.host} is cooking
              </p>
            )}
            {comingCount > 0 && (
              <p className="text-[13px] mt-8" style={{ color: 'var(--muted)' }}>
                {comingCount} coming so far
              </p>
            )}
            <Primary onClick={next}>Open the invitation</Primary>
          </Step>
        )}

        {step === 'name' && (
          <Step>
            <Q>{event.seating ? 'What should your place card say?' : "What's your name?"}</Q>
            {event.seating && <Sub>There's a seating plan, so this is the name on the table.</Sub>}
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && next()}
              placeholder="Your name"
              className="w-full mt-8 bg-transparent border-b outline-none text-[24px] py-2 transition-colors invite-serif"
              style={{ borderColor: 'var(--rule)' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--brass)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--rule)')}
            />
            <Primary onClick={next} disabled={!name.trim()}>Continue</Primary>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'expect' && (
          <Step>
            <Q>What's happening</Q>
            <dl className="mt-8 flex flex-col gap-5">
              <Fact k="When">{when}</Fact>
              {event.location && <Fact k="Where">{event.location}</Fact>}
              {event.expect && <Fact k="The night">{event.expect}</Fact>}
              {event.dress && <Fact k="Dress">{event.dress}</Fact>}
              {event.bring && <Fact k="Bring">{event.bring}</Fact>}
            </dl>

            {/* Put it in the calendar now, while the date is in front of them —
                not only at the end, which they may never reach. */}
            <div className="mt-9">
              <Eyebrow>Add to calendar</Eyebrow>
              <div className="flex flex-wrap gap-2 mt-3">
                <CalLink href={cal.google}>Google</CalLink>
                <CalLink
                  href={cal.ics}
                  download={`${event.title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`}
                >
                  Apple
                </CalLink>
                <CalLink href={cal.outlook}>Outlook</CalLink>
              </div>
            </div>

            <Primary onClick={next}>{hasMenu ? 'See the menu' : 'Continue'}</Primary>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'menu' && (
          <Step>
            <Q>The menu</Q>
            <Sub>
              {courses.length} course{courses.length === 1 ? '' : 's'}
              {event.host ? `, cooked by ${event.host}` : ''}.
            </Sub>
            <div className="mt-8">
              <MenuCard
                courses={courses}
                title={event.title}
                dateline={formatDateLong(event.event_date)}
                styleId={event.style}
                stockId={event.stock}
              />
            </div>
            <Primary onClick={next}>Can you come?</Primary>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'rsvp' && (
          <Step>
            <Q>Can you come?</Q>
            <div className="flex gap-3 mt-8">
              <Choice on={rsvp === 'yes'} onClick={() => setRsvp('yes')}>Yes</Choice>
              <Choice on={rsvp === 'no'} onClick={() => setRsvp('no')}>Can't make it</Choice>
            </div>

            {/* Only where there is a chair for one. */}
            {rsvp === 'yes' && event.allow_plus_ones && (
              <div className="mt-9 flex items-center gap-5">
                <span className="text-[14px]" style={{ color: 'var(--muted)' }}>Bringing anyone?</span>
                <div className="flex items-center gap-3">
                  <Stepper onClick={() => setPlus((n) => Math.max(0, n - 1))} label="one fewer">−</Stepper>
                  <span className="text-[17px] tabular-nums w-5 text-center">{plus}</span>
                  <Stepper onClick={() => setPlus((n) => Math.min(6, n + 1))} label="one more">+</Stepper>
                </div>
              </div>
            )}

            {error && <Err>{error}</Err>}
            <Primary onClick={forward} disabled={!rsvp || saving}>
              {saving ? 'Sending…' : rsvp === 'no' || (rsvp === 'yes' && !event.ask_dietary) ? 'Send' : 'Continue'}
            </Primary>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'diet' && (
          <Step>
            <Q>Anything you don't eat?</Q>
            <Sub>Better now than at the table. Tap anything that applies.</Sub>
            <div className="flex flex-wrap gap-2 mt-8">
              {DIET_CHIPS.map((c) => {
                const on = avoids.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAvoids((a) => (on ? a.filter((x) => x !== c.id) : [...a, c.id]))}
                    className="text-[13.5px] px-3.5 py-2 border transition-colors"
                    style={
                      on
                        ? { borderColor: 'var(--brass)', background: 'var(--brass)', color: '#17110d' }
                        : { borderColor: 'var(--rule)', color: 'var(--muted)' }
                    }
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything else worth knowing?"
              className="w-full mt-6 bg-transparent border outline-none text-[14px] p-3.5 min-h-[88px] resize-y transition-colors"
              style={{ borderColor: 'var(--rule)' }}
            />

            {hasMenu && avoids.length > 0 && (
              <div className="mt-9">
                <Eyebrow>What that leaves you</Eyebrow>
                <div className="mt-3">
                  <MenuCard
                    courses={courses}
                    title={event.title}
                    styleId={event.style}
                    stockId={event.stock}
                    showKey={false}
                    dimFor={dimFor}
                  />
                </div>
                <p className="text-[13px] mt-3 leading-[1.6]" style={{ color: 'var(--muted)' }}>
                  {event.host ?? 'The host'} sees this too — a course with nothing left on it is
                  worth knowing about now.
                </p>
              </div>
            )}

            {error && <Err>{error}</Err>}
            <Primary onClick={() => save('yes')} disabled={saving}>
              {saving ? 'Sending…' : 'Send it'}
            </Primary>
            <Back onClick={back} />
          </Step>
        )}

        {step === 'done' && (
          <Step>
            <Q>
              {rsvp === 'no' ? 'Another time.' : `Thank you, ${name.split(' ')[0]}.`}
            </Q>
            {rsvp === 'yes' ? (
              <>
                <Sub>
                  {event.host ?? 'The host'} knows you're coming
                  {plus ? ` with ${plus} more` : ''}
                  {avoids.length ? ', and what to keep off your plate' : ''}. See you on{' '}
                  {formatDateLong(event.event_date)}.
                </Sub>

                <div className="mt-10">
                  <Eyebrow>Add to calendar</Eyebrow>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <CalLink href={cal.google}>Google</CalLink>
                    <CalLink
                      href={cal.ics}
                      download={`${event.title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`}
                    >
                      Apple
                    </CalLink>
                    <CalLink href={cal.outlook}>Outlook</CalLink>
                  </div>
                </div>

                {event.directions && (
                  <div className="mt-10">
                    <Eyebrow>Getting there</Eyebrow>
                    <p className="text-[14px] mt-3 leading-[1.75] whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                      {event.directions}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => go('name')}
                  className="text-[13px] underline underline-offset-4 mt-10 self-start transition-colors"
                  style={{ color: 'var(--muted)' }}
                >
                  Change something
                </button>
              </>
            ) : (
              <>
                <Sub>{event.host ?? 'The host'} has been told. No explanation needed.</Sub>
                <button
                  type="button"
                  onClick={() => { setRsvp(null); go('rsvp'); }}
                  className="text-[13px] underline underline-offset-4 mt-10 self-start"
                  style={{ color: 'var(--muted)' }}
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

/* ── pieces ─────────────────────────────────────────────────── */

const Step = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col invite-step">{children}</div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10.5px] uppercase tracking-[0.24em] m-0" style={{ color: 'var(--brass)' }}>
    {children}
  </p>
);

const Q = ({ children }: { children: React.ReactNode }) => (
  <h2 className="invite-serif text-[30px] md:text-[38px] leading-[1.18] m-0">{children}</h2>
);

const Sub = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-[1.65] mt-3.5 mb-0 max-w-[46ch]" style={{ color: 'var(--muted)' }}>
    {children}
  </p>
);

const Err = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13.5px] mt-6 mb-0" style={{ color: '#e0a07a' }}>{children}</p>
);

function Fact({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-5 items-baseline">
      <dt className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--brass)' }}>{k}</dt>
      <dd className="text-[16px] leading-[1.55] m-0 whitespace-pre-line">{children}</dd>
    </div>
  );
}

function Primary({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-11 self-start text-[14px] px-8 py-3.5 transition-opacity disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-85"
      style={{ background: 'var(--brass)', color: '#17110d' }}
    >
      {children}
    </button>
  );
}

const Back = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-5 self-start text-[13px] transition-opacity hover:opacity-70"
    style={{ color: 'var(--muted)' }}
  >
    ← Back
  </button>
);

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="text-[16px] px-7 py-3.5 border transition-colors"
      style={
        on
          ? { borderColor: 'var(--brass)', background: 'var(--brass)', color: '#17110d' }
          : { borderColor: 'var(--rule)', color: 'var(--ink)' }
      }
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
      className="w-9 h-9 border text-[17px] leading-none transition-colors"
      style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
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
      className="text-[13.5px] px-4 py-2.5 border transition-colors hover:opacity-80"
      style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
    >
      {children}
    </a>
  );
}
