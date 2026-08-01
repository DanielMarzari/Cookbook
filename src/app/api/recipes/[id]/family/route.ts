import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { recipeFamily, diffIngredients, describeDiff, IngredientLine } from '@/lib/variations';
import type { InstructionStep } from '@/lib/types';

/**
 * A recipe's whole family — the base, its variations, and for each variation
 * exactly what it changes. The recipe page uses this to render swap chips only
 * where the versions actually differ, and to leave everything else alone.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const { base, variations } = recipeFamily(db, id);
    if (!base) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    const ingredientsOf = db.prepare(
      `SELECT name, quantity, unit, notes, section, ingredient_id,
              custom_calories, custom_protein, custom_carbs, custom_fat
       FROM recipe_ingredients
       WHERE recipe_id = ? AND name <> '---OR---' ORDER BY order_index`
    );
    const baseIngredients = ingredientsOf.all(base.id) as IngredientLine[];

    // Each version's full ingredient list and steps ride along, so switching
    // versions on the recipe page is instant and needs no second request.
    const stepsOf = db.prepare('SELECT instructions FROM recipes WHERE id = ?');
    const parseSteps = (id: string): InstructionStep[] => {
      const row = stepsOf.get(id) as { instructions: string } | undefined;
      try { return row?.instructions ? JSON.parse(row.instructions) : []; } catch { return []; }
    };

    const members = variations.map((v) => {
      // a variation with no photo of its own shows the base's
      if (!v.image_url) v.image_url = base.image_url;
      const ingredients = ingredientsOf.all(v.id) as IngredientLine[];
      const d = diffIngredients(baseIngredients, ingredients);
      return {
        ...v,
        ingredients,
        instructions: parseSteps(v.id),
        diff: { added: d.added, removed: d.removed, changed: d.changed },
        changedKeys: [...d.added, ...d.changed.map((c) => c.to)].map((i) => `${(i.section || '').toLowerCase()}|${i.name.toLowerCase()}`),
        summary: describeDiff(d),
      };
    });

    return NextResponse.json({
      base,
      baseIngredients,
      variations: members,
      // handy for the home grid: is this a branched recipe at all?
      isBranched: members.length > 0,
      count: members.length,
    });
  } catch (error) {
    console.error('Error reading recipe family:', error);
    return NextResponse.json({ error: 'Failed to read recipe family' }, { status: 500 });
  }
}
