// Staged edits. Editing a recipe writes into a draft instead of straight through,
// so a change stays uncommitted until you decide what it *is*: an update to this
// recipe, or the start of a variation. That second option is the reason drafts
// exist — the moment you realise "this isn't a fix, it's a different dish" usually
// arrives after the edit, not before.
import type Database from 'better-sqlite3';
import type { InstructionStep } from '@/lib/types';

type DB = Database.Database;

export interface DraftIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
  section?: string | null;
  child_recipe_id?: string | null;
}

/** Everything an edit can touch. Stored whole so applying a draft is deterministic. */
export interface DraftPayload {
  title?: string;
  description?: string;
  notes?: string;
  cuisine_type?: string;
  difficulty?: string;
  source_url?: string;
  source_name?: string;
  source_author?: string;
  // Framing is part of how the recipe reads, so it stages too. The photo FILES
  // themselves don't — see the note on applyPayload.
  image_url?: string;
  image_rotation?: number;
  image_position?: string;
  image_zoom?: number;
  servings?: number;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  yield_quantity?: number | null;
  yield_unit?: string | null;
  instructions?: InstructionStep[];
  ingredients?: DraftIngredient[];
}

export function getDraft(db: DB, recipeId: string): DraftPayload | null {
  const row = db.prepare('SELECT payload FROM recipe_drafts WHERE recipe_id = ?').get(recipeId) as
    | { payload: string }
    | undefined;
  if (!row?.payload) return null;
  try {
    return JSON.parse(row.payload) as DraftPayload;
  } catch {
    return null;
  }
}

export function saveDraft(db: DB, recipeId: string, payload: DraftPayload): void {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO recipe_drafts (recipe_id, payload, created_at, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(recipe_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`
  ).run(recipeId, JSON.stringify(payload), now, now);
}

export function discardDraft(db: DB, recipeId: string): void {
  db.prepare('DELETE FROM recipe_drafts WHERE recipe_id = ?').run(recipeId);
}

/** Write a draft's contents onto a recipe (its own, or a freshly branched one). */
export function applyPayload(db: DB, recipeId: string, payload: DraftPayload): void {
  const now = new Date().toISOString();
  const set: string[] = [];
  const vals: unknown[] = [];
  const put = (col: string, v: unknown) => {
    if (v !== undefined) { set.push(`${col} = ?`); vals.push(v); }
  };
  put('title', payload.title);
  put('description', payload.description);
  put('notes', payload.notes);
  put('cuisine_type', payload.cuisine_type);
  put('difficulty', payload.difficulty);
  put('source_url', payload.source_url);
  put('source_name', payload.source_name);
  put('source_author', payload.source_author);
  put('image_url', payload.image_url);
  put('image_rotation', payload.image_rotation);
  put('image_position', payload.image_position);
  put('image_zoom', payload.image_zoom);
  put('servings', payload.servings);
  put('prep_time_minutes', payload.prep_time_minutes);
  put('cook_time_minutes', payload.cook_time_minutes);
  put('total_time_minutes', payload.total_time_minutes);
  put('yield_quantity', payload.yield_quantity);
  put('yield_unit', payload.yield_unit);
  if (payload.instructions !== undefined) {
    set.push('instructions = ?');
    vals.push(JSON.stringify(payload.instructions));
  }
  if (set.length) {
    set.push('updated_at = ?');
    vals.push(now, recipeId);
    db.prepare(`UPDATE recipes SET ${set.join(', ')} WHERE id = ?`).run(...vals);
  }

  if (payload.ingredients) {
    db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(recipeId);
    const ins = db.prepare(
      `INSERT INTO recipe_ingredients
         (id, recipe_id, name, quantity, unit, notes, section, child_recipe_id, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    payload.ingredients.forEach((i, idx) => {
      ins.run(
        `ri_${recipeId}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
        recipeId, i.name, i.quantity ?? 0, i.unit ?? '', i.notes ?? null,
        i.section ?? null, i.child_recipe_id ?? null, idx
      );
    });
  }
}

/**
 * Snapshot a recipe in the same shape a draft uses, for diffing and branching.
 * Gallery photos (recipe_photos rows) are deliberately NOT included: they are
 * uploaded files with their own lifecycle, and pretending an unsaved draft owns
 * them would mean a discarded draft could delete a real image.
 */
export function snapshotRecipe(db: DB, recipeId: string): DraftPayload | null {
  const r = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId) as Record<string, unknown> | undefined;
  if (!r) return null;
  let instructions: InstructionStep[] = [];
  try {
    instructions = typeof r.instructions === 'string' ? JSON.parse(r.instructions) : [];
  } catch { /* a malformed blob shouldn't sink the whole snapshot */ }
  const ingredients = db.prepare(
    `SELECT name, quantity, unit, notes, section, child_recipe_id
     FROM recipe_ingredients WHERE recipe_id = ? ORDER BY order_index`
  ).all(recipeId) as DraftIngredient[];
  return {
    title: r.title as string,
    description: (r.description as string) ?? undefined,
    notes: (r.notes as string) ?? undefined,
    cuisine_type: (r.cuisine_type as string) ?? undefined,
    difficulty: (r.difficulty as string) ?? undefined,
    source_url: (r.source_url as string) ?? undefined,
    source_name: (r.source_name as string) ?? undefined,
    source_author: (r.source_author as string) ?? undefined,
    image_url: (r.image_url as string) ?? undefined,
    image_rotation: (r.image_rotation as number) ?? undefined,
    image_position: (r.image_position as string) ?? undefined,
    image_zoom: (r.image_zoom as number) ?? undefined,
    servings: r.servings as number,
    prep_time_minutes: r.prep_time_minutes as number,
    cook_time_minutes: r.cook_time_minutes as number,
    total_time_minutes: r.total_time_minutes as number,
    yield_quantity: (r.yield_quantity as number) ?? null,
    yield_unit: (r.yield_unit as string) ?? null,
    instructions,
    ingredients,
  };
}
