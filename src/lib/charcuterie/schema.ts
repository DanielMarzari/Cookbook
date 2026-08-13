/** Charcuterie tables, kept separate from Cookbook's main SCHEMA_SQL so the
 *  section is a self-contained drop-in. Applied from src/lib/db.ts with one
 *  line: `db.exec(CHARCUTERIE_SCHEMA_SQL)` right after the main schema.
 *
 *  Every statement is idempotent, matching the convention in schema.ts. */
export const CHARCUTERIE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS charcuterie_boards (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  -- Which silhouette and arrangement from src/lib/charcuterie/boards.ts.
  board_id    TEXT NOT NULL,
  pattern_id  TEXT NOT NULL,
  -- 'zones' for the guided planner, 'freeform' for the drag-and-drop builder.
  mode        TEXT NOT NULL DEFAULT 'zones',
  guests      INTEGER NOT NULL DEFAULT 8,
  garnish     INTEGER NOT NULL DEFAULT 0,
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- One row per thing on the board. Zone mode uses zone_id; freeform mode uses
-- the x/y/scale/rot/z columns and leaves zone_id null.
CREATE TABLE IF NOT EXISTS charcuterie_board_items (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id  TEXT NOT NULL REFERENCES charcuterie_boards(id) ON DELETE CASCADE,
  zone_id   TEXT,
  item_id   TEXT NOT NULL,
  cut_index INTEGER NOT NULL DEFAULT 0,
  x         REAL,
  y         REAL,
  scale     REAL,
  rot       REAL,
  z         INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_charcuterie_board_items_board
  ON charcuterie_board_items (board_id);

-- What's actually in the fridge. Global rather than per-board: it's a property
-- of you, not of any one board, and it's what every suggestion ranks against.
CREATE TABLE IF NOT EXISTS charcuterie_pantry (
  item_id  TEXT PRIMARY KEY,
  added_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
`;
