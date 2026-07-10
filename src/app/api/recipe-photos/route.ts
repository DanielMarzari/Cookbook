import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RecipePhoto } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const recipeId = request.nextUrl.searchParams.get('recipe_id');
    if (!recipeId) {
      return NextResponse.json({ error: 'recipe_id required' }, { status: 400 });
    }
    const photos = db
      .prepare('SELECT * FROM recipe_photos WHERE recipe_id = ? ORDER BY sort_order ASC, created_at ASC')
      .all(recipeId) as RecipePhoto[];
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching recipe photos:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    if (!body.recipe_id || !body.url) {
      return NextResponse.json({ error: 'recipe_id and url required' }, { status: 400 });
    }

    const id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Default sort_order to the end of the current gallery.
    let sortOrder = body.sort_order;
    if (sortOrder === undefined || sortOrder === null) {
      const max = db
        .prepare('SELECT MAX(sort_order) AS m FROM recipe_photos WHERE recipe_id = ?')
        .get(body.recipe_id) as { m: number | null };
      sortOrder = (max.m ?? -1) + 1;
    }

    db.prepare(`
      INSERT INTO recipe_photos (id, recipe_id, url, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, body.recipe_id, body.url, sortOrder, now);

    return NextResponse.json({ id, recipe_id: body.recipe_id, url: body.url, sort_order: sortOrder, created_at: now });
  } catch (error) {
    console.error('Error creating recipe photo:', error);
    return NextResponse.json({ error: 'Failed to create recipe photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    db.prepare('DELETE FROM recipe_photos WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe photo:', error);
    return NextResponse.json({ error: 'Failed to delete recipe photo' }, { status: 500 });
  }
}
