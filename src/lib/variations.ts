// Recipes that branch. A variation points at the recipe it came from via
// `parent_recipe_id`; the base itself has none. Families are deliberately kept
// FLAT — a variation of a variation becomes a sibling, not a grandchild — because
// "Spiced Nuts and its four variations" is how a cook thinks about it, and a tree
// two levels deep stops being scannable on a recipe page.
import type Database from 'better-sqlite3';

type DB = Database.Database;

export interface FamilyMember {
  id: string;
  title: string;
  image_url: string | null;
  variation_of_label: string | null;
  parent_recipe_id: string | null;
}

export interface IngredientLine {
  name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
  section?: string | null;
}

/** The base a recipe belongs to: itself if it is one, otherwise its parent. */
export function baseIdOf(db: DB, recipeId: string): string {
  const r = db.prepare('SELECT parent_recipe_id FROM recipes WHERE id = ?').get(recipeId) as
    | { parent_recipe_id: string | null }
    | undefined;
  return r?.parent_recipe_id || recipeId;
}

/** Base + every variation hanging off it, base first. */
export function recipeFamily(db: DB, recipeId: string): { base: FamilyMember | null; variations: FamilyMember[] } {
  const baseId = baseIdOf(db, recipeId);
  const cols = 'id, title, image_url, variation_of_label, parent_recipe_id';
  const base = db.prepare(`SELECT ${cols} FROM recipes WHERE id = ?`).get(baseId) as FamilyMember | undefined;
  const variations = db.prepare(
    `SELECT ${cols} FROM recipes WHERE parent_recipe_id = ? ORDER BY created_at`
  ).all(baseId) as FamilyMember[];
  return { base: base || null, variations };
}

// Keyed by section AND name: a dough recipe legitimately lists flour twice, once
// for the biga and once for the final mix, and those are not the same line.
const key = (i: IngredientLine) =>
  `${(i.section || '').toLowerCase().trim()}|${i.name.toLowerCase().replace(/\s+/g, ' ').trim()}`;
const sameAmount = (a: IngredientLine, b: IngredientLine) =>
  Math.abs((a.quantity || 0) - (b.quantity || 0)) < 1e-9 &&
  (a.unit || '').toLowerCase() === (b.unit || '').toLowerCase();

export interface IngredientDiff {
  added: IngredientLine[];
  removed: IngredientLine[];
  changed: { from: IngredientLine; to: IngredientLine }[];
  /** Keys that are identical in both — the lines a variation inherits untouched. */
  sharedKeys: string[];
}

/**
 * What one variation actually changes about the base. This is the whole point of
 * the branch model: a variation is usually three lines different, and saying so
 * is more useful than reprinting the recipe.
 */
export function diffIngredients(base: IngredientLine[], variant: IngredientLine[]): IngredientDiff {
  const baseByKey = new Map(base.map((i) => [key(i), i]));
  const variantByKey = new Map(variant.map((i) => [key(i), i]));

  const added: IngredientLine[] = [];
  const changed: { from: IngredientLine; to: IngredientLine }[] = [];
  const sharedKeys: string[] = [];

  for (const [k, v] of variantByKey) {
    const b = baseByKey.get(k);
    if (!b) added.push(v);
    else if (!sameAmount(b, v)) changed.push({ from: b, to: v });
    else sharedKeys.push(k);
  }
  const removed = [...baseByKey.entries()].filter(([k]) => !variantByKey.has(k)).map(([, v]) => v);
  return { added, removed, changed, sharedKeys };
}

/** A one-line human summary of a variation, e.g. "+ cinnamon, maple syrup · − chili". */
export function describeDiff(d: IngredientDiff): string {
  const parts: string[] = [];
  if (d.added.length) parts.push(`+ ${d.added.map((i) => i.name.toLowerCase()).join(', ')}`);
  if (d.removed.length) parts.push(`− ${d.removed.map((i) => i.name.toLowerCase()).join(', ')}`);
  if (d.changed.length) parts.push(`${d.changed.length} amount${d.changed.length > 1 ? 's' : ''} changed`);
  return parts.join(' · ') || 'same ingredients';
}
