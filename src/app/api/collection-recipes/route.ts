import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    let query = 'SELECT * FROM collection_recipes WHERE 1=1';
    const params: any[] = [];

    const collectionId = searchParams.get('collection_id');
    if (collectionId) {
      query += ' AND collection_id = ?';
      params.push(collectionId);
    }

    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching collection recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch collection recipes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO collection_recipes (collection_id, recipe_id)
      VALUES (?, ?)
    `);

    stmt.run(body.collection_id, body.recipe_id);
    return NextResponse.json(body);
  } catch (error) {
    console.error('Error creating collection recipe:', error);
    return NextResponse.json({ error: 'Failed to create collection recipe' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const collectionId = searchParams.get('collection_id');
    const recipeId = searchParams.get('recipe_id');

    if (collectionId && recipeId) {
      db.prepare('DELETE FROM collection_recipes WHERE collection_id = ? AND recipe_id = ?')
        .run(collectionId, recipeId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'collection_id and recipe_id required' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting collection recipe:', error);
    return NextResponse.json({ error: 'Failed to delete collection recipe' }, { status: 500 });
  }
}
