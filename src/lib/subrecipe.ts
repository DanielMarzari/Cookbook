// Recipes that are made of other recipes. A recipe_ingredients row carrying a
// `child_recipe_id` doesn't name a raw ingredient — it says "use this much of
// that recipe", so cannoli filling can be its own recipe and still be an
// ingredient in a cake.
//
// Everything here is read-only and defensive: a recipe referencing itself (even
// through a chain) must never hang the page, so every walk is depth-limited and
// tracks the path it came in on.
import type Database from 'better-sqlite3';
import { convertUnitToGrams } from '@/lib/units';

type DB = Database.Database;

const MAX_DEPTH = 5; // deeper than any real dish; the guard is for cycles, not nesting

export interface YieldInfo {
  yield_quantity?: number | null;
  yield_unit?: string | null;
}

export interface ChildRow {
  name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
  section?: string | null;
  child_recipe_id?: string | null;
}

/**
 * How much of a sub-recipe a parent is asking for, as a multiplier on the child.
 *
 * When the child declares what it makes ("makes 2 cups") and the parent asks in
 * a compatible unit, this is a true scale — 1 cup of a 2-cup filling is 0.5x the
 * whole thing. Otherwise it falls back to counting batches, which is always
 * meaningful even with no yield recorded.
 */
export function subRecipeScale(
  quantity: number,
  unit: string,
  child: YieldInfo
): { scale: number; basis: 'yield' | 'batch' } {
  const qty = quantity > 0 ? quantity : 1;
  const parentUnit = (unit || '').toLowerCase().trim();
  const childUnit = (child.yield_unit || '').toLowerCase().trim();
  const childQty = child.yield_quantity ?? 0;

  // No yield recorded, or the parent is explicitly counting batches.
  if (!childQty || !childUnit || !parentUnit || parentUnit === 'batch') {
    return { scale: qty, basis: 'batch' };
  }
  // Same unit needs no conversion — and works for counts ("6 of 12 shells").
  if (parentUnit === childUnit) return { scale: qty / childQty, basis: 'yield' };

  const parentGrams = convertUnitToGrams(qty, parentUnit);
  const childGrams = convertUnitToGrams(childQty, childUnit);
  if (parentGrams != null && childGrams != null && childGrams > 0) {
    return { scale: parentGrams / childGrams, basis: 'yield' };
  }
  // Units that don't convert into each other (2 cloves of a 3-cup sauce) — the
  // honest answer is that we can't scale, so treat it as batches.
  return { scale: qty, basis: 'batch' };
}

export interface FlatIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
  /** Names of the sub-recipes this came through, outermost first. */
  via: string[];
}

/**
 * Resolve a recipe down to real ingredients, following sub-recipe references and
 * scaling each one by how much of its parent is used. This is what the Flavor Lab
 * and nutrition want: "Cannoli Filling" is not an ingredient, ricotta is.
 */
export function flattenRecipe(db: DB, recipeId: string): { ingredients: FlatIngredient[]; cycle: boolean } {
  const rows = db.prepare(
    `SELECT name, quantity, unit, notes, section, child_recipe_id
     FROM recipe_ingredients WHERE recipe_id = ? ORDER BY order_index`
  );
  const yieldOf = db.prepare('SELECT yield_quantity, yield_unit, title FROM recipes WHERE id = ?');

  const out: FlatIngredient[] = [];
  let cycle = false;

  const walk = (id: string, scale: number, path: string[], via: string[]): void => {
    if (path.includes(id) || path.length >= MAX_DEPTH) {
      cycle = cycle || path.includes(id);
      return;
    }
    for (const row of rows.all(id) as ChildRow[]) {
      if (row.name === '---OR---') continue;
      if (row.child_recipe_id) {
        const child = yieldOf.get(row.child_recipe_id) as (YieldInfo & { title: string }) | undefined;
        if (!child) continue;
        const { scale: childScale } = subRecipeScale(row.quantity, row.unit, child);
        walk(row.child_recipe_id, scale * childScale, [...path, id], [...via, child.title]);
      } else {
        out.push({
          name: row.name,
          quantity: (row.quantity || 0) * scale,
          unit: row.unit,
          notes: row.notes,
          via,
        });
      }
    }
  };
  walk(recipeId, 1, [], []);
  return { ingredients: out, cycle };
}

/**
 * Would linking `childId` into `parentId` create a loop? Checked before saving,
 * so a cycle can't be written in the first place.
 */
export function wouldCycle(db: DB, parentId: string, childId: string): boolean {
  if (parentId === childId) return true;
  const kids = db.prepare('SELECT child_recipe_id FROM recipe_ingredients WHERE recipe_id = ? AND child_recipe_id IS NOT NULL');
  const seen = new Set<string>();
  const stack = [childId];
  while (stack.length) {
    const id = stack.pop()!;
    if (id === parentId) return true;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const r of kids.all(id) as { child_recipe_id: string }[]) stack.push(r.child_recipe_id);
  }
  return false;
}
