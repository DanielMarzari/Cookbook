import { NextRequest, NextResponse } from 'next/server';
import { getDb, hydrateRecipe } from '@/lib/db';
import { Recipe } from '@/lib/types';
import { getDraft, saveDraft, discardDraft, applyPayload, snapshotRecipe, DraftPayload } from '@/lib/drafts';
import { archiveRecipe } from '@/lib/archive';

/** GET — the staged draft for this recipe, plus the recipe as it stands now. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const current = snapshotRecipe(db, id);
    if (!current) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    return NextResponse.json({ draft: getDraft(db, id), current });
  } catch (error) {
    console.error('Error reading draft:', error);
    return NextResponse.json({ error: 'Failed to read draft' }, { status: 500 });
  }
}

/** PUT — stage changes without touching the recipe. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const payload = (await request.json()) as DraftPayload;
    saveDraft(db, id, payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}

/** DELETE — throw the staged changes away, leaving the recipe untouched. */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    discardDraft(getDb(), id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error discarding draft:', error);
    return NextResponse.json({ error: 'Failed to discard draft' }, { status: 500 });
  }
}

/**
 * POST — commit the draft, one of two ways:
 *   { mode: 'update' }                       write it back to this recipe
 *   { mode: 'branch', title, label }         start a variation carrying it
 *
 * Branching keeps the family flat: a variation of a variation becomes a sibling
 * under the same base, so a family stays one base plus its variations.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const { mode, title, label } = await request.json();

    const source = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Recipe & { parent_recipe_id?: string } | undefined;
    if (!source) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    const payload = getDraft(db, id);
    if (!payload) return NextResponse.json({ error: 'Nothing staged to commit' }, { status: 400 });

    if (mode === 'update') {
      db.transaction(() => {
        // Committing overwrites the recipe wholesale; archive what it was.
        archiveRecipe(db, id, 'commit-draft');
        applyPayload(db, id, payload);
        discardDraft(db, id);
      })();
      const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Recipe;
      return NextResponse.json({ mode: 'update', recipe: hydrateRecipe(updated) });
    }

    if (mode === 'branch') {
      const baseId = source.parent_recipe_id || id;
      const newId = `recipe_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      const now = new Date().toISOString();
      const variationTitle = (title || payload.title || `${source.title} variation`).trim();

      db.transaction(() => {
        // Start from the source recipe so the variation inherits everything the
        // draft doesn't mention (photo, cuisine, source, difficulty…).
        db.prepare(
          `INSERT INTO recipes (
             id, title, description, image_url, cuisine_type, origin, difficulty,
             prep_time_minutes, cook_time_minutes, total_time_minutes, servings,
             instructions, source_url, source_name, source_author, source_type,
             is_favorite, status, image_rotation, image_position, image_zoom,
             notes, yield_quantity, yield_unit, parent_recipe_id, variation_of_label,
             created_at, updated_at
           )
           SELECT ?, ?, description, image_url, cuisine_type, origin, difficulty,
                  prep_time_minutes, cook_time_minutes, total_time_minutes, servings,
                  instructions, source_url, source_name, source_author, source_type,
                  0, 'new', image_rotation, image_position, image_zoom,
                  notes, yield_quantity, yield_unit, ?, ?, ?, ?
           FROM recipes WHERE id = ?`
        ).run(newId, variationTitle, baseId, label || null, now, now, id);

        // Carry over the source's ingredients first, then let the draft overwrite
        // them — so a draft that only edited the title keeps the full list.
        const rows = db.prepare('SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY order_index').all(id) as Record<string, unknown>[];
        const ins = db.prepare(
          `INSERT INTO recipe_ingredients
             (id, recipe_id, ingredient_id, name, quantity, unit, notes, section, child_recipe_id, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        rows.forEach((r, i) => {
          ins.run(
            `ri_${newId}_${i}`, newId, r.ingredient_id ?? null, r.name ?? null,
            r.quantity ?? 0, r.unit ?? '', r.notes ?? null, r.section ?? null,
            r.child_recipe_id ?? null, i
          );
        });

        // The explicit variation title wins — the draft carries the SOURCE's title,
        // which would otherwise overwrite it and leave two identically-named recipes.
        applyPayload(db, newId, { ...payload, title: variationTitle });
        discardDraft(db, id);
      })();

      const created = db.prepare('SELECT * FROM recipes WHERE id = ?').get(newId) as Recipe;
      return NextResponse.json({ mode: 'branch', recipe: hydrateRecipe(created) }, { status: 201 });
    }

    return NextResponse.json({ error: "mode must be 'update' or 'branch'" }, { status: 400 });
  } catch (error) {
    console.error('Error committing draft:', error);
    return NextResponse.json({ error: 'Failed to commit draft' }, { status: 500 });
  }
}
