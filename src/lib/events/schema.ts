/** Dinner tables, kept separate from Cookbook's main SCHEMA_SQL so the section
 *  drops in as a unit — same convention as the charcuterie schema. Applied from
 *  src/lib/db.ts with one line.
 *
 *  Every statement is idempotent. */
export const EVENTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  -- What the guest's URL says: /e/<slug>. Unguessable rather than tidy, because
  -- this is the only thing standing between a stranger and the invitation — the
  -- guest page is deliberately outside the site password.
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  host        TEXT,
  -- A day and a clock time, stored apart and as strings. Parsing "2026-09-14"
  -- into an instant makes it UTC midnight, which is the day before everywhere
  -- west of Greenwich — the same bug the cook log had.
  event_date  TEXT NOT NULL,
  start_time  TEXT,
  end_time    TEXT,
  location    TEXT,
  directions  TEXT,
  seats       INTEGER,
  -- Free prose the guest reads before deciding: what kind of night this is.
  expect      TEXT,
  dress       TEXT,
  bring       TEXT,
  -- Which of the twelve card identities, and what paper it prints on.
  style       TEXT NOT NULL DEFAULT 's-oldstyle',
  stock       TEXT NOT NULL DEFAULT 'plain',
  -- 'draft' while you build it, 'open' once the link is live, 'closed' after.
  status      TEXT NOT NULL DEFAULT 'draft',
  created_at  TEXT,
  updated_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- One row per dish on the card. A course is a group of these sharing
-- course_index; two rows in one course with alternates=1 are an "or".
CREATE TABLE IF NOT EXISTS event_dishes (
  id            TEXT PRIMARY KEY,
  event_id      TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  course_index  INTEGER NOT NULL,
  course_name   TEXT,
  order_index   INTEGER NOT NULL DEFAULT 0,
  -- Set when the dish is one of your recipes; null for something bought or
  -- improvised, which still belongs on the card.
  recipe_id     TEXT,
  title         TEXT NOT NULL,
  subtitle      TEXT,
  -- JSON array of diet tags this dish contains: meat, dairy, gluten, nuts,
  -- sesame, honey, shellfish, egg, alcohol. Drives both the printed marks and
  -- the coverage check, so the card and the check cannot disagree.
  contains      TEXT,
  -- Set on every dish of a course the guest chooses between, so a course that
  -- simply has two plates on it is never mistaken for a decision.
  is_choice     INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_event_dishes_event ON event_dishes(event_id, course_index, order_index);

-- One row per person, created when they answer. Nothing is pre-seeded: the
-- link is the invitation, so whoever opens it introduces themselves.
CREATE TABLE IF NOT EXISTS event_guests (
  id          TEXT PRIMARY KEY,
  event_id    TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  -- 'yes' | 'no'. Null means they started and did not finish, which is worth
  -- keeping — a half-filled reply is information the host would otherwise lose.
  rsvp        TEXT,
  plus_ones   INTEGER NOT NULL DEFAULT 0,
  -- JSON array of the diet chips they picked.
  avoids      TEXT,
  note        TEXT,
  created_at  TEXT,
  updated_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_event_guests_event ON event_guests(event_id);
`;
