import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'cookbook.db');
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
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
