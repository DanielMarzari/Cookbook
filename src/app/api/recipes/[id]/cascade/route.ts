import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { recipeFamily, type IngredientLine } from '@/lib/variations';
import { mergeIngredients, mergeInstructions, describeCascade, type BranchReport } from '@/lib/cascade';
import type { InstructionStep } from '@/lib/types';

/**
 * Push an edit on a base recipe down into its branches.
 *
 * Called AFTER the base has been saved. The caller sends what the base looked
 * like BEFORE the edit — which it knows, because it loaded it — and the server
 * reads the after state from the database itself. Only the half the client
 * genuinely has comes from the client.
 *
 * Nothing is overwritten blind: see lib/cascade.ts for the merge. A branch that
 * had already changed a line keeps it, and the response names every such line
 * so the cook is told rather than surprised.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const body = await request.json().catch(() => ({}));

    const applyIngredients = body?.ingredients !== false;
    const applyInstructions = body?.instructions !== false;
    const before: IngredientLine[] = Array.isArray(body?.beforeIngredients) ? body.beforeIngredients : [];
    const beforeSteps: InstructionStep[] = Array.isArray(body?.beforeInstructions) ? body.beforeInstructions : [];

    const { base, variations } = recipeFamily(db, id);
    if (!base) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    if (base.id !== id) {
      // Cascading from a branch would push its edits onto its siblings, which is
      // not what a branch is. Only the stem cascades.
      return NextResponse.json({ error: 'Only a base recipe cascades to its branches' }, { status: 400 });
    }
    if (variations.length === 0) {
      return NextResponse.json({ reports: [], summary: describeCascade([]) });
    }

    const ingredientsOf = db.prepare(
      `SELECT name, quantity, unit, notes, section, ingredient_id,
              custom_calories, custom_protein, custom_carbs, custom_fat
         FROM recipe_ingredients
        WHERE recipe_id = ? AND name <> '---OR---' ORDER BY order_index`,
    );
    const stepsOf = db.prepare('SELECT instructions FROM recipes WHERE id = ?');
    const parseSteps = (rid: string): InstructionStep[] => {
      const row = stepsOf.get(rid) as { instructions: string } | undefined;
      try { return row?.instructions ? JSON.parse(row.instructions) : []; } catch { return []; }
    };

    const after = ingredientsOf.all(id) as IngredientLine[];
    const afterSteps = parseSteps(id);

    const wipe = db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?');
    const insert = db.prepare(
      `INSERT INTO recipe_ingredients
         (recipe_id, name, quantity, unit, notes, section, ingredient_id,
          custom_calories, custom_protein, custom_carbs, custom_fat, order_index)
       VALUES (@recipe_id, @name, @quantity, @unit, @notes, @section, @ingredient_id,
               @custom_calories, @custom_protein, @custom_carbs, @custom_fat, @order_index)`,
    );
    const setSteps = db.prepare('UPDATE recipes SET instructions = ?, updated_at = ? WHERE id = ?');

    const reports: BranchReport[] = [];

    // One transaction: a cascade that half-applied across four branches would be
    // worse to unpick than one that didn't run.
    db.transaction(() => {
      for (const v of variations) {
        const mine = ingredientsOf.all(v.id) as IngredientLine[];
        const report: BranchReport = {
          id: v.id, title: v.title,
          added: [], updated: [], removed: [], skipped: [],
          stepsUpdated: false, stepNote: null,
        };

        if (applyIngredients && before.length) {
          const merged = mergeIngredients(before, after, mine);
          report.added = merged.added;
          report.updated = merged.updated;
          report.removed = merged.removed;
          report.skipped = merged.skipped;

          if (merged.added.length || merged.updated.length || merged.removed.length) {
            wipe.run(v.id);
            merged.ingredients.forEach((ing, i) => {
              insert.run({
                recipe_id: v.id,
                name: ing.name,
                quantity: ing.quantity ?? null,
                unit: ing.unit ?? null,
                notes: ing.notes ?? null,
                section: ing.section ?? null,
                ingredient_id: ing.ingredient_id ?? null,
                custom_calories: ing.custom_calories ?? null,
                custom_protein: ing.custom_protein ?? null,
                custom_carbs: ing.custom_carbs ?? null,
                custom_fat: ing.custom_fat ?? null,
                order_index: i,
              });
            });
          }
        }

        if (applyInstructions && beforeSteps.length) {
          const merged = mergeInstructions(beforeSteps, afterSteps, parseSteps(v.id));
          if (merged.instructions) {
            setSteps.run(JSON.stringify(merged.instructions), new Date().toISOString(), v.id);
            report.stepsUpdated = true;
          }
          report.stepNote = merged.note;
        }

        reports.push(report);
      }
    })();

    return NextResponse.json({ reports, summary: describeCascade(reports) });
  } catch (error) {
    console.error('Error cascading to branches:', error);
    return NextResponse.json({ error: 'Failed to cascade' }, { status: 500 });
  }
}
