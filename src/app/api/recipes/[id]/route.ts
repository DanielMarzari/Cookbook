import { NextRequest, NextResponse } from 'next/server';
import { getDb, hydrateRecipe } from '@/lib/db';
import { Recipe } from '@/lib/types';

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

    return NextResponse.json(hydrateRecipe(recipe));
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
        status = COALESCE(?, status),
        image_rotation = COALESCE(?, image_rotation),
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
      body.status || null,
      body.image_rotation !== undefined ? body.image_rotation : null,
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

    // Delete related data first
    db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(id);
    db.prepare('DELETE FROM collection_recipes WHERE recipe_id = ?').run(id);
    db.prepare('DELETE FROM recipe_tags WHERE recipe_id = ?').run(id);

    // Delete the recipe
    const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
