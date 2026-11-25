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

    // The sources row is authoritative — `source_name` on the recipe is only
    // the raw text an import arrived with. Resolved here so a version carries
    // the same "via …" line the recipe page prints when you open it directly.
    const sourceName = db.prepare('SELECT name FROM sources WHERE id = ?');
    const resolveSource = <T extends { source_id: string | null; source_name: string | null }>(r: T): T => {
      if (!r.source_id) return r;
      const row = sourceName.get(r.source_id) as { name: string } | undefined;
      if (row?.name) r.source_name = row.name;
      return r;
    };
    resolveSource(base);

    const members = variations.map((v) => {
      resolveSource(v);
      // A variation with no photo of its own shows the base's — and the framing
      // comes with it, because a crop describes an image rather than a recipe.
      // Taking the photo without the framing would show the family's picture
      // off-centre on half the branches.
      if (!v.image_url) {
        v.image_url = base.image_url;
        v.image_position = base.image_position;
        v.image_zoom = base.image_zoom;
        v.image_rotation = base.image_rotation;
      }
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
