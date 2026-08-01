// A 24-hour undo buffer for the operations that destroy things.
//
// Deleting a recipe, promoting a section out of one, or committing a draft over
// it all overwrite data that took real effort to type. None of them were
// recoverable. Before any of those run, the recipe is snapshotted whole into
// `recipe_archive`; for the next 24 hours it can be restored exactly.
//
// This is a safety net, not version history — it holds the state immediately
// before a destructive act, and expires on its own so the table can't grow
// without bound.
import type Database from 'better-sqlite3';

type DB = Database.Database;

export const ARCHIVE_TTL_HOURS = 24;

export type ArchiveReason = 'delete' | 'promote-section' | 'commit-draft' | 'discard-draft';

export interface ArchivedRecipe {
  id: number;
  recipe_id: string;
  title: string;
  reason: ArchiveReason;
  created_at: string;
  expires_at: string;
}

/**
 * Snapshot everything that makes a recipe itself, right before something
 * overwrites it. Safe to call inside an existing transaction.
 */
export function archiveRecipe(db: DB, recipeId: string, reason: ArchiveReason): void {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId) as Record<string, unknown> | undefined;
  if (!recipe) return;

  const payload = {
    recipe,
    ingredients: db.prepare('SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY order_index').all(recipeId),
    tags: db.prepare('SELECT tag_id, auto_generated FROM recipe_tags WHERE recipe_id = ?').all(recipeId),
    photos: db.prepare('SELECT * FROM recipe_photos WHERE recipe_id = ? ORDER BY sort_order').all(recipeId),
    // variations are archived by reference only — they are their own recipes and
    // are not deleted with the base, so they don't need restoring with it
    variationIds: (db.prepare('SELECT id FROM recipes WHERE parent_recipe_id = ?').all(recipeId) as { id: string }[]).map((r) => r.id),
  };

  const now = new Date();
  const expires = new Date(now.getTime() + ARCHIVE_TTL_HOURS * 3600 * 1000);
  db.prepare(
    `INSERT INTO recipe_archive (recipe_id, title, reason, payload, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(recipeId, String(recipe.title ?? 'Untitled'), reason, JSON.stringify(payload), now.toISOString(), expires.toISOString());
}

/** Drop snapshots past their 24 hours. Called on boot; cheap and idempotent. */
export function purgeExpiredArchives(db: DB): void {
  db.prepare('DELETE FROM recipe_archive WHERE expires_at < ?').run(new Date().toISOString());
}

/** What's still recoverable, newest first. */
export function listArchive(db: DB): ArchivedRecipe[] {
  return db.prepare(
    `SELECT id, recipe_id, title, reason, created_at, expires_at
     FROM recipe_archive WHERE expires_at >= ? ORDER BY created_at DESC`
  ).all(new Date().toISOString()) as ArchivedRecipe[];
}

/**
 * Put a snapshot back. The recipe is restored under its original id, so links
 * from other recipes (sub-recipe references, variations' parent pointers) start
 * resolving again rather than staying broken.
 */
export function restoreArchive(db: DB, archiveId: number): { ok: boolean; recipeId?: string; error?: string } {
  const row = db.prepare('SELECT * FROM recipe_archive WHERE id = ?').get(archiveId) as
    | { recipe_id: string; payload: string; expires_at: string }
    | undefined;
  if (!row) return { ok: false, error: 'Nothing archived under that id' };
  if (row.expires_at < new Date().toISOString()) return { ok: false, error: 'That snapshot has expired' };

  let data: {
    recipe: Record<string, unknown>;
    ingredients: Record<string, unknown>[];
    tags: { tag_id: string; auto_generated: number }[];
    photos: Record<string, unknown>[];
  };
  try {
    data = JSON.parse(row.payload);
  } catch {
    return { ok: false, error: 'Archived snapshot is unreadable' };
  }

  const cols = Object.keys(data.recipe);
  const restore = db.transaction(() => {
    db.prepare(
      `INSERT OR REPLACE INTO recipes (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`
    ).run(...cols.map((c) => data.recipe[c] as never));

    db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(row.recipe_id);
    for (const ing of data.ingredients) {
      const k = Object.keys(ing);
      db.prepare(`INSERT INTO recipe_ingredients (${k.join(', ')}) VALUES (${k.map(() => '?').join(', ')})`)
        .run(...k.map((c) => ing[c] as never));
    }

    db.prepare('DELETE FROM recipe_tags WHERE recipe_id = ?').run(row.recipe_id);
    for (const t of data.tags) {
      db.prepare('INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id, auto_generated) VALUES (?, ?, ?)')
        .run(row.recipe_id, t.tag_id, t.auto_generated);
    }

    db.prepare('DELETE FROM recipe_photos WHERE recipe_id = ?').run(row.recipe_id);
    for (const p of data.photos) {
      const k = Object.keys(p);
      db.prepare(`INSERT INTO recipe_photos (${k.join(', ')}) VALUES (${k.map(() => '?').join(', ')})`)
        .run(...k.map((c) => p[c] as never));
    }
  });
  restore();
  return { ok: true, recipeId: row.recipe_id };
}
