import { NextRequest, NextResponse } from 'next/server';
import { getDb, hydrateRecipe } from '@/lib/db';
import { Recipe } from '@/lib/types';
import { archiveRecipe } from '@/lib/archive';
import { resolvePhoto } from '@/lib/variations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();

    const stmt = db.prepare('SELECT * FROM recipes WHERE id = ?');
    const recipe = stmt.get(id) as Recipe | undefined;

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // The source row is authoritative; source_name survives only as the raw text
    // the recipe was imported with, kept for reference on the sources page.
    const withSource = hydrateRecipe(recipe) as unknown as Record<string, unknown>;
    if (withSource.source_id) {
      withSource.source = db.prepare('SELECT id, name, kind, featured FROM sources WHERE id = ?').get(withSource.source_id) || null;
    }
    return NextResponse.json(resolvePhoto(db, withSource as never));
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const body = await request.json();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE recipes SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        cuisine_type = COALESCE(?, cuisine_type),
        origin = COALESCE(?, origin),
        difficulty = COALESCE(?, difficulty),
        prep_time_minutes = COALESCE(?, prep_time_minutes),
        cook_time_minutes = COALESCE(?, cook_time_minutes),
        total_time_minutes = COALESCE(?, total_time_minutes),
        servings = COALESCE(?, servings),
        instructions = COALESCE(?, instructions),
        source_url = COALESCE(?, source_url),
        source_name = COALESCE(?, source_name),
        source_author = COALESCE(?, source_author),
        source_type = COALESCE(?, source_type),
        is_favorite = COALESCE(?, is_favorite),
        notes = COALESCE(?, notes),
        yield_quantity = COALESCE(?, yield_quantity),
        yield_unit = COALESCE(?, yield_unit),
        meal_type = COALESCE(?, meal_type),
        is_mine = COALESCE(?, is_mine),
        source_id = COALESCE(?, source_id),
        status = COALESCE(?, status),
        image_rotation = COALESCE(?, image_rotation),
        image_position = COALESCE(?, image_position),
        image_zoom = COALESCE(?, image_zoom),
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      body.title || null,
      body.description || null,
      body.image_url || null,
      body.cuisine_type || null,
      body.origin || null,
      body.difficulty || null,
      body.prep_time_minutes !== undefined ? body.prep_time_minutes : null,
      body.cook_time_minutes !== undefined ? body.cook_time_minutes : null,
      body.total_time_minutes !== undefined ? body.total_time_minutes : null,
      body.servings !== undefined ? body.servings : null,
      body.instructions ? JSON.stringify(body.instructions) : null,
      body.source_url || null,
      body.source_name || null,
      body.source_author || null,
      body.source_type || null,
      body.is_favorite !== undefined ? (body.is_favorite ? 1 : 0) : null,
      // not `|| null` — an empty string has to survive so notes can be cleared
      body.notes !== undefined ? body.notes : null,
      body.yield_quantity !== undefined ? body.yield_quantity : null,
      body.yield_unit !== undefined ? body.yield_unit : null,
      body.meal_type !== undefined ? body.meal_type : null,
      body.is_mine !== undefined ? (body.is_mine ? 1 : 0) : null,
      body.source_id !== undefined ? body.source_id : null,
      body.status || null,
      body.image_rotation !== undefined ? body.image_rotation : null,
      body.image_position !== undefined ? body.image_position : null,
      body.image_zoom !== undefined ? body.image_zoom : null,
      now,
      id
    );

    const getStmt = db.prepare('SELECT * FROM recipes WHERE id = ?');
    const updated = getStmt.get(id) as Recipe | undefined;

    return NextResponse.json(hydrateRecipe(updated));
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();

    // Remove all related rows in one transaction so a mid-delete failure can't
    // leave the recipe half-deleted. recipe_ingredients / recipe_tags /
    // collection_recipes are owned by the recipe and get deleted; grocery list
    // items are the user's shopping data, so we only null their recipe link.
    const cascadeDelete = db.transaction((recipeId: string) => {
      // Snapshot first — for the next 24 hours this delete can be undone.
      archiveRecipe(db, recipeId, 'delete');
      // Other recipes may use this one as an ingredient. Drop the link but keep
      // the row: "Cannoli Filling" is still a real thing the recipe calls for,
      // it just no longer points anywhere.
      db.prepare('UPDATE recipe_ingredients SET child_recipe_id = NULL WHERE child_recipe_id = ?').run(recipeId);
      // Variations are recipes in their own right — deleting the base must not
      // strand them. Cutting the link promotes each one to a base of its own,
      // which keeps them reachable instead of invisible everywhere.
      db.prepare('UPDATE recipes SET parent_recipe_id = NULL WHERE parent_recipe_id = ?').run(recipeId);
      // recipe_drafts has a FK to recipes, so a leftover row blocks the delete.
      db.prepare('DELETE FROM recipe_drafts WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM collection_recipes WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM recipe_tags WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM cook_logs WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM meal_plan WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM recipe_photos WHERE recipe_id = ?').run(recipeId);
      db.prepare('UPDATE grocery_list_items SET recipe_id = NULL WHERE recipe_id = ?').run(recipeId);
      db.prepare('DELETE FROM recipes WHERE id = ?').run(recipeId);
    });
    cascadeDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
