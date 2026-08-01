import { NextRequest, NextResponse } from 'next/server';
import { getDb, hydrateRecipe } from '@/lib/db';
import { Recipe } from '@/lib/types';

/** "Spiced Nuts" -> "Spiced Nuts (copy)" -> "Spiced Nuts (copy 2)" -> … */
function copyTitle(db: ReturnType<typeof getDb>, title: string): string {
  const base = title.replace(/ \(copy(?: \d+)?\)$/, '');
  const taken = new Set(
    (db.prepare('SELECT title FROM recipes WHERE title LIKE ?').all(`${base}%`) as { title: string }[])
      .map((r) => r.title)
  );
  if (!taken.has(`${base} (copy)`)) return `${base} (copy)`;
  for (let n = 2; ; n++) if (!taken.has(`${base} (copy ${n})`)) return `${base} (copy ${n})`;
}

/**
 * Duplicate a recipe — the starting point for a variation (swap the spicing, keep
 * everything else). Copies what DESCRIBES the dish: its fields, ingredients, tags
 * and photos. Deliberately does not copy what records your history with it —
 * cook logs, meal-plan entries, collection membership, grocery items, or the
 * favourite flag — since those belong to the original, not to a fresh draft.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const source = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Recipe | undefined;
    if (!source) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    const newId = `recipe_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const now = new Date().toISOString();
    const title = copyTitle(db, source.title || 'Untitled');

    // One transaction so a partial copy can never be left behind.
    const duplicate = db.transaction(() => {
      db.prepare(
        `INSERT INTO recipes (
           id, title, description, image_url, cuisine_type, origin,
           difficulty, prep_time_minutes, cook_time_minutes, total_time_minutes,
           servings, instructions, source_url, source_name, source_author,
           source_type, is_favorite, status, image_rotation, image_position, image_zoom,
           created_at, updated_at
         )
         SELECT ?, ?, description, image_url, cuisine_type, origin,
                difficulty, prep_time_minutes, cook_time_minutes, total_time_minutes,
                servings, instructions, source_url, source_name, source_author,
                source_type, 0, 'new', image_rotation, image_position, image_zoom,
                ?, ?
         FROM recipes WHERE id = ?`
      ).run(newId, title, now, now, id);

      const ingredients = db.prepare('SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY order_index').all(id) as
        Record<string, unknown>[];
      const insertIng = db.prepare(
        `INSERT INTO recipe_ingredients (
           id, recipe_id, ingredient_id, name, quantity, unit, notes, order_index,
           custom_calories, custom_protein, custom_carbs, custom_fat
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      ingredients.forEach((ing, i) => {
        insertIng.run(
          `ri_${newId}_${i}`, newId, ing.ingredient_id ?? null, ing.name ?? null,
          ing.quantity ?? null, ing.unit ?? null, ing.notes ?? null, ing.order_index ?? i,
          ing.custom_calories ?? null, ing.custom_protein ?? null, ing.custom_carbs ?? null, ing.custom_fat ?? null
        );
      });

      db.prepare(
        'INSERT INTO recipe_tags (recipe_id, tag_id, auto_generated) SELECT ?, tag_id, auto_generated FROM recipe_tags WHERE recipe_id = ?'
      ).run(newId, id);

      // Photo rows point at the same uploaded files; deleting a recipe only clears
      // its rows, never the files, so the two copies can share them safely.
      const photos = db.prepare('SELECT url, sort_order FROM recipe_photos WHERE recipe_id = ? ORDER BY sort_order').all(id) as
        { url: string; sort_order: number }[];
      const insertPhoto = db.prepare('INSERT INTO recipe_photos (id, recipe_id, url, sort_order, created_at) VALUES (?, ?, ?, ?, ?)');
      photos.forEach((p, i) => insertPhoto.run(`rp_${newId}_${i}`, newId, p.url, p.sort_order ?? i, now));
    });
    duplicate();

    const created = db.prepare('SELECT * FROM recipes WHERE id = ?').get(newId) as Recipe;
    return NextResponse.json(hydrateRecipe(created), { status: 201 });
  } catch (error) {
    console.error('Error duplicating recipe:', error);
    return NextResponse.json({ error: 'Failed to duplicate recipe' }, { status: 500 });
  }
}
