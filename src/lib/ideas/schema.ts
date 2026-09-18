/** The want-to-try board. Its own file so it drops in as a unit, same
 *  convention as the charcuterie and dinner schemas. Every statement is
 *  idempotent. */
export const IDEAS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS ideas (
  id          TEXT PRIMARY KEY,
  -- The whole point is that an idea does not have to be a recipe yet. A note
  -- with nothing but "matambre arrollado" written on it is a legitimate row;
  -- recipe_id is set only when the idea points at something you already have.
  title       TEXT NOT NULL,
  note        TEXT,
  recipe_id   TEXT,
  -- Where it came from: an Instagram permalink, an article, a person's name.
  source      TEXT,
  -- JSON array of free tags. Not an enum — the board is for half-formed things,
  -- and making someone pick from a list is how a half-formed thing dies.
  tags        TEXT,
  -- 'someday' (the pile) | 'next' (pinned up) | 'made' (done, kept for the log)
  status      TEXT NOT NULL DEFAULT 'someday',
  -- Where it sits on the board. Fractional so a card can be dropped between two
  -- others without renumbering the rest.
  position    REAL NOT NULL DEFAULT 0,
  made_at     TEXT,
  created_at  TEXT,
  updated_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status, position);
`;
