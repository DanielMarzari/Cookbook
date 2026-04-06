import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RecipeTag } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    let query = 'SELECT * FROM recipe_tags WHERE 1=1';
    const params: any[] = [];

    const recipeId = searchParams.get('recipe_id');
    if (recipeId) {
      query += ' AND recipe_id = ?';
      params.push(recipeId);
    }

    const stmt = db.prepare(query);
    const recipeTags = stmt.all(...params) as RecipeTag[];
    return NextResponse.json(recipeTags);
  } catch (error) {
    console.error('Error fetching recipe tags:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const stmt = db.prepare(`
      INSERT INTO recipe_tags (recipe_id, tag_id, auto_generated)
      VALUES (?, ?, ?)
    `);

    stmt.run(body.recipe_id, body.tag_id, body.auto_generated ? 1 : 0);
    return NextResponse.json(body);
  } catch (error) {
    console.error('Error creating recipe tag:', error);
    return NextResponse.json({ error: 'Failed to create recipe tag' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const recipeId = searchParams.get('recipe_id');
    const tagId = searchParams.get('tag_id');

    if (recipeId && tagId) {
      db.prepare('DELETE FROM recipe_tags WHERE recipe_id = ? AND tag_id = ?').run(recipeId, tagId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'recipe_id and tag_id required' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting recipe tag:', error);
    return NextResponse.json({ error: 'Failed to delete recipe tag' }, { status: 500 });
  }
}
