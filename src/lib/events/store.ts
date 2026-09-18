import { randomUUID } from 'crypto';
import { getDb } from '@/lib/db';
import type { DinnerEvent, EventDish, EventGuest, DietTag } from './types';
import { DIET_TAGS } from './types';
import { DEFAULT_STYLE, DEFAULT_STOCK, MENU_STYLES, MENU_STOCKS } from './styles';

/* ── rows in, typed values out ─────────────────────────────── */

type DishRow = Omit<EventDish, 'contains' | 'is_choice'> & { contains: string | null; is_choice: number };
type GuestRow = Omit<EventGuest, 'avoids'> & { avoids: string | null };

/** A malformed JSON column shouldn't take the page down — degrade to empty. */
function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function hydrateDish(r: DishRow): EventDish {
  return {
    ...r,
    contains: parseList(r.contains).filter((t): t is DietTag => (DIET_TAGS as readonly string[]).includes(t)),
    is_choice: Boolean(r.is_choice),
  };
}

function hydrateGuest(r: GuestRow): EventGuest {
  return { ...r, avoids: parseList(r.avoids) };
}

/* ── slugs ─────────────────────────────────────────────────── */

/**
 * The slug is the only thing between a stranger and the invitation, since the
 * guest page sits outside the site password. So it is a readable stem plus real
 * entropy rather than a tidy guessable one — "sept-dinner" would be found by
 * anyone who tried twice.
 */
export function makeSlug(title: string, date: string): string {
  const stem =
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'dinner';
  const month = (date.split('-')[1] ?? '').replace(/\D/g, '');
  const day = (date.split('-')[2] ?? '').replace(/\D/g, '');
  const rand = randomUUID().replace(/-/g, '').slice(0, 10);
  return [stem, month && day ? `${month}${day}` : '', rand].filter(Boolean).join('-');
}

/* ── reads ─────────────────────────────────────────────────── */

export function listEvents(): DinnerEvent[] {
  return getDb()
    .prepare('SELECT * FROM events ORDER BY event_date DESC, created_at DESC')
    .all() as DinnerEvent[];
}

export function getEvent(id: string): DinnerEvent | undefined {
  return getDb().prepare('SELECT * FROM events WHERE id = ?').get(id) as DinnerEvent | undefined;
}

export function getEventBySlug(slug: string): DinnerEvent | undefined {
  return getDb().prepare('SELECT * FROM events WHERE slug = ?').get(slug) as DinnerEvent | undefined;
}

export function dishesFor(eventId: string): EventDish[] {
  const rows = getDb()
    .prepare('SELECT * FROM event_dishes WHERE event_id = ? ORDER BY course_index, order_index')
    .all(eventId) as DishRow[];
  return rows.map(hydrateDish);
}

export function guestsFor(eventId: string): EventGuest[] {
  const rows = getDb()
    .prepare('SELECT * FROM event_guests WHERE event_id = ? ORDER BY created_at')
    .all(eventId) as GuestRow[];
  return rows.map(hydrateGuest);
}

/* ── writes ────────────────────────────────────────────────── */

export interface EventInput {
  title?: string;
  host?: string | null;
  event_date?: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  directions?: string | null;
  seats?: number | null;
  expect?: string | null;
  dress?: string | null;
  bring?: string | null;
  style?: string;
  stock?: string;
  status?: string;
}

const STYLE_IDS = new Set(MENU_STYLES.map((s) => s.id));
const STOCK_IDS = new Set(MENU_STOCKS.map((s) => s.id));
const STATUSES = new Set(['draft', 'open', 'closed']);

export function createEvent(input: EventInput): DinnerEvent {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  // Store the day as a day. Turning it into an instant makes it UTC midnight,
  // which is the day before everywhere west of Greenwich.
  const date = (input.event_date ?? '').slice(0, 10) || now.slice(0, 10);
  const title = input.title?.trim() || 'Dinner';

  db.prepare(
    `INSERT INTO events (id, slug, title, host, event_date, start_time, end_time, location,
       directions, seats, expect, dress, bring, style, stock, status, created_at, updated_at)
     VALUES (@id, @slug, @title, @host, @event_date, @start_time, @end_time, @location,
       @directions, @seats, @expect, @dress, @bring, @style, @stock, @status, @now, @now)`,
  ).run({
    id,
    slug: makeSlug(title, date),
    title,
    host: input.host ?? null,
    event_date: date,
    start_time: input.start_time ?? null,
    end_time: input.end_time ?? null,
    location: input.location ?? null,
    directions: input.directions ?? null,
    seats: input.seats ?? null,
    expect: input.expect ?? null,
    dress: input.dress ?? null,
    bring: input.bring ?? null,
    style: input.style && STYLE_IDS.has(input.style) ? input.style : DEFAULT_STYLE,
    stock: input.stock && STOCK_IDS.has(input.stock) ? input.stock : DEFAULT_STOCK,
    status: input.status && STATUSES.has(input.status) ? input.status : 'draft',
    now,
  });

  return getEvent(id)!;
}

export function updateEvent(id: string, input: EventInput): DinnerEvent | undefined {
  const existing = getEvent(id);
  if (!existing) return undefined;

  const sets: string[] = [];
  const params: Record<string, unknown> = { id, now: new Date().toISOString() };

  const put = (col: string, val: unknown) => {
    sets.push(`${col} = @${col}`);
    params[col] = val;
  };

  if (input.title !== undefined) put('title', input.title.trim() || 'Dinner');
  if (input.host !== undefined) put('host', input.host);
  if (input.event_date !== undefined) put('event_date', input.event_date.slice(0, 10));
  if (input.start_time !== undefined) put('start_time', input.start_time);
  if (input.end_time !== undefined) put('end_time', input.end_time);
  if (input.location !== undefined) put('location', input.location);
  if (input.directions !== undefined) put('directions', input.directions);
  if (input.seats !== undefined) put('seats', input.seats);
  if (input.expect !== undefined) put('expect', input.expect);
  if (input.dress !== undefined) put('dress', input.dress);
  if (input.bring !== undefined) put('bring', input.bring);
  // An unknown id would blank the card, so ignore it rather than store it.
  if (input.style !== undefined && STYLE_IDS.has(input.style)) put('style', input.style);
  if (input.stock !== undefined && STOCK_IDS.has(input.stock)) put('stock', input.stock);
  if (input.status !== undefined && STATUSES.has(input.status)) put('status', input.status);

  if (sets.length === 0) return existing;
  getDb().prepare(`UPDATE events SET ${sets.join(', ')}, updated_at = @now WHERE id = @id`).run(params);
  return getEvent(id);
}

export function deleteEvent(id: string): void {
  // The child rows name the parent with ON DELETE CASCADE, but foreign_keys is
  // only ON for connections that set it — delete explicitly so a stray pragma
  // can't leave orphaned dishes behind.
  const db = getDb();
  db.transaction(() => {
    db.prepare('DELETE FROM event_dishes WHERE event_id = ?').run(id);
    db.prepare('DELETE FROM event_guests WHERE event_id = ?').run(id);
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
  })();
}

export interface DishInput {
  course_index: number;
  course_name?: string | null;
  order_index?: number;
  recipe_id?: string | null;
  title: string;
  subtitle?: string | null;
  contains?: string[];
  is_choice?: boolean;
}

/**
 * Replace the whole menu in one go.
 *
 * The editor sends the card as it now stands rather than a diff — a menu is
 * small, and reconciling per-dish edits buys nothing but a class of bug where
 * the card on screen and the rows in the table drift apart.
 */
export function setDishes(eventId: string, dishes: DishInput[]): EventDish[] {
  const db = getDb();
  db.transaction(() => {
    db.prepare('DELETE FROM event_dishes WHERE event_id = ?').run(eventId);
    const ins = db.prepare(
      `INSERT INTO event_dishes (id, event_id, course_index, course_name, order_index,
         recipe_id, title, subtitle, contains, is_choice)
       VALUES (@id, @event_id, @course_index, @course_name, @order_index,
         @recipe_id, @title, @subtitle, @contains, @is_choice)`,
    );
    dishes.forEach((d, i) => {
      const title = String(d.title ?? '').trim();
      if (!title) return; // a nameless dish is a blank line on the card
      const contains = (d.contains ?? []).filter((t) => (DIET_TAGS as readonly string[]).includes(t));
      ins.run({
        id: randomUUID(),
        event_id: eventId,
        course_index: Number.isFinite(d.course_index) ? d.course_index : 0,
        course_name: d.course_name ?? null,
        order_index: d.order_index ?? i,
        recipe_id: d.recipe_id ?? null,
        title,
        subtitle: d.subtitle ?? null,
        contains: contains.length ? JSON.stringify(contains) : null,
        is_choice: d.is_choice ? 1 : 0,
      });
    });
  })();
  return dishesFor(eventId);
}

export interface GuestInput {
  name: string;
  rsvp?: 'yes' | 'no' | null;
  plus_ones?: number;
  avoids?: string[];
  note?: string | null;
}

/**
 * Record a reply.
 *
 * Matched on name within the event, so someone who opens the link twice — or
 * changes their mind on Friday — updates their row instead of appearing twice
 * and being counted twice in the coverage check.
 */
export function upsertGuest(eventId: string, input: GuestInput): EventGuest | undefined {
  const db = getDb();
  const name = String(input.name ?? '').trim().slice(0, 80);
  if (!name) return undefined;

  const now = new Date().toISOString();
  const existing = db
    .prepare('SELECT * FROM event_guests WHERE event_id = ? AND LOWER(name) = LOWER(?)')
    .get(eventId, name) as GuestRow | undefined;

  const rsvp = input.rsvp === 'yes' || input.rsvp === 'no' ? input.rsvp : null;
  const plus = Math.max(0, Math.min(10, Math.trunc(Number(input.plus_ones ?? 0)) || 0));
  const avoids = (input.avoids ?? []).filter((a) => typeof a === 'string').slice(0, 20);
  const note = input.note ? String(input.note).slice(0, 2000) : null;

  if (existing) {
    db.prepare(
      `UPDATE event_guests SET name = @name, rsvp = @rsvp, plus_ones = @plus_ones,
         avoids = @avoids, note = @note, updated_at = @now WHERE id = @id`,
    ).run({ id: existing.id, name, rsvp, plus_ones: plus, avoids: JSON.stringify(avoids), note, now });
    return hydrateGuest(db.prepare('SELECT * FROM event_guests WHERE id = ?').get(existing.id) as GuestRow);
  }

  const id = randomUUID();
  db.prepare(
    `INSERT INTO event_guests (id, event_id, name, rsvp, plus_ones, avoids, note, created_at, updated_at)
     VALUES (@id, @event_id, @name, @rsvp, @plus_ones, @avoids, @note, @now, @now)`,
  ).run({ id, event_id: eventId, name, rsvp, plus_ones: plus, avoids: JSON.stringify(avoids), note, now });
  return hydrateGuest(db.prepare('SELECT * FROM event_guests WHERE id = ?').get(id) as GuestRow);
}

export function deleteGuest(eventId: string, guestId: string): void {
  getDb().prepare('DELETE FROM event_guests WHERE id = ? AND event_id = ?').run(guestId, eventId);
}
