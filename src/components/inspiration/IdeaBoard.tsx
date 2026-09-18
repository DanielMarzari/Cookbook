'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Idea, IdeaStatus } from '@/lib/ideas/store';

/**
 * The want-to-try board.
 *
 * Everything else in this cookbook is a record of something finished. This is
 * the opposite — a place for the half-formed thing, where a card reading
 * "matambre arrollado??" is a perfectly good row. So it is deliberately the
 * loosest input in the app: one line, Enter, done. A form with five fields is
 * how a half-formed idea dies.
 *
 * It is also the only page here with colour, which is a choice rather than a
 * lapse: the cards are paper pinned to a board, so they carry their own ink and
 * keep it in dark mode, exactly like the menu stocks.
 */

/** Muted paper, not highlighter. Enough to tell two cards apart across a room. */
const PAPERS = [
  { paper: '#fdf6e3', ink: '#3a3222', edge: '#efe3c4' },
  { paper: '#edf3ee', ink: '#25332a', edge: '#d5e3d8' },
  { paper: '#f4eef7', ink: '#322740', edge: '#e2d6e9' },
  { paper: '#fdeee9', ink: '#40291f', edge: '#f0d8cd' },
  { paper: '#eaf0f7', ink: '#1f2c3d', edge: '#d3e0ed' },
  { paper: '#fbf0f4', ink: '#3b2430', edge: '#eed6e0' },
];

/**
 * Stable per-card randomness.
 *
 * The tilt has to come from the id rather than Math.random, or every card
 * jumps to a new angle on each render and the board twitches whenever anything
 * at all changes.
 */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
const paperFor = (id: string) => PAPERS[hash(id) % PAPERS.length];
const tiltFor = (id: string) => ((hash(id + 'tilt') % 9) - 4) * 0.35; // ±1.4°

const LANES: { id: IdeaStatus; label: string; blurb: string }[] = [
  { id: 'next', label: 'Up next', blurb: 'The short list. Things you actually mean to cook.' },
  { id: 'someday', label: 'Someday', blurb: 'Everything else you liked the look of.' },
  { id: 'made', label: 'Made it', blurb: 'Kept, so the board remembers what it talked you into.' },
];

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [recipes, setRecipes] = useState<{ id: string; title: string }[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [showMade, setShowMade] = useState(false);
  const [spinning, setSpinning] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  // Leaving timers running after the component goes away sets state on an
  // unmounted tree, which React will complain about and is a leak besides.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Loads its own data so it can be dropped into the existing client page
  // without turning that page inside out into a server component.
  useEffect(() => {
    let live = true;
    fetch('/api/ideas')
      .then((r) => r.json())
      .then((d) => {
        if (!live) return;
        setIdeas(d.ideas ?? []);
        setRecipes(d.recipes ?? []);
      })
      .catch(() => {})
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, []);

  const byLane = useMemo(() => {
    const m: Record<IdeaStatus, Idea[]> = { next: [], someday: [], made: [] };
    for (const i of ideas) m[i.status]?.push(i);
    return m;
  }, [ideas]);

  const post = useCallback(async (url: string, method: string, body?: unknown) => {
    setBusy(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => null);
      if (data?.ideas) setIdeas(data.ideas);
      return data;
    } finally {
      setBusy(false);
    }
  }, []);

  async function add() {
    const t = title.trim();
    if (!t) return;
    // Typing a recipe's exact name links the card to it, so "Braciole" on the
    // board becomes a card that knows where the recipe is.
    const match = recipes.find((r) => r.title.toLowerCase() === t.toLowerCase());
    setTitle('');
    await post('/api/ideas', 'POST', { title: t, recipe_id: match?.id ?? null });
  }

  const setStatus = (id: string, status: IdeaStatus) => post(`/api/ideas/${id}`, 'PATCH', { status });
  const remove = (id: string) => post(`/api/ideas/${id}`, 'DELETE');

  /**
   * Pick one for me.
   *
   * The actual question in front of somebody with a wall of saved posts is not
   * "what do I have" but "what am I making". Riffling through the cards and
   * stopping on one answers it, and is more fun than sorting.
   */
  function spin() {
    const pool = [...byLane.next, ...byLane.someday];
    if (pool.length < 2) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPicked(null);

    // Decelerating: short hops at first, longer as it slows, so it lands rather
    // than stops. Fourteen steps at 1.13× from 40ms is about 1.6 seconds — long
    // enough to feel like a decision being made, short enough to press twice.
    const winner = pool[Math.floor(Math.random() * pool.length)];
    let elapsed = 0;
    let d = 40;
    for (let i = 0; i < 14; i++) {
      // The last few hops land on the winner, so it decelerates onto the card
      // it keeps rather than jumping there at the end.
      const id = i >= 12 ? winner.id : pool[Math.floor(Math.random() * pool.length)].id;
      elapsed += d;
      d = Math.round(d * 1.13);
      timers.current.push(window.setTimeout(() => setSpinning(id), elapsed));
    }
    timers.current.push(
      window.setTimeout(() => {
        setSpinning(null);
        setPicked(winner.id);
      }, elapsed + d),
    );
  }

  const pickedIdea = picked ? ideas.find((i) => i.id === picked) : null;
  const canSpin = byLane.next.length + byLane.someday.length > 1;

  return (
    <div className="pb-10">
      {/* ── add ── */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex-1 min-w-[260px] relative">
          <input
            list="idea-recipes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Something you want to make…"
            className="w-full bg-transparent border-0 border-b border-border focus:border-text
                       text-[16px] py-2 pr-16 placeholder:text-text-secondary outline-none transition-colors"
          />
          <button
            onClick={add}
            disabled={!title.trim() || busy}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.12em]
                       text-text-secondary hover:text-text disabled:opacity-30 disabled:hover:text-text-secondary"
          >
            Pin it
          </button>
        </div>
        <button
          onClick={spin}
          disabled={!canSpin}
          className="text-[12.5px] border border-border px-4 py-2 hover:border-text transition-colors
                     disabled:opacity-30 disabled:hover:border-border whitespace-nowrap"
          title={canSpin ? 'Choose one at random' : 'Pin a couple of ideas first'}
        >
          Pick one for me
        </button>
      </div>
      <datalist id="idea-recipes">
        {recipes.map((r) => (
          <option key={r.id} value={r.title} />
        ))}
      </datalist>
      <p className="text-[12px] text-text-secondary mb-8">
        Type anything — a dish, a technique, a half-remembered thing from a menu. Type the exact
        name of one of your recipes and the card links to it.
      </p>

      {/* ── what the spinner landed on ── */}
      {pickedIdea && (
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border border-text px-4 py-3 mb-8"
          role="status"
        >
          <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">Make this</span>
          <span className="text-[17px]">{pickedIdea.title}</span>
          <div className="ml-auto flex items-center gap-3">
            {pickedIdea.status !== 'next' && (
              <button
                onClick={() => { setStatus(pickedIdea.id, 'next'); setPicked(null); }}
                className="text-[12px] underline underline-offset-4 hover:text-text-secondary"
              >
                Put it up next
              </button>
            )}
            <button onClick={spin} className="text-[12px] text-text-secondary hover:text-text">
              Again
            </button>
            <button onClick={() => setPicked(null)} className="text-[12px] text-text-secondary hover:text-text">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {!loaded ? (
        <p className="text-[14px] text-text-secondary py-10">Getting the board…</p>
      ) : ideas.length === 0 ? (
        <p className="text-[14px] text-text-secondary py-10">
          Nothing pinned yet. The first one can be vague — that's rather the point.
        </p>
      ) : (
        LANES.map((lane) => {
          const cards = byLane[lane.id];
          if (lane.id === 'made' && cards.length === 0) return null;
          const collapsed = lane.id === 'made' && !showMade;

          return (
            <section key={lane.id} className="mb-10">
              <div className="flex items-baseline gap-3 border-b border-text pb-2 mb-5">
                <h3 className="text-[13px] uppercase tracking-[0.14em] text-text m-0">{lane.label}</h3>
                <span className="text-[12px] text-text-secondary">{cards.length}</span>
                <span className="text-[12px] text-text-secondary hidden sm:inline">· {lane.blurb}</span>
                {lane.id === 'made' && (
                  <button
                    onClick={() => setShowMade((s) => !s)}
                    className="ml-auto text-[11.5px] text-text-secondary hover:text-text"
                  >
                    {showMade ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>

              {collapsed ? null : cards.length === 0 ? (
                <p className="text-[13px] text-text-secondary">
                  {lane.id === 'next'
                    ? 'Nothing on the short list. Move something up, or let the board pick.'
                    : 'Empty.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {cards.map((idea) => (
                    <Card
                      key={idea.id}
                      idea={idea}
                      spinning={spinning === idea.id}
                      picked={picked === idea.id}
                      onStatus={setStatus}
                      onRemove={remove}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}

function Card({
  idea,
  spinning,
  picked,
  onStatus,
  onRemove,
}: {
  idea: Idea;
  spinning: boolean;
  picked: boolean;
  onStatus: (id: string, s: IdeaStatus) => void;
  onRemove: (id: string) => void;
}) {
  const p = paperFor(idea.id);
  const tilt = tiltFor(idea.id);
  const made = idea.status === 'made';

  return (
    <div
      className="relative w-[196px] min-h-[124px] px-4 pt-6 pb-3 flex flex-col group
                 transition-transform duration-150 ease-out"
      style={{
        background: p.paper,
        color: p.ink,
        // A hairline in the paper's own edge colour, so the card reads as
        // stock rather than as a bordered div.
        boxShadow: `0 0 0 1px ${p.edge}${spinning || picked ? `, 0 0 0 2px ${p.ink}` : ''}`,
        transform: `rotate(${spinning ? 0 : tilt}deg) ${spinning ? 'scale(1.05)' : picked ? 'scale(1.02)' : ''}`,
        opacity: made ? 0.55 : 1,
      }}
    >
      {/* the tack */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-2 w-[7px] h-[7px] rounded-full"
        style={{ background: p.ink, opacity: 0.35 }}
      />

      {idea.recipe_id ? (
        <Link
          href={`/recipes/${idea.recipe_id}`}
          className="text-[15px] leading-[1.3] underline underline-offset-4 decoration-1"
          style={{ color: p.ink, textDecorationColor: p.edge }}
        >
          {idea.title}
        </Link>
      ) : (
        <span className="text-[15px] leading-[1.3]">{idea.title}</span>
      )}

      {idea.note && (
        <span className="text-[12px] mt-1.5 leading-[1.45]" style={{ opacity: 0.7 }}>
          {idea.note}
        </span>
      )}

      {made && idea.made_at && (
        <span className="text-[10px] uppercase tracking-[0.12em] mt-2" style={{ opacity: 0.55 }}>
          made {idea.made_at.slice(0, 10)}
        </span>
      )}

      {/* controls appear on hover, and stay put on touch where hover never fires */}
      <div
        className="mt-auto pt-3 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.1em]
                   opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                   [@media(hover:none)]:opacity-100 transition-opacity"
        style={{ color: p.ink }}
      >
        {idea.status !== 'next' && (
          <button onClick={() => onStatus(idea.id, 'next')} className="hover:underline underline-offset-2">
            Up next
          </button>
        )}
        {idea.status === 'next' && (
          <button onClick={() => onStatus(idea.id, 'someday')} className="hover:underline underline-offset-2">
            Someday
          </button>
        )}
        {!made ? (
          <button onClick={() => onStatus(idea.id, 'made')} className="hover:underline underline-offset-2">
            Made it
          </button>
        ) : (
          <button onClick={() => onStatus(idea.id, 'someday')} className="hover:underline underline-offset-2">
            Again
          </button>
        )}
        <button
          onClick={() => onRemove(idea.id)}
          aria-label={`Remove ${idea.title}`}
          className="ml-auto hover:underline underline-offset-2"
          style={{ opacity: 0.6 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
