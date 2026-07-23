import Database from 'better-sqlite3';
import path from 'path';
import { SCHEMA_SQL } from './schema';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'cookbook.db');
let db: Database.Database | null = null;

/** Add a column to an existing table if it isn't already present. */
function ensureColumn(db: Database.Database, table: string, column: string, type: string): void {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  }
}

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    // Idempotent: creates tables/indexes on a fresh DB, no-ops on an existing one.
    db.exec(SCHEMA_SQL);
    // Add columns introduced after a table already existed. CREATE TABLE
    // IF NOT EXISTS won't alter an existing table, so migrate explicitly.
    ensureColumn(db, 'recipes', 'image_position', 'TEXT');
    ensureColumn(db, 'recipes', 'image_zoom', 'REAL');
    ensureColumn(db, 'books', 'cover', 'TEXT');
    // Backfill the FTS index the first time it's created against an existing DB
    // (the triggers only cover rows written after the virtual table exists).
    const ftsCount = (db.prepare('SELECT count(*) AS c FROM recipes_fts').get() as { c: number }).c;
    const recipeCount = (db.prepare('SELECT count(*) AS c FROM recipes').get() as { c: number }).c;
    if (ftsCount === 0 && recipeCount > 0) {
      db.exec('INSERT INTO recipes_fts(recipe_id, title, description) SELECT id, title, description FROM recipes');
    }
  }
  return db;
}

/**
 * Hydrate a raw technique row: parse the JSON-serialized `image_urls`, `tips`,
 * and `related_techniques` columns into arrays. Without this the API returns
 * them as strings and clients see characters instead of array items.
 */
export function hydrateTechnique<T extends object | null | undefined>(row: T): T {
  if (!row) return row;
  const r = row as Record<string, unknown>;
  for (const key of ['image_urls', 'tips', 'related_techniques']) {
    if (typeof r[key] === 'string') {
      try {
        r[key] = JSON.parse(r[key] as string);
      } catch {
        r[key] = [];
      }
    } else if (r[key] == null) {
      r[key] = [];
    }
  }
  return row;
}

/**
 * Turn a free-text search box value into a safe FTS5 MATCH expression.
 * Strips punctuation that FTS5 treats as operators, makes each token a prefix
 * match, and ANDs them together. Returns null when nothing searchable remains
 * (caller should then skip the FTS filter).
 */
export function toFtsQuery(search: string): string | null {
  const tokens = search
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `${t}*`).join(' ');
}

/**
 * Hydrate a raw ingredient row: parse JSON-serialized `aliases` (string[]) and
 * `custom_nutrition` (object) columns. The write side stores these as JSON
 * strings, so reads must parse them back or clients receive strings instead of
 * arrays/objects. Defensive against null, empty, or already-parsed values.
 */
export function hydrateIngredient<T extends object | null | undefined>(row: T): T {
  if (!row) return row;
  const r = row as Record<string, unknown>;
  if (typeof r.aliases === 'string') {
    try {
      r.aliases = JSON.parse(r.aliases);
    } catch {
      r.aliases = [];
    }
  } else if (r.aliases == null) {
    r.aliases = [];
  }
  if (typeof r.custom_nutrition === 'string') {
    try {
      r.custom_nutrition = JSON.parse(r.custom_nutrition);
    } catch {
      r.custom_nutrition = null;
    }
  }
  return row;
}

/**
 * Hydrate a raw recipe row from SQLite: parse JSON-serialized columns into objects.
 * `instructions` is stored as a JSON string (see POST/PUT in /api/recipes); callers
 * expect an array. Defensive against null, empty, or already-parsed values.
 */
export function hydrateRecipe<T extends { instructions?: unknown } | null | undefined>(row: T): T {
  if (!row) return row;
  const r = row as { instructions?: unknown };
  if (typeof r.instructions === 'string') {
    try {
      r.instructions = JSON.parse(r.instructions);
    } catch {
      r.instructions = [];
    }
  } else if (r.instructions == null) {
    r.instructions = [];
  }
  return row;
}
