import { NextRequest, NextResponse } from 'next/server';
import { getDb, hydrateRecipe } from '@/lib/db';
import { Recipe, InstructionStep } from '@/lib/types';
import { archiveRecipe } from '@/lib/archive';

/**
 * Lift one section out into a recipe of its own, leaving a reference behind.
 *
 * This is the "cannoli filling is really its own recipe" move: the section's
 * ingredients and steps move to a new recipe, and the parent keeps a single
 * ingredient row pointing at it. Nothing is lost and nothing is duplicated —
 * afterwards the filling can be used in a cake without being retyped.
 *
 * POST { section: "Filling", title?: "Cannoli Filling" }
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const { section, title } = await request.json();
    if (!section || typeof section !== 'string') {
      return NextResponse.json({ error: 'A section name is required' }, { status: 400 });
    }

    const parent = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Recipe | undefined;
    if (!parent) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    const sectionRows = db.prepare(
      'SELECT * FROM recipe_ingredients WHERE recipe_id = ? AND section = ? ORDER BY order_index'
    ).all(id, section) as Record<string, unknown>[];
    if (sectionRows.length === 0) {
      return NextResponse.json({ error: `No ingredients in section "${section}"` }, { status: 400 });
    }

    // `instructions` is a TEXT column holding JSON — a raw SELECT hands back a
    // string, so this must be parsed. Trusting the `as Recipe` cast here silently
    // produced an empty step list and wiped the parent's whole method.
    const steps: InstructionStep[] = (() => {
      const raw = (parent as unknown as { instructions: unknown }).instructions;
      if (Array.isArray(raw)) return raw as InstructionStep[];
      if (typeof raw === 'string') {
        try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
      }
      return [];
    })();
    const sectionSteps = steps.filter((s) => s.section === section);
    const remainingSteps = steps.filter((s) => s.section !== section);

    const childId = `recipe_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const now = new Date().toISOString();
    const childTitle = (title || `${parent.title} — ${section}`).trim();
    const firstOrder = Number(sectionRows[0].order_index ?? 0);

    const promote = db.transaction(() => {
      // The parent loses ingredients and steps here — keep a way back.
      archiveRecipe(db, id, 'promote-section');
      // The new recipe inherits the parent's context but starts its own history.
      db.prepare(
        `INSERT INTO recipes (
           id, title, description, cuisine_type, difficulty, prep_time_minutes,
           cook_time_minutes, total_time_minutes, servings, instructions,
           source_type, is_favorite, status, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?, ?, 'user', 0, 'new', ?, ?)`
      ).run(
        childId,
        childTitle,
        `The ${section.toLowerCase()} from ${parent.title}.`,
        parent.cuisine_type || 'Other',
        parent.difficulty || 'medium',
        parent.servings || 1,
        JSON.stringify(sectionSteps.map((s, i) => ({ ...s, step_number: i + 1, section: undefined }))),
        now,
        now
      );

      // Move the ingredients across, dropping the now-meaningless section label.
      const insertChild = db.prepare(
        `INSERT INTO recipe_ingredients (
           id, recipe_id, ingredient_id, name, quantity, unit, notes, order_index,
           child_recipe_id, custom_calories, custom_protein, custom_carbs, custom_fat
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      sectionRows.forEach((r, i) => {
        insertChild.run(
          `ri_${childId}_${i}`, childId, r.ingredient_id ?? null, r.name ?? null,
          r.quantity ?? null, r.unit ?? null, r.notes ?? null, i,
          // a section can already hold a sub-recipe reference; keep the link
          r.child_recipe_id ?? null,
          r.custom_calories ?? null, r.custom_protein ?? null, r.custom_carbs ?? null, r.custom_fat ?? null
        );
      });
      db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ? AND section = ?').run(id, section);

      // Leave one row behind that points at the new recipe, where the section was.
      db.prepare(
        `INSERT INTO recipe_ingredients (id, recipe_id, name, quantity, unit, order_index, child_recipe_id)
         VALUES (?, ?, ?, 1, 'batch', ?, ?)`
      ).run(`ri_${childId}_ref`, id, childTitle, firstOrder, childId);

      db.prepare('UPDATE recipes SET instructions = ?, updated_at = ? WHERE id = ?').run(
        JSON.stringify(remainingSteps.map((s, i) => ({ ...s, step_number: i + 1 }))),
        now,
        id
      );
    });
    promote();

    const child = db.prepare('SELECT * FROM recipes WHERE id = ?').get(childId) as Recipe;
    return NextResponse.json(
      { recipe: hydrateRecipe(child), movedIngredients: sectionRows.length, movedSteps: sectionSteps.length },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error promoting section:', error);
    return NextResponse.json({ error: 'Failed to promote section' }, { status: 500 });
  }
}
